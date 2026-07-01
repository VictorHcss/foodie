import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-6xl text-primary">404</h1>
          <h2 className="font-serif font-semibold text-2xl text-foreground">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <Button asChild className="w-full sm:w-auto">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>
    </div>
  )
}