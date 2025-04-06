/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@repo/ui/components/ui/button";
import { Package, PackagePlus, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Projects() {
  const [containers, setContainers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3004/system")
      .then((res) => res.json())
      .then((json) => {
        setContainers(json.docker.containers);
      });
  }, []);

  const grouped = groupByProject(containers);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Button variant={"secondary"}>
          <PackagePlus />
          Nuevo Proyecto
        </Button>
      </div>

      {Object.entries(grouped).map(([project, containers]) => (
        <div key={project} className="space-y-2">
          <h2 className="text-lg font-semibold">
            {project === "_standalone" ? (
              "Contenedores individuales"
            ) : (
              <Link
                className="flex gap-4 items-center"
                href={`/projects/${project}`}
              >
                <Package />
                <Button variant={"ghost"} className="text-lg font-bold">
                  {project}
                </Button>
                <Button variant={"ghost"}>
                  <Play />
                </Button>
                <Button variant={"ghost"}>
                  <RotateCcw />
                </Button>
              </Link>
            )}
          </h2>

          <ul className="grid md:grid-cols-4 gap-4">
            {containers.map((c: any) => (
              <li
                key={c.Id}
                className="border p-4 rounded shadow text-sidebar-foreground bg-background"
              >
                <div className="text-sm">{c.image}</div>
                <div className="text-xs text-gray-600">
                  {c.labels["com.docker.compose.service"]}
                </div>
                <div className="text-sm italic">
                  Estado:{" "}
                  <span
                    className={
                      c.state === "running"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {c.state}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

// helper
function groupByProject(containers: any[]) {
  const groups: Record<string, any[]> = {};

  containers.forEach((c) => {
    const project = c.labels?.["com.docker.compose.project"] || "_standalone";
    if (!groups[project]) groups[project] = [];
    groups[project].push(c);
  });

  return groups;
}
