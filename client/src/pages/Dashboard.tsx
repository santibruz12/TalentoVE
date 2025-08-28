import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { KPICard } from "@/components/dashboard/KPICard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  UserPlus, 
  Clock, 
  Plane,
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  Building2
} from "lucide-react"
import { sistemaRRHH } from "@/lib/api"

const Dashboard = () => {
  const [periodoIngresos, setPeriodoIngresos] = useState<"mensual" | "trimestral">("mensual")
  const [periodoIngresosRecientes, setPeriodoIngresosRecientes] = useState(30)

  // Queries
  const { data: estadisticas } = useQuery({
    queryKey: ['/api/dashboard/estadisticas'],
    queryFn: () => sistemaRRHH.dashboard.obtenerEstadisticas(),
  })

  const { data: empleados = [] } = useQuery({
    queryKey: ['/api/empleados'],
    queryFn: () => sistemaRRHH.empleados.obtenerTodos(),
  })

  const { data: departamentos = [] } = useQuery({
    queryKey: ['/api/departamentos'],
    queryFn: () => sistemaRRHH.departamentos.obtenerTodos(),
  })

  const { data: ingresosRecientes = [] } = useQuery({
    queryKey: ['/api/dashboard/ingresos-recientes', periodoIngresosRecientes],
    queryFn: () => sistemaRRHH.dashboard.obtenerIngresosRecientes(periodoIngresosRecientes),
  })

  const empleadosNoEgresados = empleados.filter(emp => emp.estadoEmpleado !== "Egresado")
  
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
          title="Total Empleados"
          value={estadisticas?.totalEmpleados?.toString() || "0"}
          change={`+${estadisticas?.variacionPorcentaje || 0}% último mes`}
          changeType="positive"
          icon={Users}
          description="Empleados activos en nómina"
        />
        <KPICard
          title="Período de Prueba"
          value={estadisticas?.empleadosPeriodoPrueba?.toString() || "0"}
          change={`${estadisticas?.periodosProximosVencer || 0} terminan en 7 días`}
          changeType="neutral"
          icon={Clock}
          description="En evaluación"
        />
        <div className="space-y-2">
          <KPICard
            title="Nuevos Ingresos"
            value={periodoIngresos === "mensual" 
              ? (estadisticas?.nuevosIngresosUltimoMes?.toString() || "0")
              : (estadisticas?.nuevosIngresosUltimoTrimestre?.toString() || "0")
            }
            change={`Último ${periodoIngresos === "mensual" ? "mes" : "trimestre"}`}
            changeType="positive"
            icon={UserPlus}
            description="Contrataciones recientes"
          />
          <div className="flex gap-1 px-2">
            <Button
              size="sm" 
              variant={periodoIngresos === "mensual" ? "default" : "outline"}
              onClick={() => setPeriodoIngresos("mensual")}
              className="text-xs h-6"
            >
              Mensual
            </Button>
            <Button
              size="sm"
              variant={periodoIngresos === "trimestral" ? "default" : "outline"}
              onClick={() => setPeriodoIngresos("trimestral")}
              className="text-xs h-6"
            >
              Trimestral
            </Button>
          </div>
        </div>
        <KPICard
          title="Vacaciones"
          value={estadisticas?.empleadosVacaciones?.toString() || "0"}
          change="Empleados en vacaciones"
          changeType="neutral"
          icon={Plane}
          description="Personal ausente"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Distribución por Departamento
            </CardTitle>
            <CardDescription>
              Empleados activos por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const totalActivos = empleadosNoEgresados.length;
                
                const estadisticasPorDept = departamentos.map(dept => {
                  const empleadosDelDept = empleadosNoEgresados.filter(emp => emp.departamentoId === dept.id);
                  const count = empleadosDelDept.length;
                  const percentage = totalActivos > 0 ? Math.round((count / totalActivos) * 100) : 0;
                  
                  return {
                    dept: dept.nombre,
                    count,
                    percentage
                  };
                }).filter(item => item.count > 0)
                .sort((a, b) => b.count - a.count);

                return estadisticasPorDept.length > 0 ? (
                  estadisticasPorDept.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.dept}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{item.count}</span>
                        <span className="text-xs text-muted-foreground w-10">{item.percentage}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No hay empleados activos
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Recent Hires by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Ingresos Recientes por Departamento
            </CardTitle>
            <CardDescription>
              Nuevas contrataciones por departamento
            </CardDescription>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={periodoIngresosRecientes === 30 ? "default" : "outline"}
                onClick={() => setPeriodoIngresosRecientes(30)}
                className="text-xs"
              >
                30 días
              </Button>
              <Button
                size="sm"
                variant={periodoIngresosRecientes === 90 ? "default" : "outline"}
                onClick={() => setPeriodoIngresosRecientes(90)}
                className="text-xs"
              >
                90 días
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ingresosRecientes.length > 0 ? (
                ingresosRecientes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm font-medium">{item.departamento}</span>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      {item.cantidad} nuevo{item.cantidad !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay ingresos recientes en el período seleccionado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="w-2 h-2 rounded-full mt-2 bg-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Períodos de Prueba por Vencer</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {estadisticas?.periodosProximosVencer || 0} empleados completan su período en 7 días
                  </p>
                  <button className="text-xs text-primary hover:underline">
                    Revisar evaluaciones
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="w-2 h-2 rounded-full mt-2 bg-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Empleados en Vacaciones</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {estadisticas?.empleadosVacaciones || 0} empleados actualmente de vacaciones
                  </p>
                  <button className="text-xs text-primary hover:underline">
                    Ver calendario
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="w-2 h-2 rounded-full mt-2 bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevos Ingresos</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {estadisticas?.nuevosIngresosUltimoMes || 0} contrataciones en el último mes
                  </p>
                  <button className="text-xs text-primary hover:underline">
                    Ver detalles
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="w-2 h-2 rounded-full mt-2 bg-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Total de Personal</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {estadisticas?.totalEmpleados || 0} empleados activos en nómina
                  </p>
                  <button className="text-xs text-primary hover:underline">
                    Ver empleados
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard