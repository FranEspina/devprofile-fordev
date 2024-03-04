import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Perfil Red Social</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir perfil público</DialogTitle>
          <DialogDescription>
            Añade un nuevo perfil público y guarda cambios cuando finalices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="social-network" className="text-right">
              Red Social
            </Label>
            <Input id="social-network" placeholder="nombre" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Usuario
            </Label>
            <Input id="username" placeholder="username" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Usuario
            </Label>
            <Input id="link" placeholder="https://..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}