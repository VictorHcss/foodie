import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"

export function UserAvatar({ user, className }: { user: Pick<User, "name" | "avatar">; className?: string }) {
  const letters = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")

  if (user.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={user.avatar} alt="" className={cn("rounded-full bg-secondary object-cover", className)} />
    )
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid place-items-center rounded-full bg-brand font-display-wide text-sm font-bold text-brand-foreground",
        className,
      )}
    >
      {letters || "?"}
    </span>
  )
}
