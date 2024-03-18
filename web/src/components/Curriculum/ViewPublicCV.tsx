import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Copy } from "lucide-react"
import { buttonVariants } from "@/components/ui/button";
import { useNotify } from "@/hooks/useNotify";
import { Button } from "@/components/ui/button";

export default function ViewPublicCV({ userId }: { userId: string }) {

  const [template, setTemplate] = useState('')
  const { notifyError, notifySuccess } = useNotify()

  const handleValueChange = (value: string) => {
    setTemplate(value)
  }

  const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement>
    = useCallback((event) => {
      if (!template) {
        event.preventDefault(); // Evita que el enlace se active
        notifyError('Debe seleccionar una plantilla')
      }
    }, [template])

  const handleCopyClick: React.MouseEventHandler<HTMLButtonElement>
    = useCallback((event) => {
      if (!template) {
        event.preventDefault(); // Evita que el enlace se active
        notifyError('Debe seleccionar una plantilla')
        return
      }

      if (navigator.clipboard) {
        const urlToCopy = `${window.location.origin}/templates/${template}/${userId}`
        navigator.clipboard.writeText(urlToCopy)
          .then(() => {
            notifySuccess('Enlace copiado al portapales')
          })
          .catch((error) => {
            notifyError('Error al copiar al portapales')
          });
      }
    }, [template])

  return (
    <div className="flex flex-row flex-wrap gap-1">
      <Select value={template} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Plantilla CV" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="elegant">elegant</SelectItem>
          <SelectItem value="midudev">midudev</SelectItem>
        </SelectContent>
      </Select>
      <a href={`/templates/${template}/${userId}`}
        onClick={handleLinkClick}
        target="_blank"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "text-xs md:text-sm",
        )}>Ver versión pública <ArrowRight
          className="ml-2 text-blue-500"
        />
      </a>
      <Button className="w-12" variant={"outline"} onClick={handleCopyClick}>
        <Copy className="h-3 w-3" />
        <span className="sr-only">Copiar</span>
      </Button>

    </div >
  )
}