"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} className={cn("pr-11", className)} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Esconder senha" : "Mostrar senha"}
        className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive">
      {children}
    </p>
  )
}
