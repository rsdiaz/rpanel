import Image from "next/image"
import templates from "../../templates/list.json"
import { AppDialog } from "../components/app-dialog"

export default function TemplatesPage() {

  console.log(templates)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
        {
          templates.map((template) => (
            <AppDialog key={template.slug} template={template}>
              <div className="flex flex-col items-center justify-between py-6 px-2 gap-4 bg-background border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div>
                  <Image src={`/templates/${template.name}/assets/${template.logo}`} alt={template.name} width="100" height="100" className="rounded" />
                </div>
                <h2 className="font-bold">{template.name}</h2>
              </div>
            </AppDialog>
          )) 
        }
      </div>
    </div>
  ) 
}