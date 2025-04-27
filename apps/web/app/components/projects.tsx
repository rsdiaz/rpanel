/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Package, Settings, Trash } from "lucide-react";
import Link from "next/link";
import { useProjectsStore } from "../../stores/serviceStore";
import { CreateProjectDialog } from "./create-project-dialog";
import { CreateAppDialog } from "./add-app-dialog";

export default function Projects() {
  const { projects, setProjects } = useProjectsStore();

  async function refreshProjects() {
    try {
      const res = await fetch("http://localhost:3004/projects/");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error al actualizar proyectos:", err);
    }
  }

  async function handleDeleteProject(id: string) {
    try {
      await fetch(`http://localhost:3004/projects/${id}`, {
        method: "DELETE",
      });
      await refreshProjects();
    } catch (err) {
      console.error("Error al eliminar proyecto:", err);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <CreateProjectDialog />
      </div>

      {projects.map((project) => (
        <div key={project.id} className="space-y-2 mb-8">
          <h2 className="text-lg font-semibold">
            <div className="flex gap-2 items-center">
              <Link
                className="flex gap-2 items-center"
                href={`/projects/${project.id}`}
              >
                <Button className="text-lg font-bold bg-transparent px-2 py-2">
                <Package />
                  {project.name}
                </Button>
              </Link>

              <Link href={`/projects/${project.name}/settings`}>
                <Button className="text-lg font-bold bg-transparent px-2 py-2">
                  <Settings strokeWidth={2} />
                </Button>
              </Link>


              <CreateAppDialog id={project.id} />

              <Button
                className="text-lg font-bold bg-transparent px-2 py-2 text-red-600"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash strokeWidth={2} />
              </Button>
            </div>
          </h2>

          <ul className="grid md:grid-cols-4 gap-4">
            {project.config &&
              Array.isArray(project.config.services) &&
              project.config.services.map((service, index) => (
                <Link
                  href={`/projects/${project.name}/app/${service.data.serviceName}`}
                  key={index}
                >
                  <li
                    key={index}
                    className="border p-4 rounded shadow text-sidebar-foreground bg-background"
                  >
                    <div className="truncate w-full font-semibold">
                      {service.data.serviceName}
                    </div>
                    <div className="text-xs text-gray-600">
                      {service.data.source.image}
                    </div>
                    <div className="text-sm mt-2">
                      {service.data.domains.map((domain: any, i: number) => (
                        <div key={i}>
                          <span className="text-muted-foreground">
                            {domain.host}
                          </span>
                          : {domain.port}
                        </div>
                      ))}
                    </div>
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      ))}
    </>
  );
}
