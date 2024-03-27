import { Button } from "@/components/ui/button"
import { BasicDialog } from '@/components/Curriculum/Basic/BasicDialog'
import { Skeleton } from "@/components/ui/skeleton";

export function BasicSkeleton() {

  return (
    <section className="my-2flex flex-col w-full md:w-[800px]">
      <div className="flex flex-row justify-between gap-4 items-center">
        <Skeleton className="h-5 w-20 flex-1" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="space-y-2 mt-2">
        <Skeleton className="h-5 w-full md:w-[800px]" />
        <Skeleton className="h-40 w-full md:w-[800px]" />
      </div>
    </section>
  )
}