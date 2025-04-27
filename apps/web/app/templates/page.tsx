import Image from "next/image"
import templates from "../../templates/list.json"

export default function TemplatesPage() {

  console.log(templates)

  return (
    <div>
      <h1 className="text-3xl font-bold">Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
        {
          templates.map((template) => (
            <div key={template.slug} className="flex items-center justify-center py-4 px-2 gap-4 bg-background border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image src={`/templates/${template.name}/assets/${template.logo}`} alt={template.name} width="50" height="50" className="rounded-lg" />
              <h2 className="font-bold">{template.name}</h2>
            </div>
          )) 
        }
      </div>
    </div>
  ) 
}