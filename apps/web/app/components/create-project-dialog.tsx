import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { PackagePlus } from "lucide-react";
import { useProjectsStore } from "../../stores/serviceStore";
import { Project } from "../../types";
import { useState } from "react";



export function CreateProjectDialog() {
  const { projects ,setProjects } = useProjectsStore()
  const [name, setName] = useState('')
  

  
  const handleSubmit = async () => {
    const project: Project = {
      id: '',
      name,
      config: {
        services: []
      }
    }
    const response = await fetch('http://localhost:3004/projects', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
      
    })

    const projectData = await response.json()

    setProjects([
      ...projects,
      projectData
    ])
    
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
        <PackagePlus />
        Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear proyecto</DialogTitle>
          <DialogDescription>
            Elige un nombre para tu nuevo proyecto, se creativo seguro que crearas muchos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" className="col-span-3" onChange={(event) => setName(event.target.value)} />
          </div>
        </div>
        <DialogFooter>
            <Button type="submit" variant={"secondary"} onClick={handleSubmit}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
