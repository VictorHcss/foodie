import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="h-16 border-b" />
      <Skeleton className="h-48 w-full rounded-none sm:h-64 md:h-72" />
      <div className="container-page">
        <Skeleton className="-mt-12 size-24 rounded-3xl border-4 border-background md:size-28" />
        <Skeleton className="mt-6 h-14 w-2/3 max-w-lg" />
        <Skeleton className="mt-3 h-5 w-72" />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3">
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="size-28 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
