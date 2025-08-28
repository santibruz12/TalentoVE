import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle, Star, Calendar } from "lucide-react"

const ProbationModule = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Períodos de Prueba</h1>
        <p className="text-muted-foreground">
          Gestión unificada de evaluaciones y seguimiento de nuevos empleados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Período Activo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Empleados evaluándose</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Próximos 7 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Evaluations */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Evaluaciones Urgentes
          </CardTitle>
          <CardDescription>
            Períodos de prueba que vencen en los próximos 7 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Ana Martínez", position: "Analista Marketing", supervisor: "Carlos López", daysLeft: 2, startDate: "2024-08-01" },
              { name: "Roberto Silva", position: "Desarrollador Jr", supervisor: "María González", daysLeft: 4, startDate: "2024-08-05" },
              { name: "Carmen Ruiz", position: "Asistente Admin", supervisor: "Pedro Fernández", daysLeft: 6, startDate: "2024-08-10" }
            ].map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <span className="font-medium text-warning">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">Supervisor: {employee.supervisor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{employee.daysLeft}</div>
                    <div className="text-xs text-muted-foreground">días restantes</div>
                  </div>
                  <Button className="bg-warning hover:bg-warning/90 text-white">
                    Evaluar Ahora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Probations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Períodos Activos</CardTitle>
            <CardDescription>Empleados en proceso de evaluación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Luis García", position: "Contador", progress: 75, daysTotal: 90, daysLeft: 23 },
                { name: "Elena Vargas", position: "Diseñadora", progress: 60, daysTotal: 90, daysLeft: 36 },
                { name: "Miguel Torres", position: "Vendedor", progress: 45, daysTotal: 90, daysLeft: 50 },
                { name: "Laura Castro", position: "Programadora", progress: 30, daysTotal: 90, daysLeft: 63 }
              ].map((employee, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-xs text-muted-foreground">{employee.position}</span>
                    </div>
                    <Badge variant="outline">{employee.daysLeft} días</Badge>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mb-2">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${employee.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progreso: {employee.progress}%</span>
                    <span>{employee.daysTotal - employee.daysLeft}/{employee.daysTotal} días</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>Períodos finalizados recientemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "José Morales", position: "Analista Sistemas", result: "Aprobado", score: 8.5, date: "2024-11-15" },
                { name: "Patricia Díaz", position: "Coordinadora", result: "Aprobado", score: 9.2, date: "2024-11-10" },
                { name: "Carlos Mendoza", position: "Técnico", result: "No Aprobado", score: 6.8, date: "2024-11-08" },
                { name: "Isabella Ramos", position: "Asistente", result: "Aprobado", score: 8.8, date: "2024-11-05" }
              ].map((evaluation, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{evaluation.name}</span>
                      <span className="text-xs text-muted-foreground">{evaluation.position}</span>
                    </div>
                    <Badge 
                      className={
                        evaluation.result === "Aprobado" 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }
                    >
                      {evaluation.result}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Puntuación: {evaluation.score}/10</span>
                    <span>{evaluation.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluation Process */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Evaluación</CardTitle>
          <CardDescription>
            Criterios y proceso unificado para nuevos ingresos y movimientos internos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h3 className="font-medium">Evaluación Inicial</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Primeros 30 días: Adaptación y conocimiento de funciones
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Integración al equipo</li>
                <li>• Comprensión del rol</li>
                <li>• Cumplimiento básico</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h3 className="font-medium">Evaluación Intermedia</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Días 31-60: Desarrollo de competencias y autonomía
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Desempeño técnico</li>
                <li>• Iniciativa propia</li>
                <li>• Colaboración</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <h3 className="font-medium">Evaluación Final</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Días 61-90: Confirmación y decisión final
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Resultados obtenidos</li>
                <li>• Potencial de crecimiento</li>
                <li>• Fit cultural</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProbationModule