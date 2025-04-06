// src/docker.ts
import Docker from "dockerode";
import os from "node:os";

let docker: Docker;

if (os.platform() === "win32") {
  docker = new Docker({ host: "localhost", port: 2375 });
} else {
  docker = new Docker({ socketPath: "/var/run/docker.sock" });
}

export default docker;
