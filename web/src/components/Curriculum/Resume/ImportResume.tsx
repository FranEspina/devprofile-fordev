import { useCallback, useEffect, useState } from "react"
import { LoadIndicator } from "@/components/LoadIndicator"
import { Button } from "@/components/ui/button"
import { useNotify } from "@/hooks/useNotify"
import { importResumeAsync } from "@/services/apiService"
import { useProfileStore } from "@/store/profileStore"
import { EVENTS_UPDATE } from "@/components/ZustandStoreProvider"
import { useRef } from "react"
import { navigate } from "astro/virtual-modules/transitions-router.js"
import { ErrorDialog } from "@/components/ErrorDialog"

export function ImportResume() {
  const [isLoading, setIsLoading] = useState(false)
  const { notifySuccess, notifyError } = useNotify();
  const { user, token } = useProfileStore(state => state)
  const refInputFile = useRef<HTMLInputElement>(null)
  const [isOpenErrorDialog, setIsOpenErrorDialog] = useState(false)
  const [errors, setErrors] = useState<{ error: string, count: number }[]>([])

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

        const resumeJson = {
          userId: user?.id ?? -1,
          json: contents,
          deletePrevious: true,
        };

        importResumeAsync(resumeJson, token)
          .then((result) => {
            if (result.success) {
              window.dispatchEvent(new Event(EVENTS_UPDATE.RefreshAll));
              notifySuccess(result.message);
            } else {
              if (result.data) {
                const errors = new Set(result.data as [])
                if (errors.size !== 0) {
                  const details = [...errors].map((error) => {
                    return {
                      error: error,
                      count: (result.data as []).filter(e => e == error).length
                    }
                  })
                  setErrors(details)
                  setIsOpenErrorDialog(true)
                }
              }
              notifyError(result.message);
            }
          })
          .catch((error) => {
            console.log(error);
            notifyError("Error inesperado importando resumen");
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
        Importar Resumen JSON <span id="loadIndicator" className="ml-2">
          <LoadIndicator loading={isLoading} />
        </span>
      </Button>
      <ErrorDialog title='Error importando resumen' description="Revise los problemas y vuelva a importar el archivo" open={isOpenErrorDialog} setOpen={setIsOpenErrorDialog} errors={errors} />
    </>
  )
}