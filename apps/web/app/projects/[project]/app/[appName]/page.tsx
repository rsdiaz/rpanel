"use client";
import { useParams } from "next/navigation";
import { useProjectsStore } from "../../../../../stores/serviceStore";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";

export default function ServiceDetailPage() {
  const params = useParams();
  const { projects } = useProjectsStore();
  const project = projects.find((e) => e.name === params.project);
  const config = project?.config;

  const services = config?.services
  const service = services?.find((service) => service.data.serviceName === params.appName)

  console.log(service, "stack");

  return (
    <div className="p-4">
      <div className="flex gap-8 items-center">
        <h1 className="text-4xl font-bold">
          {params.project}/{params.appName}
        </h1>
        <Badge className="bg-green-800">APP</Badge>
      </div>
      <div className="py-4">
        <p className="text-gray-500">Acceso al servicio: http://{service?.data.domains[0]?.host}:{service?.data.domains[0]?.port}</p>
      </div>
      {/* Aquí podés cargar datos del servicio, logs, stats, etc */}

      <div className="flex p-2 bg-background">
        <div className="bg-background-secondary w-full p-2">
          <div className="flex gap-4">
            <Button variant={"secondary"} className="p-0 hover:bg-transparent">
              Implementar
            </Button>
            <Button
              variant={"secondary"}
              className="bg-transparent p-0 hover:bg-transparent"
            >
              Parar
            </Button>
            <Button
              variant={"secondary"}
              className="bg-transparent p-0 hover:bg-transparent"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
