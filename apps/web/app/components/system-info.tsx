/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Container, Cpu, Database, MemoryStick, PcCase } from "lucide-react";
import { useEffect, useState } from "react";

export default function SystemInfo() {
  const [containers, setContainers] = useState<any[]>([]);
  const [systemInfo, setSystemInfo] = useState<Record<any, any>>()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3004/system")
      .then((res) => res.json())
      .then((json) => {
        setContainers(json.docker.containers);
        setSystemInfo(json.system)
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Cargando datos del sistema...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold flex items-center gap-4">
        Sistema
      </h1>
      <div className="flex gap-4">
        <Card className="bg-background rounded w-full">
          <CardHeader>
            <CardDescription className="flex gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Badge
                  variant={"outline"}
                  className="rounded-full p-1 bg-white text-foreground"
                >
                  <Cpu />
                </Badge>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  {systemInfo?.cpu?.usagePercent.toFixed(2)}%
                </CardTitle>
              </div>
              <div>
                <Badge
                  variant={"outline"}
                  className="flex gap-1 rounded-lg text-xs bg-white"
                >
                  {/* <TrendingUpIcon className="size-3" /> */}
                  {systemInfo?.cpu.count} / {systemInfo?.memory.total.toFixed(2)}{" "}
                  GB
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-background rounded w-full">
          <CardHeader>
            <CardDescription className="flex gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Badge
                  variant={"outline"}
                  className="rounded-full p-1 bg-white text-foreground"
                >
                  <MemoryStick />
                </Badge>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  {systemInfo?.memory?.usedPercent.toFixed(2)}%
                </CardTitle>
              </div>
              <div>
                <Badge
                  variant={"outline"}
                  className="flex gap-1 rounded-lg text-xs bg-white"
                >
                  {/* <TrendingUpIcon className="size-3" /> */}
                  {systemInfo?.memory.used.toFixed(2)} /{" "}
                  {systemInfo?.memory.total.toFixed(2)} GB
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-background rounded w-full">
          <CardHeader>
            <CardDescription className="flex gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Badge
                  variant={"outline"}
                  className="rounded-full p-1 bg-white text-foreground"
                >
                  <Database />
                </Badge>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  {systemInfo?.disk?.usedPercent.toFixed(2)}%
                </CardTitle>
              </div>
              <div>
                <Badge
                  variant={"outline"}
                  className="flex gap-1 rounded-lg text-xs bg-white"
                >
                  {/* <TrendingUpIcon className="size-3" /> */}
                  {systemInfo?.disk.used.toFixed(2)} /{" "}
                  {systemInfo?.disk.total.toFixed(2)} GB
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-background rounded w-full">
          <CardHeader>
            <CardDescription className="flex gap-2 items-center justify-between">
              <div className="flex gap-2">
                <Badge
                  variant={"outline"}
                  className="rounded-full p-1 bg-white text-foreground"
                >
                  <Container />
                </Badge>
                <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  {containers.length}
                </CardTitle>
              </div>
              <div>
                <Badge
                  variant={"outline"}
                  className="flex gap-1 rounded-lg text-xs bg-white"
                >
                  {/* <TrendingUpIcon className="size-3" /> */}
                  Containers
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
