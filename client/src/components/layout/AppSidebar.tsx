import { useState } from "react"
import {
  Users,
  FileText,
  Clock,
  DoorOpen,
  BarChart3,
  Shield,
  ChevronRight,
  Building2
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const modules = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Indicadores y métricas"
  },
  {
    title: "Autenticación",
    url: "/auth",
    icon: Shield,
    description: "Roles y permisos"
  },
  {
    title: "Empleados",
    url: "/employees",
    icon: Users,
    description: "Gestión de personal"
  },
  {
    title: "Contratos",
    url: "/contracts",
    icon: FileText,
    description: "Contratos y movimientos"
  },
  {
    title: "Períodos de Prueba",
    url: "/probation",
    icon: Clock,
    description: "Evaluaciones y seguimiento"
  },
  {
    title: "Egresos",
    url: "/departures",
    icon: DoorOpen,
    description: "Salidas y finiquitos"
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavCls = (active: boolean) =>
    active
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium"
      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"

  return (
    <Sidebar
      className="border-r border-border"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-white font-bold text-lg">
            <Building2 className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">OnBoard</h1>
              <p className="text-sm text-muted-foreground">HHRR Venezuela</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-2 px-2">
            <p className="text-xs text-muted-foreground font-medium">
              {(() => {
                const hoy = new Date()
                const meses = [
                  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                ]
                const dia = hoy.getDate().toString().padStart(2, '0')
                const mes = meses[hoy.getMonth()]
                const año = hoy.getFullYear()
                return `${dia} de ${mes} de ${año}`
              })()}
            </p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Módulos del Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {modules.map((module) => (
                <SidebarMenuItem key={module.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-12 rounded-lg transition-all duration-200"
                  >
                    <NavLink
                      to={module.url}
                      end={module.url === "/"}
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <module.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && (
                        <div className="flex flex-col flex-1 text-left">
                          <span className="font-medium">{module.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {module.description}
                          </span>
                        </div>
                      )}
                      {!collapsed && (
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}