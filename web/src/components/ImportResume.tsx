import { Button } from "@/components/ui/button";

export function ImportResume() {

  const handleUpload = () => {

  }

  return (
    <form encType="multipart/form-data">
      <Button variant={"outline"} type="submit" onClick={handleUpload}>Importar Resume JSON</Button>
      <input className=" bg-blue-500" type="file" name="file" accept=".json" />
    </form>
  )

}