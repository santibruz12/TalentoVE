import { KPICard } from "@/components/dashboard/KPICard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar
} from "lucide-react"

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard RRHH</h1>
        <p className="text-muted-foreground">
          Resumen ejecutivo y métricas clave de recursos humanos
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Empleados Activos"
          value="247"
          change="+3 este mes"
          changeType="positive"
          icon={Users}
          description="Total de empleados en nómina"
        />
        <KPICard
          title="Nuevos Ingresos"
          value="12"
          change="+4 vs mes anterior"
          changeType="positive"
          icon={UserPlus}
          description="Contrataciones del mes"
        />
        <KPICard
          title="Egresos"
          value="5"
          change="-2 vs mes anterior"
          changeType="positive"
          icon={UserMinus}
          description="Salidas registradas"
        />
        <KPICard
          title="En Período de Prueba"
          value="18"
          change="6 próximos a vencer"
          changeType="neutral"
          icon={Clock}
          description="Evaluaciones pendientes"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividades Recientes
            </CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Nuevo ingreso registrado",
                  employee: "Carlos Rodríguez",
                  time: "Hace 2 horas",
                  type: "ingreso"
                },
                {
                  action: "Período de prueba finalizado",
                  employee: "Ana Martínez", 
                  time: "Hace 4 horas",
                  type: "evaluacion"
                },
                {
                  action: "Contrato renovado",
                  employee: "Luis Fernández",
                  time: "Ayer",
                  type: "contrato"
                },
                {
                  action: "Egreso procesado",
                  employee: "María Torres",
                  time: "Hace 2 días",
                  type: "egreso"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "ingreso" ? "bg-success" :
                    activity.type === "evaluacion" ? "bg-warning" :
                    activity.type === "contrato" ? "bg-primary" : "bg-muted"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.employee}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Importantes
            </CardTitle>
            <CardDescription>
              Acciones requeridas y recordatorios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Períodos de Prueba por Vencer",
                  description: "6 empleados completan su período en 7 días",
                  priority: "high",
                  action: "Revisar evaluaciones"
                },
                {
                  title: "Contratos por Renovar",
                  description: "3 contratos vencen este mes",
                  priority: "medium", 
                  action: "Gestionar renovaciones"
                },
                {
                  title: "Documentación Pendiente",
                  description: "2 expedientes incompletos",
                  priority: "low",
                  action: "Solicitar documentos"
                },
                {
                  title: "Evaluaciones Atrasadas",
                  description: "1 evaluación de período de prueba pendiente",
                  priority: "high",
                  action: "Contactar supervisor"
                }
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.priority === "high" ? "bg-destructive" :
                    alert.priority === "medium" ? "bg-warning" : "bg-muted"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    <button className="text-xs text-primary hover:underline">
                      {alert.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratos por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Indefinido</span>
                <span className="font-medium">189 (76%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Determinado</span>
                <span className="font-medium">45 (18%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pasantías</span>
                <span className="font-medium">13 (6%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Operaciones</span>
                <span className="font-medium">89 empleados</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Administración</span>
                <span className="font-medium">67 empleados</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tecnología</span>
                <span className="font-medium">45 empleados</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Evaluaciones</span>
                <span className="font-medium">5 pendientes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entrevistas</span>
                <span className="font-medium">3 programadas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reuniones</span>
                <span className="font-medium">2 esta semana</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard