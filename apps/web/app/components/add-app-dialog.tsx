import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Plus } from "lucide-react";
import { useProjectsStore } from "../../stores/serviceStore";
import { Project } from "../../types";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";

export function CreateAppDialog({id}: { id: string }) {
  const { projects, setProjects } = useProjectsStore();

  const [jsonValue, setJsonValue] = useState(`{
    "services": [
      {
        "type": "app",
        "data": {
          "serviceName": "adminer",
          "source": {
            "type": "image",
            "image": "adminer:4.8.1"
          },
          "domains": [
            {
              "host": "$(EASYPANEL_DOMAIN)",
              "port": 8080
            }
          ]
        }
      }
    ]
  }`)

  async function refreshProjects() {
    try {
      const res = await fetch("http://localhost:3004/projects/");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error al actualizar proyectos:", err);
    }
  }

  const handleSubmit = async () => {
  const project = projects.find(p => p.id === id)

    const newProject: Project = {
      id: project?.id as string,
      name: project?.name as string,
      config: JSON.parse(jsonValue),
    };

    await fetch(`http://localhost:3004/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    });

    await fetch(`http://localhost:3004/projects/deploy`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...JSON.parse(jsonValue),
        name: project?.name,
      }),
    })
  
    await refreshProjects()
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-lg font-bold bg-transparent">
          <Plus strokeWidth={3} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Crear App</DialogTitle>
          <DialogDescription>
            Elige un nombre para tu nuevo proyecto, se creativo seguro que
            crearas muchos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="h-[400px]">
            <div className="h-full">
              <Editor
                defaultLanguage="json"
                value={jsonValue}
                onChange={(value) => setJsonValue(value ?? "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="submit" variant={"secondary"} onClick={() => handleSubmit()}>
              Crear
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
