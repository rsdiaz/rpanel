"use client";

import { useParams } from "next/navigation";
import { useProjectsStore } from "../../../stores/serviceStore";

export default function ServicePage() {
    const params = useParams();
    const { projects } = useProjectsStore();
    const project = projects.find((e) => e.name === params.project);
    const config = project?.config;
  
    const services = config?.services
    const service = services?.find((service) => service.data.serviceName === params.appName)
  
    console.log(project, "stack");
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{project?.name}</h1>
      <p>Service page content goes here.</p>
    </div>
  );
}