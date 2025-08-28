import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Key, Settings } from "lucide-react"

const AuthModule = () => {
  const roles = [
    { name: "Gerente RRHH", level: 1, users: 2, permissions: "Todos los módulos" },
    { name: "Admin RRHH", level: 2, users: 3, permissions: "Gestión completa excepto configuración" },
    { name: "Supervisor", level: 3, users: 12, permissions: "Empleados de su área" },
    { name: "Analista RRHH", level: 4, users: 5, permissions: "Consulta y reportes" },
    { name: "Empleado Captación", level: 5, users: 8, permissions: "Gestión de candidatos" },
    { name: "Consultor", level: 6, users: 3, permissions: "Solo lectura" }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Autenticación y Roles</h1>
        <p className="text-muted-foreground">
          Control de acceso y gestión de permisos del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33</div>
            <p className="text-xs text-muted-foreground">Personal de RRHH</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Definidos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Niveles jerárquicos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Conectados ahora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permisos</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Configuraciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles y Permisos del Sistema</CardTitle>
          <CardDescription>
            Gestión jerárquica de acceso a los módulos de RRHH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Nivel {role.level}
                    </Badge>
                    <h3 className="font-medium">{role.name}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role.users} usuario{role.users !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {role.permissions}
                  </div>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimos accesos y cambios en permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Nuevo usuario creado", user: "Ana Rodríguez", role: "Analista RRHH", time: "Hace 2 horas" },
              { action: "Permisos modificados", user: "Carlos López", role: "Supervisor", time: "Hace 4 horas" },
              { action: "Sesión iniciada", user: "María González", role: "Gerente RRHH", time: "Hace 6 horas" },
              { action: "Rol asignado", user: "Luis Martín", role: "Empleado Captación", time: "Ayer" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.user} - {activity.role}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthModule