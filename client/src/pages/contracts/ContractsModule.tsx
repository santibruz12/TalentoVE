import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

const ContractsModule = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Contratos y Movimientos</h1>
          <p className="text-muted-foreground">
            Gestión de contratos laborales y movimientos internos
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Contrato
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Total vigentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Próximos 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimientos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobaciones</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Contract Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Contratos (Legislación Venezolana)</CardTitle>
          <CardDescription>
            Distribución según normativa laboral nacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { type: "Indefinido", count: 189, percentage: 76, color: "bg-primary" },
              { type: "Determinado", count: 45, percentage: 18, color: "bg-warning" },
              { type: "Por Obra", count: 10, percentage: 4, color: "bg-success" },
              { type: "Pasantía", count: 3, percentage: 2, color: "bg-muted" }
            ].map((contract, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{contract.type}</span>
                  <Badge variant="outline">{contract.percentage}%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{contract.count}</div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div 
                    className={`h-full ${contract.color} rounded-full`}
                    style={{ width: `${contract.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Contracts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contratos Recientes</CardTitle>
            <CardDescription>Últimos contratos generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Carlos Rodríguez", type: "Indefinido", date: "2024-11-01", status: "Firmado" },
                { name: "Ana Martínez", type: "Determinado", date: "2024-10-28", status: "Pendiente" },
                { name: "Luis García", type: "Indefinido", date: "2024-10-25", status: "Firmado" },
                { name: "María López", type: "Pasantía", date: "2024-10-22", status: "En Revisión" }
              ].map((contract, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{contract.name}</span>
                    <span className="text-xs text-muted-foreground">{contract.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{contract.date}</span>
                    <Badge 
                      variant={contract.status === "Firmado" ? "default" : "outline"}
                      className={
                        contract.status === "Firmado" ? "bg-success/10 text-success border-success/20" :
                        contract.status === "Pendiente" ? "bg-warning/10 text-warning border-warning/20" :
                        "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {contract.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos Internos</CardTitle>
            <CardDescription>Ascensos y traslados del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Pedro Fernández", movement: "Ascenso", from: "Analista", to: "Senior", status: "Aprobado" },
                { name: "Carmen Ruiz", movement: "Traslado", from: "Marketing", to: "Ventas", status: "Pendiente" },
                { name: "José Morales", movement: "Promoción", from: "Coordinador", to: "Supervisor", status: "En Proceso" },
                { name: "Laura Castro", movement: "Traslado", from: "Caracas", to: "Valencia", status: "Aprobado" }
              ].map((movement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{movement.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {movement.movement}: {movement.from} → {movement.to}
                    </span>
                  </div>
                  <Badge 
                    variant={movement.status === "Aprobado" ? "default" : "outline"}
                    className={
                      movement.status === "Aprobado" ? "bg-success/10 text-success border-success/20" :
                      movement.status === "Pendiente" ? "bg-warning/10 text-warning border-warning/20" :
                      "bg-primary/10 text-primary border-primary/20"
                    }
                  >
                    {movement.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Contracts Alert */}
      <Card className="border-warning/20 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Contratos por Vencer
          </CardTitle>
          <CardDescription>
            Requieren atención inmediata para renovación o finalización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Roberto Silva", type: "Determinado", expires: "2024-12-15", days: 15 },
              { name: "Elena Vargas", type: "Por Obra", expires: "2024-12-20", days: 20 },
              { name: "Miguel Torres", type: "Determinado", expires: "2024-12-28", days: 28 }
            ].map((contract, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                <div className="flex flex-col">
                  <span className="font-medium">{contract.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {contract.type} - Vence: {contract.expires}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-warning border-warning/20">
                    {contract.days} días
                  </Badge>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContractsModule