import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Users, UserPlus, Search, Filter, FileText, Phone, Mail, Edit, Trash2, Eye, MapPin } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { sistemaRRHH } from "@/lib/api"
import type { Empleado, InsertEmpleado, Departamento, Cargo } from "@shared/schema"
import { insertEmpleadoSchema } from "@shared/schema"
import { validarCedula } from "@/utils/venezuelan-validators"

const EmployeesModule = () => {
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("all")
  const [filtroDepartamento, setFiltroDepartamento] = useState<string>("all")
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  
  const queryClient = useQueryClient()

  // Queries
  const { data: empleados = [], isLoading: cargandoEmpleados } = useQuery({
    queryKey: ['/api/empleados', { 
      busqueda: busqueda || undefined,
      estado: filtroEstado === "all" ? undefined : filtroEstado,
      departamento: filtroDepartamento === "all" ? undefined : filtroDepartamento
    }],
    queryFn: () => sistemaRRHH.empleados.obtenerTodos({
      busqueda: busqueda || undefined,
      estado: filtroEstado === "all" ? undefined : filtroEstado,
      departamento: filtroDepartamento === "all" ? undefined : parseInt(filtroDepartamento)
    }),
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

  // Mutaciones
  const crearEmpleadoMutation = useMutation({
    mutationFn: sistemaRRHH.empleados.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empleados'] })
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/estadisticas'] })
      toast.success("Empleado creado exitosamente")
      setModalAbierto(false)
      setModoEdicion(false)
    },
    onError: (error) => {
      toast.error(`Error al crear empleado: ${error.message}`)
    },
  })

  const actualizarEmpleadoMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Partial<InsertEmpleado> }) =>
      sistemaRRHH.empleados.actualizar(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/empleados'] })
      toast.success("Empleado actualizado exitosamente")
      setModalAbierto(false)
      setModoEdicion(false)
      setEmpleadoSeleccionado(null)
    },
    onError: (error) => {
      toast.error(`Error al actualizar empleado: ${error.message}`)
    },
  })

  // Formulario simplificado
  const form = useForm({
    defaultValues: {
      email: "",
      cedula: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      genero: "Masculino",
      estadoCivil: "Soltero",
      telefono: "",
      direccion: "",
      ciudad: "",
      estado: "Distrito Capital",
      codigoPostal: null,
      numeroEmpleado: "",
      fechaIngreso: "",
      departamentoId: 1,
      cargoId: 1,
      supervisorId: null,
      salarioBase: "",
      tipoNomina: "Mensual",
      estadoEmpleado: "Activo",
    },
  })

  const onSubmit = (datos: any) => {
    // Preparar datos con campos obligatorios
    const datosCompletos = {
      ...datos,
      numeroEmpleado: `EMP-${Date.now()}`, // Generar número único
      creadoPor: 1,
      actualizadoPor: 1,
    }
    
    if (modoEdicion && empleadoSeleccionado) {
      actualizarEmpleadoMutation.mutate({ 
        id: empleadoSeleccionado.id, 
        datos: datosCompletos
      })
    } else {
      crearEmpleadoMutation.mutate(datosCompletos)
    }
  }

  const abrirModalCrear = () => {
    form.reset()
    setEmpleadoSeleccionado(null)
    setModoEdicion(false)
    setModalAbierto(true)
  }

  const abrirModalEditar = (empleado: Empleado) => {
    setEmpleadoSeleccionado(empleado)
    setModoEdicion(true)
    form.reset(empleado)
    setModalAbierto(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return <Badge className="bg-success/10 text-success border-success/20">Activo</Badge>
      case "Período Prueba":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Período Prueba</Badge>
      case "Vacaciones":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Vacaciones</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Empleados</h1>
          <p className="text-muted-foreground">
            Administración completa del personal y expedientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={abrirModalCrear} className="bg-primary hover:bg-primary-dark">
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.totalEmpleados || 0}</div>
            <p className="text-xs text-muted-foreground">Total empleados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Período Prueba</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.empleadosPeriodoPrueba || 0}</div>
            <p className="text-xs text-muted-foreground">Próximos a evaluar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.empleadosActivos || 0}</div>
            <p className="text-xs text-muted-foreground">Empleados activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.contratosActivos || 0}</div>
            <p className="text-xs text-muted-foreground">Contratos activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Empleados</CardTitle>
              <CardDescription>
                Gestión y seguimiento del personal activo
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                <Input 
                  placeholder="Buscar por nombre o cédula..." 
                  className="pl-8 w-64" 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Periodo Prueba">Período Prueba</SelectItem>
                  <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                  <SelectItem value="Licencia">Licencia</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroDepartamento} onValueChange={setFiltroDepartamento}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departamentos.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cargandoEmpleados ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando empleados...
              </div>
            ) : empleados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron empleados
              </div>
            ) : (
              empleados.map((empleado) => {
                const departamento = departamentos.find(d => d.id === empleado.departamentoId)
                const cargo = cargos.find(c => c.id === empleado.cargoId)
                
                return (
                  <div key={empleado.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">
                          {empleado.nombres.charAt(0)}{empleado.apellidos.charAt(0)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-medium">{empleado.nombres} {empleado.apellidos}</h3>
                        <p className="text-sm text-muted-foreground">{empleado.cedula}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{cargo?.titulo || 'Sin cargo'}</span>
                        <span className="text-xs text-muted-foreground">{departamento?.nombre || 'Sin departamento'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {getStatusBadge(empleado.estadoEmpleado)}
                      <div className="text-xs text-muted-foreground">
                        Ingreso: {empleado.fechaIngreso}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Teléfono">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Email">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => abrirModalEditar(empleado)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver perfil">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => abrirModalEditar(empleado)}>
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Department Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { dept: "Operaciones", count: 89, percentage: 36 },
                { dept: "Administración", count: 67, percentage: 27 },
                { dept: "Tecnología", count: 45, percentage: 18 },
                { dept: "Marketing", count: 28, percentage: 11 },
                { dept: "Recursos Humanos", count: 18, percentage: 8 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.dept}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validaciones Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Cédulas por verificar", count: 3, priority: "high" },
                { type: "Documentos faltantes", count: 7, priority: "medium" },
                { type: "Títulos por validar", count: 2, priority: "high" },
                { type: "Referencias laborales", count: 5, priority: "low" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.priority === "high" ? "bg-destructive" :
                      item.priority === "medium" ? "bg-warning" : "bg-muted"
                    }`} />
                    <span className="text-sm">{item.type}</span>
                  </div>
                  <Badge variant="outline">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para crear/editar empleado */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modoEdicion ? 'Editar Empleado' : 'Nuevo Empleado'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Juan Carlos" data-testid="input-nombres" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Pérez García" data-testid="input-apellidos" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cedula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cédula *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="V-12345678" data-testid="input-cedula" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="juan@empresa.com" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Nacimiento *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" data-testid="input-fechaNacimiento" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-genero">
                              <SelectValue placeholder="Seleccionar género" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Femenino">Femenino</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estadoCivil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-estadoCivil">
                              <SelectValue placeholder="Seleccionar estado civil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Soltero">Soltero/a</SelectItem>
                            <SelectItem value="Casado">Casado/a</SelectItem>
                            <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                            <SelectItem value="Viudo">Viudo/a</SelectItem>
                            <SelectItem value="Union Estable">Unión Estable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0414-1234567" data-testid="input-telefono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Información Laboral */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información Laboral</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fechaIngreso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Ingreso *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" data-testid="input-fechaIngreso" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estadoEmpleado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado del Empleado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-estadoEmpleado">
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Periodo Prueba">Período Prueba</SelectItem>
                            <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                            <SelectItem value="Licencia">Licencia</SelectItem>
                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="departamentoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger data-testid="select-departamento">
                              <SelectValue placeholder="Seleccionar departamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departamentos.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger data-testid="select-cargo">
                              <SelectValue placeholder="Seleccionar cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cargos.map((cargo) => (
                              <SelectItem key={cargo.id} value={cargo.id.toString()}>
                                {cargo.titulo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salarioBase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salario Base</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1500.00" data-testid="input-salarioBase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipoNomina"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Nómina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tipoNomina">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Quincenal">Quincenal</SelectItem>
                            <SelectItem value="Mensual">Mensual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setModalAbierto(false)}
                  data-testid="button-cancelar"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={crearEmpleadoMutation.isPending || actualizarEmpleadoMutation.isPending}
                  data-testid="button-guardar"
                >
                  {(crearEmpleadoMutation.isPending || actualizarEmpleadoMutation.isPending) 
                    ? "Guardando..." 
                    : modoEdicion ? "Actualizar" : "Crear Empleado"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeesModule