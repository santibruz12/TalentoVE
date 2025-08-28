import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DoorOpen, FileX, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"

const DeparturesModule = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Egresos</h1>
        <p className="text-muted-foreground">
          Administración completa del proceso de salida y finiquitos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Este Mes</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">-2 vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Finiquitos pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reasignaciones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Por supervisores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Último trimestre</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Departures */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Egresos Pendientes de Aprobación
          </CardTitle>
          <CardDescription>
            Procesos de salida que requieren validación y cierre de expediente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                name: "María Torres", 
                position: "Coordinadora RRHH", 
                type: "Renuncia Voluntaria",
                requestDate: "2024-11-10",
                lastDay: "2024-12-10",
                status: "Pendiente Aprobación",
                hasSubordinates: true,
                subordinatesCount: 4
              },
              { 
                name: "Roberto Silva", 
                position: "Analista Sistemas", 
                type: "Terminación Mutuo Acuerdo",
                requestDate: "2024-11-15",
                lastDay: "2024-11-30",
                status: "Calculando Finiquito",
                hasSubordinates: false,
                subordinatesCount: 0
              }
            ].map((departure, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-background border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <span className="font-medium text-warning">
                      {departure.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium">{departure.name}</h3>
                    <p className="text-sm text-muted-foreground">{departure.position}</p>
                    <p className="text-xs text-muted-foreground">{departure.type}</p>
                    {departure.hasSubordinates && (
                      <p className="text-xs text-warning">
                        ⚠️ {departure.subordinatesCount} subordinados requieren reasignación
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Último día: {departure.lastDay}</div>
                    <Badge variant="outline" className="text-warning border-warning/20">
                      {departure.status}
                    </Badge>
                  </div>
                  <Button className="bg-primary hover:bg-primary-dark">
                    Procesar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Departure Types and Recent */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Egreso</CardTitle>
            <CardDescription>Clasificación de salidas últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Renuncia Voluntaria", count: 28, percentage: 60, trend: "up" },
                { type: "Terminación Mutuo Acuerdo", count: 12, percentage: 26, trend: "stable" },
                { type: "Vencimiento Contrato", count: 4, percentage: 9, trend: "down" },
                { type: "Despido Justificado", count: 2, percentage: 4, trend: "down" },
                { type: "Jubilación", count: 1, percentage: 1, trend: "stable" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-xs text-muted-foreground">{item.percentage}% del total</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold">{item.count}</div>
                      <div className={`text-xs ${
                        item.trend === "up" ? "text-destructive" :
                        item.trend === "down" ? "text-success" : "text-muted-foreground"
                      }`}>
                        {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Egresos Recientes</CardTitle>
            <CardDescription>Salidas finalizadas recientemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Carlos Mendoza", position: "Vendedor", date: "2024-11-20", type: "Renuncia", status: "Finalizado" },
                { name: "Elena Vargas", position: "Diseñadora", date: "2024-11-18", type: "Mutuo Acuerdo", status: "Finalizado" },
                { name: "José Morales", position: "Técnico", date: "2024-11-15", type: "Venc. Contrato", status: "Finalizado" },
                { name: "Patricia Díaz", position: "Analista", date: "2024-11-12", type: "Renuncia", status: "Finalizado" }
              ].map((departure, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {departure.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{departure.name}</span>
                      <span className="text-xs text-muted-foreground">{departure.position}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{departure.date}</div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      {departure.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo del Proceso de Egreso</CardTitle>
          <CardDescription>
            Pasos automáticos y validaciones requeridas para el cierre de expedientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h3 className="font-medium">Solicitud</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Registro de motivo</li>
                <li>• Fecha de último día</li>
                <li>• Validación supervisor</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h3 className="font-medium">Reasignaciones</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Identificar subordinados</li>
                <li>• Asignar nuevo supervisor</li>
                <li>• Transferir responsabilidades</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <h3 className="font-medium">Cálculos</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Finiquito legal</li>
                <li>• Vacaciones pendientes</li>
                <li>• Prestaciones sociales</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <h3 className="font-medium">Cierre</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Entrega de finiquito</li>
                <li>• Cierre de expediente</li>
                <li>• Archivo histórico</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeparturesModule