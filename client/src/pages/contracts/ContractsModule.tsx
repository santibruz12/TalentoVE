
import { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  AlertTriangle,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ChevronDown,
  ChevronRight,
  History,
  Bot
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sistemaRRHH } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { type Contrato, type Empleado, type Departamento, type InsertContrato, TiposContrato, EstadosContrato, type Cargo } from "@shared/schema"

const MotivosContrato = [
  "Nuevo Ingreso",
  "Ascenso",
  "Promoción",
  "Transferencia",
  "Cambio de Departamento",
  "Mejora Salarial",
  "Renovación",
  "Cambio de Condiciones",
  "Otro"
] as const

interface ContratoFormData {
  empleadoId: number
  numeroContrato: string
  tipoContrato: string
  fechaInicio: string
  fechaFin: string
  salario: string
  moneda: string
  horarioTrabajo: string
  ubicacionTrabajo: string
  estadoContrato: string
  observaciones: string
  motivoContrato: string
  cargoId: number
}

const ContractsModule = () => {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("all")
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalDetalles, setModalDetalles] = useState(false)
  const [contratoSeleccionado, setContratoSeleccionado] = useState<Contrato | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [vistaHistorial, setVistaHistorial] = useState(true)
  const [empleadosExpandidos, setEmpleadosExpandidos] = useState<Set<number>>(new Set())
  const [formularioData, setFormularioData] = useState<ContratoFormData>({
    empleadoId: 0,
    numeroContrato: '',
    tipoContrato: 'Indefinido',
    fechaInicio: '',
    fechaFin: '',
    salario: '',
    moneda: 'USD',
    horarioTrabajo: 'Lunes a Viernes 8:00 AM - 5:00 PM',
    ubicacionTrabajo: 'Oficina Principal',
    estadoContrato: 'Activo',
    observaciones: '',
    motivoContrato: 'Nuevo Ingreso',
    cargoId: 0
  })

  const queryClient = useQueryClient()

  // Queries
  const { data: contratos = [], isLoading: cargandoContratos } = useQuery({
    queryKey: ['/api/contratos', { 
      busqueda: busqueda || undefined,
      estado: filtroEstado === "all" ? undefined : filtroEstado
    }],
    queryFn: () => sistemaRRHH.contratos.obtenerTodos({
      busqueda: busqueda || undefined,
      estado: filtroEstado === "all" ? undefined : filtroEstado
    }),
  })

  const { data: empleados = [] } = useQuery({
    queryKey: ['/api/empleados'],
    queryFn: () => sistemaRRHH.empleados.obtenerTodos(),
  })

  const { data: departamentos = [] } = useQuery({
    queryKey: ['/api/departamentos'],
    queryFn: () => sistemaRRHH.departamentos.obtenerTodos(),
  })

  const { data: cargos = [] } = useQuery({
    queryKey: ['/api/cargos'],
    queryFn: () => sistemaRRHH.cargos.obtenerTodos(),
  })

  const { data: estadisticas } = useQuery({
    queryKey: ['/api/dashboard/estadisticas'],
    queryFn: () => sistemaRRHH.dashboard.obtenerEstadisticas(),
  })

  const { data: historialContratos = [], isLoading: cargandoHistorial } = useQuery({
    queryKey: ['/api/contratos/historial'],
    queryFn: () => sistemaRRHH.contratos.obtenerHistorial(),
    enabled: vistaHistorial,
  })

  // Mutations
  const crearContratoMutation = useMutation({
    mutationFn: (datos: InsertContrato) => sistemaRRHH.contratos.crear(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contratos'] })
      queryClient.invalidateQueries({ queryKey: ['/api/empleados'] })
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/estadisticas'] })
      toast.success("Contrato creado exitosamente")
      setModalAbierto(false)
      resetFormulario()
    },
    onError: () => {
      toast.error("Error al crear el contrato")
    }
  })

  const actualizarContratoMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number, datos: Partial<InsertContrato> }) => 
      sistemaRRHH.contratos.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contratos'] })
      queryClient.invalidateQueries({ queryKey: ['/api/empleados'] })
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/estadisticas'] })
      toast.success("Contrato actualizado exitosamente")
      setModalAbierto(false)
      resetFormulario()
    },
    onError: () => {
      toast.error("Error al actualizar el contrato")
    }
  })

  const eliminarContratoMutation = useMutation({
    mutationFn: (id: number) => sistemaRRHH.contratos.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contratos'] })
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/estadisticas'] })
      toast.success("Contrato eliminado exitosamente")
    },
    onError: () => {
      toast.error("Error al eliminar el contrato")
    }
  })

  // Funciones auxiliares
  const obtenerEmpleado = (empleadoId: number): Empleado | undefined => {
    return empleados.find(emp => emp.id === empleadoId)
  }

  const obtenerDepartamento = (departamentoId: number): Departamento | undefined => {
    return departamentos.find(dept => dept.id === departamentoId)
  }

  const obtenerCargo = (cargoId: number) => {
    return cargos.find(cargo => cargo.id === cargoId)
  }

  const formatearFecha = (fecha: string | null): string => {
    if (!fecha) return "N/A"
    // Crear fecha local sin conversión de zona horaria para evitar desfase de un día
    const [year, month, day] = fecha.split('-')
    const fechaLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return fechaLocal.toLocaleDateString('es-VE')
  }

  const obtenerEstadoContrato = (contrato: Contrato) => {
    if (contrato.estadoContrato === "Activo") {
      if (contrato.fechaFin) {
        const fechaFin = new Date(contrato.fechaFin)
        const hoy = new Date()
        const diasRestantes = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (24 * 60 * 60 * 1000))
        
        if (diasRestantes < 0) {
          return { estado: "Vencido", color: "destructive" }
        } else if (diasRestantes <= 30) {
          return { estado: "Por Vencer", color: "warning" }
        }
      }
      return { estado: "Activo", color: "success" }
    }
    return { estado: contrato.estadoContrato, color: "secondary" }
  }

  const resetFormulario = () => {
    setFormularioData({
      empleadoId: 0,
      numeroContrato: '',
      tipoContrato: 'Indefinido',
      fechaInicio: '',
      fechaFin: '',
      salario: '',
      moneda: 'USD',
      horarioTrabajo: 'Lunes a Viernes 8:00 AM - 5:00 PM',
      ubicacionTrabajo: 'Oficina Principal',
      estadoContrato: 'Activo',
      observaciones: '',
      motivoContrato: 'Nuevo Ingreso',
      cargoId: 0
    })
  }

  const abrirModalCrear = () => {
    resetFormulario()
    setModoEdicion(false)
    setContratoSeleccionado(null)
    setModalAbierto(true)
  }

  const abrirModalEditar = (contrato: Contrato) => {
    const empleado = obtenerEmpleado(contrato.empleadoId)
    setFormularioData({
      empleadoId: contrato.empleadoId,
      numeroContrato: contrato.numeroContrato,
      tipoContrato: contrato.tipoContrato,
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin || '',
      salario: contrato.salario,
      moneda: contrato.moneda || 'USD',
      horarioTrabajo: contrato.horarioTrabajo,
      ubicacionTrabajo: contrato.ubicacionTrabajo,
      estadoContrato: contrato.estadoContrato,
      observaciones: contrato.observaciones || '',
      motivoContrato: 'Nuevo Ingreso',
      cargoId: empleado?.cargoId || 0
    })
    setContratoSeleccionado(contrato)
    setModoEdicion(true)
    setModalAbierto(true)
  }

  const abrirModalDetalles = (contrato: Contrato) => {
    setContratoSeleccionado(contrato)
    setModalDetalles(true)
  }

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formularioData.empleadoId || !formularioData.numeroContrato || !formularioData.fechaInicio) {
      toast.error("Por favor complete todos los campos requeridos")
      return
    }

    const datosContrato: InsertContrato = {
      empleadoId: formularioData.empleadoId,
      numeroContrato: formularioData.numeroContrato,
      tipoContrato: formularioData.tipoContrato,
      fechaInicio: formularioData.fechaInicio,
      fechaFin: formularioData.fechaFin || null,
      salario: formularioData.salario,
      moneda: formularioData.moneda,
      horarioTrabajo: formularioData.horarioTrabajo,
      ubicacionTrabajo: formularioData.ubicacionTrabajo,
      clausulasEspeciales: [],
      estadoContrato: formularioData.estadoContrato,
      fechaFirma: formularioData.fechaInicio,
      firmadoPorEmpleado: false,
      firmadoPorEmpresa: false,
      observaciones: formularioData.observaciones,
      creadoPor: 1,
      actualizadoPor: 1
    }

    if (modoEdicion && contratoSeleccionado) {
      actualizarContratoMutation.mutate({ id: contratoSeleccionado.id, datos: datosContrato })
    } else {
      crearContratoMutation.mutate(datosContrato)
    }
  }

  const manejarEliminacion = async (contrato: Contrato) => {
    if (contrato.estadoContrato === "Activo") {
      // Primero preguntar si quiere finalizar el contrato
      const confirmarFinalizar = confirm(
        `Este contrato está activo. ¿Desea finalizarlo primero?\n\n` +
        `El contrato se marcará como "Terminado" y luego podrá eliminarlo.`
      );
      
      if (confirmarFinalizar) {
        try {
          // Finalizar el contrato primero
          await actualizarContratoMutation.mutateAsync({
            id: contrato.id,
            datos: { 
              estadoContrato: "Terminado",
              fechaFin: new Date().toISOString().split('T')[0],
              observaciones: (contrato.observaciones || '') + ' - Finalizado para eliminación'
            }
          });
          
          // Luego preguntar si quiere eliminarlo
          const confirmarEliminar = confirm("Contrato finalizado. ¿Desea eliminarlo ahora?");
          if (confirmarEliminar) {
            eliminarContratoMutation.mutate(contrato.id);
          }
        } catch (error) {
          toast.error("Error al finalizar el contrato");
        }
      }
    } else {
      // Contrato no activo, se puede eliminar directamente
      if (confirm("¿Está seguro de que desea eliminar este contrato?")) {
        eliminarContratoMutation.mutate(contrato.id);
      }
    }
  }

  const alternarExpansionEmpleado = (empleadoId: number) => {
    const nuevosExpandidos = new Set(empleadosExpandidos)
    if (nuevosExpandidos.has(empleadoId)) {
      nuevosExpandidos.delete(empleadoId)
    } else {
      nuevosExpandidos.add(empleadoId)
    }
    setEmpleadosExpandidos(nuevosExpandidos)
  }

  const contratosFiltrados = contratos.filter(contrato => {
    const empleado = obtenerEmpleado(contrato.empleadoId)
    if (!empleado) return false

    const terminoBusqueda = busqueda.toLowerCase()
    const coincideBusqueda = !busqueda || 
      empleado.nombres.toLowerCase().includes(terminoBusqueda) ||
      empleado.apellidos.toLowerCase().includes(terminoBusqueda) ||
      empleado.cedula.toLowerCase().includes(terminoBusqueda) ||
      contrato.numeroContrato.toLowerCase().includes(terminoBusqueda)

    const coincideEstado = filtroEstado === "all" || contrato.estadoContrato === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Contratos</h1>
          <p className="text-muted-foreground">
            Administración y seguimiento de contratos laborales
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={vistaHistorial ? "default" : "outline"} 
            onClick={() => setVistaHistorial(!vistaHistorial)}
          >
            <History className="mr-2 h-4 w-4" />
            {vistaHistorial ? "Vista Normal" : "Vista Historial"}
          </Button>
          <Button onClick={abrirModalCrear}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Contrato
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Activos</CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.contratosActivos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de contratos vigentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos a Vencer</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.contratosProximosVencer || 0}</div>
            <p className="text-xs text-muted-foreground">
              Vencen en los próximos 15 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.contratosVencidos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requieren renovación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contratos</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.totalContratos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Todos los estados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empleado, número de contrato..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {EstadosContrato.map(estado => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vista de Contratos */}
      <Card>
        <CardHeader>
          <CardTitle>
            {vistaHistorial ? "Historial de Contratos por Empleado" : "Lista de Contratos"}
          </CardTitle>
          <CardDescription>
            {vistaHistorial 
              ? `${historialContratos.length} empleados con contratos`
              : `${contratosFiltrados.length} contratos encontrados`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vistaHistorial ? (
            // Vista de Historial
            cargandoHistorial ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Cargando historial...</div>
              </div>
            ) : historialContratos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay historial de contratos
              </div>
            ) : (
              <div className="space-y-4">
                {historialContratos.map((item: any) => (
                  <div key={item.empleado.id} className="border rounded-lg">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                      onClick={() => alternarExpansionEmpleado(item.empleado.id)}
                    >
                      <div className="flex items-center gap-3">
                        {empleadosExpandidos.has(item.empleado.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div>
                          <div className="font-medium">
                            {item.empleado.nombres} {item.empleado.apellidos}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.empleado.cedula} • {item.departamento} • {item.cargo}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {item.contratos.length} contrato{item.contratos.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {empleadosExpandidos.has(item.empleado.id) && (
                      <div className="border-t bg-muted/20">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Número Contrato</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Fecha Inicio</TableHead>
                              <TableHead>Fecha Fin</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {item.contratos.map((contrato: Contrato) => {
                              const { estado, color } = obtenerEstadoContrato(contrato)
                              return (
                                <TableRow key={contrato.id}>
                                  <TableCell className="font-mono text-sm">
                                    <div className="flex items-center gap-2">
                                      {contrato.generadoAutomaticamente && (
                                        <Bot className="h-3 w-3 text-blue-500" title="Contrato auto-generado" />
                                      )}
                                      <span className={contrato.generadoAutomaticamente ? "text-blue-600" : ""}>
                                        {contrato.numeroContrato}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{contrato.tipoContrato}</TableCell>
                                  <TableCell>{formatearFecha(contrato.fechaInicio)}</TableCell>
                                  <TableCell>{formatearFecha(contrato.fechaFin)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                      <Badge variant={color as any}>
                                        {estado}
                                      </Badge>
                                      {contrato.generadoAutomaticamente && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                                          <Bot className="h-3 w-3 mr-1" />
                                          Auto
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => abrirModalDetalles(contrato)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => abrirModalEditar(contrato)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => manejarEliminacion(contrato)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            // Vista Normal
            cargandoContratos ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Cargando contratos...</div>
              </div>
            ) : contratosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron contratos
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Número Contrato</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratosFiltrados.map((contrato) => {
                    const empleado = obtenerEmpleado(contrato.empleadoId)
                    const { estado, color } = obtenerEstadoContrato(contrato)
                    
                    return (
                      <TableRow key={contrato.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {empleado ? `${empleado.nombres} ${empleado.apellidos}` : 'Empleado no encontrado'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {empleado?.cedula}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            {contrato.generadoAutomaticamente && (
                              <Bot className="h-3 w-3 text-blue-500" title="Contrato auto-generado" />
                            )}
                            <span className={contrato.generadoAutomaticamente ? "text-blue-600" : ""}>
                              {contrato.numeroContrato}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{contrato.tipoContrato}</TableCell>
                        <TableCell>{formatearFecha(contrato.fechaInicio)}</TableCell>
                        <TableCell>{formatearFecha(contrato.fechaFin)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant={color as any}>
                              {estado}
                            </Badge>
                            {contrato.generadoAutomaticamente && (
                              <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                                <Bot className="h-3 w-3 mr-1" />
                                Auto
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirModalDetalles(contrato)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirModalEditar(contrato)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => manejarEliminacion(contrato)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )
          )}
        </CardContent>
      </Card>

      {/* Modal para crear/editar contratos */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {modoEdicion ? 'Editar Contrato' : 'Nuevo Contrato'}
            </DialogTitle>
            <DialogDescription>
              {modoEdicion ? 'Modifique los datos del contrato' : 'Complete los datos para crear un nuevo contrato'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={manejarSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empleado">Empleado *</Label>
                <Select
                  value={formularioData.empleadoId.toString()}
                  onValueChange={(value) => setFormularioData({...formularioData, empleadoId: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleados.map(empleado => (
                      <SelectItem key={empleado.id} value={empleado.id.toString()}>
                        {empleado.nombres} {empleado.apellidos} - {empleado.cedula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numeroContrato">Número de Contrato *</Label>
                <Input
                  id="numeroContrato"
                  value={formularioData.numeroContrato}
                  onChange={(e) => setFormularioData({...formularioData, numeroContrato: e.target.value})}
                  placeholder="CONT-0001-2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoContrato">Tipo de Contrato *</Label>
                <Select
                  value={formularioData.tipoContrato}
                  onValueChange={(value) => setFormularioData({...formularioData, tipoContrato: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TiposContrato.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estadoContrato">Estado del Contrato</Label>
                <Select
                  value={formularioData.estadoContrato}
                  onValueChange={(value) => setFormularioData({...formularioData, estadoContrato: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EstadosContrato.map(estado => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formularioData.fechaInicio}
                  onChange={(e) => setFormularioData({...formularioData, fechaInicio: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fechaFin">Fecha de Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formularioData.fechaFin}
                  onChange={(e) => setFormularioData({...formularioData, fechaFin: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salario">Salario *</Label>
                <Input
                  id="salario"
                  type="number"
                  step="0.01"
                  value={formularioData.salario}
                  onChange={(e) => setFormularioData({...formularioData, salario: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="moneda">Moneda</Label>
                <Select
                  value={formularioData.moneda}
                  onValueChange={(value) => setFormularioData({...formularioData, moneda: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="VES">VES</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="horarioTrabajo">Horario de Trabajo</Label>
              <Input
                id="horarioTrabajo"
                value={formularioData.horarioTrabajo}
                onChange={(e) => setFormularioData({...formularioData, horarioTrabajo: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="ubicacionTrabajo">Ubicación de Trabajo</Label>
              <Input
                id="ubicacionTrabajo"
                value={formularioData.ubicacionTrabajo}
                onChange={(e) => setFormularioData({...formularioData, ubicacionTrabajo: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="motivoContrato">Motivo del Contrato *</Label>
                <Select
                  value={formularioData.motivoContrato}
                  onValueChange={(value) => setFormularioData({...formularioData, motivoContrato: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MotivosContrato.map(motivo => (
                      <SelectItem key={motivo} value={motivo}>{motivo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cargoId">Cargo *</Label>
                <Select
                  value={formularioData.cargoId.toString()}
                  onValueChange={(value) => setFormularioData({...formularioData, cargoId: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map(cargo => (
                      <SelectItem key={cargo.id} value={cargo.id.toString()}>
                        {cargo.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formularioData.observaciones}
                onChange={(e) => setFormularioData({...formularioData, observaciones: e.target.value})}
                rows={3}
                placeholder="Detalles adicionales sobre el motivo del contrato..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={crearContratoMutation.isPending || actualizarContratoMutation.isPending}>
                {modoEdicion ? 'Actualizar' : 'Crear'} Contrato
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para ver detalles del contrato */}
      <Dialog open={modalDetalles} onOpenChange={setModalDetalles}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Contrato</DialogTitle>
            <DialogDescription>
              Información completa del contrato laboral
            </DialogDescription>
          </DialogHeader>
          {contratoSeleccionado && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Empleado</Label>
                  <p className="text-sm mt-1">
                    {obtenerEmpleado(contratoSeleccionado.empleadoId)?.nombres} {obtenerEmpleado(contratoSeleccionado.empleadoId)?.apellidos}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Número de Contrato</Label>
                  <p className="text-sm mt-1 font-mono">{contratoSeleccionado.numeroContrato}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Tipo de Contrato</Label>
                  <p className="text-sm mt-1">{contratoSeleccionado.tipoContrato}</p>
                </div>
                <div>
                  <Label className="font-semibold">Estado</Label>
                  <Badge variant={obtenerEstadoContrato(contratoSeleccionado).color as any} className="mt-1">
                    {obtenerEstadoContrato(contratoSeleccionado).estado}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Fecha de Inicio</Label>
                  <p className="text-sm mt-1">{formatearFecha(contratoSeleccionado.fechaInicio)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Fecha de Fin</Label>
                  <p className="text-sm mt-1">{formatearFecha(contratoSeleccionado.fechaFin)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Salario</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium">
                      {contratoSeleccionado.salario} {contratoSeleccionado.moneda || 'USD'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Horario de Trabajo</Label>
                  <p className="text-sm mt-1">{contratoSeleccionado.horarioTrabajo}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Ubicación de Trabajo</Label>
                <p className="text-sm mt-1">{contratoSeleccionado.ubicacionTrabajo}</p>
              </div>
              
              {contratoSeleccionado.observaciones && (
                <div>
                  <Label className="font-semibold">Observaciones</Label>
                  <p className="text-sm mt-1">{contratoSeleccionado.observaciones}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setModalDetalles(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  setModalDetalles(false)
                  abrirModalEditar(contratoSeleccionado)
                }}>
                  Editar Contrato
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ContractsModule
