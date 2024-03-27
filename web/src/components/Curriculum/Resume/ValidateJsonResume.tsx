import { useCallback, useEffect, useState } from "react"
import { LoadIndicator } from "@/components/LoadIndicator"
import { Button } from "@/components/ui/button"
import { useNotify } from "@/hooks/useNotify"
import { validateJsonResumeAsync } from "@/services/apiService"
import { useProfileStore } from "@/store/profileStore"
import { useRef } from "react"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { AlertDialogPrompt } from "@/components/AlertDialogPrompt"
import type { ValidateJson } from '@/types/apiTypes.ts'
import { saveFile } from "@/lib/savefile";

export function ValidateJsonResume() {
  const [isLoading, setIsLoading] = useState(false)
  const { notifySuccess, notifyError } = useNotify();
  const { user, token } = useProfileStore(state => state)
  const refInputFile = useRef<HTMLInputElement>(null)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const saveFileRef = useRef(() => undefined);

  const readAsText = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function (event) {
        resolve((event?.target?.result as string) ?? "");
      };
      reader.onerror = function (event) {
        reject(
          new Error("Error reading file: " + (event?.target?.error ?? "")),
        );
      };
      reader.readAsText(file);
    });
  }, [])

  const handleClick = useCallback(() => {
    if (refInputFile.current) {
      refInputFile.current.value = ""
      refInputFile.current.click()
    }
  }, [refInputFile])

  const handleChangeFile = useCallback(() => {

    if (token === 'not-loaded')
      return

    if (!user || !token) {
      navigate('/').then(() =>
        notifyError('Usuario no autorizado')
      )
      return
    }

    if (!refInputFile.current) return

    const fileList = refInputFile.current.files;
    if (!fileList || fileList.length === 0) return

    const file = fileList[0];

    setIsLoading(true)
    readAsText(file)
      .then((contents) => {

        const resumeJson: ValidateJson = {
          userId: user?.id ?? -1,
          json: contents,
        };

        validateJsonResumeAsync(resumeJson, token)
          .then((result) => {
            if (result.success) {
              notifySuccess(result.message);
            } else {

              if (!result.data) {
                notifyError(result.message);
              } else {
                saveFileRef.current = () => {
                  saveFile(JSON.stringify(result.data, null, 2), "")
                    .then((result) => {
                      if (result) {
                        notifySuccess('Fichero de errores guardado correctamente')
                      }
                    })
                    .catch((error) => {
                      throw error
                    })
                }
                setIsOpenAlert(true)
              }
            }
          })
          .catch((error) => {
            console.log(error);
            notifyError("Error inesperado validando esquema");
          })
          .finally(() => setIsLoading(false))

      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
  }, [token, user, readAsText, notifyError, notifySuccess, refInputFile])

  return (
    <>
      <input ref={refInputFile} type="file" id="fileInput" className="hidden" onChange={handleChangeFile} />
      <Button className="text-xs md:text-sm" variant="outline" onClick={handleClick}>
        Validar Esquema Fichero <span id="loadIndicator" className="ml-2">
          <LoadIndicator loading={isLoading} />
        </span>
      </Button>
      <AlertDialogPrompt
        title='Esquema con errores'
        message='¿Desea guardar los errores encontrados?'
        open={isOpenAlert}
        setOpen={setIsOpenAlert}
        onActionClick={saveFileRef.current} />
    </>
  )
}