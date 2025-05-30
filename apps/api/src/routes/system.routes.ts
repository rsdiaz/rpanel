import express, { Router } from "express";
import * as os from "node:os";
import docker from "../docker";
import checkDiskSpace from "check-disk-space";
import { Server } from "socket.io";
import si from "systeminformation";

const router: Router = express.Router();

// Función para configurar Socket.IO
export function setupSocketIO(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    // Emitir información del sistema periódicamente
    const interval = setInterval(async () => {
      const [info, containers, cpuUsage, disk, networkUsage] = await Promise.all([
        docker.info(),
        docker.listContainers({ all: true }),
        getCPUUsage(),
        checkDiskSpace(process.platform === "win32" ? "C:" : "/"),
        getNetworkUsage(),
      ]);

      const cpus = os.cpus();
      const memoryTotal = os.totalmem();
      const memoryFree = os.freemem();
      const memoryUsed = memoryTotal - memoryFree;

      const diskTotal = disk.size;
      const diskFree = disk.free;
      const diskUsed = diskTotal - diskFree;

      // Emitir datos del sistema al cliente
      socket.emit("system-update", {
        system: {
          cpu: {
            count: cpus.length,
            model: cpus[0]?.model,
            usagePercent: Number(cpuUsage.toFixed(2)),
          },
          memory: {
            total: memoryTotal / 1024 / 1024 / 1024,
            free: memoryFree / 1024 / 1024 / 1024,
            used: memoryUsed / 1024 / 1024 / 1024,
            usedPercent: Number(((memoryUsed / memoryTotal) * 100).toFixed(2)),
          },
          disk: {
            total: diskTotal / 1024 / 1024 / 1024,
            free: diskFree / 1024 / 1024 / 1024,
            used: diskUsed / 1024 / 1024 / 1024,
            usedPercent: Number(((diskUsed / diskTotal) * 100).toFixed(2)),
          },
          network: networkUsage,
          platform: os.platform(),
          arch: os.arch(),
          uptime: os.uptime(),
        },
        docker: {
          info,
          containers: containers.map((c) => ({
            id: c.Id,
            names: c.Names,
            image: c.Image,
            state: c.State,
            status: c.Status,
            labels: c.Labels,
            ports: c.Ports,
          })),
        },
      });
    }, 3000); // Emitir cada 5 segundos

    socket.on("disconnect", () => {
      console.log(`Socket desconectado: ${socket.id}`);
      clearInterval(interval); // Limpiar el intervalo al desconectar
    });
  });
}

// Funciones auxiliares
function getCPUInfo() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  }

  return {
    idle: totalIdle / cpus.length,
    total: totalTick / cpus.length,
  };
}

function getCPUUsage(): Promise<number> {
  const start = getCPUInfo();

  return new Promise((resolve) => {
    setTimeout(() => {
      const end = getCPUInfo();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      const usage = (1 - idleDiff / totalDiff) * 100;
      resolve(usage);
    }, 1000);
  });
}

async function getNetworkUsage() {
  const interfaces = await si.networkInterfaces();
  const statsBefore = await si.networkStats();

  // Esperar 1 segundo para obtener el delta
  await new Promise((res) => setTimeout(res, 1000));

  const statsAfter = await si.networkStats();

  const usage = statsAfter.map((stat, index) => {
    const rx = stat.rx_bytes - (statsBefore[index]?.rx_bytes ?? 0);
    const tx = stat.tx_bytes - (statsBefore[index]?.tx_bytes ?? 0);
    return {
      iface: stat.iface,
      rxBytesPerSec: rx,
      txBytesPerSec: tx,
    };
  });

  return usage;
}

router.get("/", async (_, res) => {
  console.log("sytema");
  const [info, containers, cpuUsage, disk, networkUsage] = await Promise.all([
    docker.info(),
    docker.listContainers({ all: true }),
    getCPUUsage(),
    checkDiskSpace(process.platform === "win32" ? "C:" : "/"),
    getNetworkUsage(),
  ]);

  const cpus = os.cpus();
  const memoryTotal = os.totalmem();
  const memoryFree = os.freemem();
  const memoryUsed = memoryTotal - memoryFree;

  const diskTotal = disk.size;
  const diskFree = disk.free;
  const diskUsed = diskTotal - diskFree;

  res.json({
    system: {
      cpu: {
        count: cpus.length,
        model: cpus[0]?.model,
        usagePercent: Number(cpuUsage.toFixed(2)),
      },
      memory: {
        total: memoryTotal / 1024 / 1024 / 1024,
        free: memoryFree / 1024 / 1024 / 1024,
        used: memoryUsed / 1024 / 1024 / 1024,
        usedPercent: Number(((memoryUsed / memoryTotal) * 100).toFixed(2)),
      },
      disk: {
        total: diskTotal / 1024 / 1024 / 1024,
        free: diskFree / 1024 / 1024 / 1024,
        used: diskUsed / 1024 / 1024 / 1024,
        usedPercent: Number(((diskUsed / diskTotal) * 100).toFixed(2)),
      },
      network: networkUsage,
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
    },
    docker: {
      info,
      containers: containers.map((c) => ({
        id: c.Id,
        names: c.Names,
        image: c.Image,
        state: c.State,
        status: c.Status,
        labels: c.Labels,
        ports: c.Ports,
      })),
    },
  });
});

export default router;