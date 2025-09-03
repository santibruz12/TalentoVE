import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [fechaActual, setFechaActual] = useState("")

  useEffect(() => {
    const actualizarFecha = () => {
      const hoy = new Date()
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ]
      const dia = hoy.getDate().toString().padStart(2, '0')
      const mes = meses[hoy.getMonth()]
      const año = hoy.getFullYear()
      setFechaActual(`${dia} de ${mes} de ${año}`)
    }

    actualizarFecha()
    // Actualizar la fecha cada minuto por si cambia el día
    const intervalo = setInterval(actualizarFecha, 60000)
    
    return () => clearInterval(intervalo)
  }, [])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-soft-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-secondary" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empleados, contratos..."
                  className="w-80 pl-10 bg-background"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-warning rounded-full text-xs"></span>
              </Button>
              
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <div className="text-right">
                  <p className="text-sm font-medium">María González</p>
                  <p className="text-xs text-muted-foreground">Gerente RRHH</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {/* Fecha alineada con el logo */}
            <div className="px-6 pt-4 pb-2">
              <div className="text-sm text-muted-foreground">
                {fechaActual}
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}