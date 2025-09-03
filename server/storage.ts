import {
  // Tipos principales
  type Usuario, type InsertUsuario,
  type Rol, type InsertRol,
  type Empleado, type InsertEmpleado,
  type Departamento, type InsertDepartamento,
  type Cargo, type InsertCargo,
  type Contrato, type InsertContrato,
  type MovimientoLaboral, type InsertMovimientoLaboral,
  type PeriodoPrueba, type InsertPeriodoPrueba,
  type EvaluacionPrueba, type InsertEvaluacionPrueba,
  type Egreso, type InsertEgreso,
  type ReasignacionSupervision, type InsertReasignacionSupervision
} from "@shared/schema";

// Interface principal del almacenamiento con todas las operaciones CRUD
export interface IAlmacenamiento {
  // ===== USUARIOS Y ROLES =====
  obtenerUsuario(id: number): Promise<Usuario | undefined>;
  obtenerUsuarioPorNombre(nombreUsuario: string): Promise<Usuario | undefined>;
  crearUsuario(usuario: InsertUsuario): Promise<Usuario>;
  actualizarUsuario(id: number, datos: Partial<InsertUsuario>): Promise<Usuario | undefined>;
  listarUsuarios(): Promise<Usuario[]>;
  eliminarUsuario(id: number): Promise<boolean>;

  obtenerRol(id: number): Promise<Rol | undefined>;
  crearRol(rol: InsertRol): Promise<Rol>;
  listarRoles(): Promise<Rol[]>;
  actualizarRol(id: number, datos: Partial<InsertRol>): Promise<Rol | undefined>;

  // ===== EMPLEADOS =====
  obtenerEmpleado(id: number): Promise<Empleado | undefined>;
  obtenerEmpleadoPorCedula(cedula: string): Promise<Empleado | undefined>;
  crearEmpleado(empleado: InsertEmpleado): Promise<Empleado>;
  actualizarEmpleado(id: number, datos: Partial<InsertEmpleado>): Promise<Empleado | undefined>;
  listarEmpleados(): Promise<Empleado[]>;
  listarEmpleadosPorDepartamento(departamentoId: number): Promise<Empleado[]>;
  listarEmpleadosPorEstado(estado: string): Promise<Empleado[]>;
  buscarEmpleados(termino: string): Promise<Empleado[]>;

  // ===== DEPARTAMENTOS Y CARGOS =====
  obtenerDepartamento(id: number): Promise<Departamento | undefined>;
  crearDepartamento(departamento: InsertDepartamento): Promise<Departamento>;
  listarDepartamentos(): Promise<Departamento[]>;
  actualizarDepartamento(id: number, datos: Partial<InsertDepartamento>): Promise<Departamento | undefined>;

  obtenerCargo(id: number): Promise<Cargo | undefined>;
  crearCargo(cargo: InsertCargo): Promise<Cargo>;
  listarCargos(): Promise<Cargo[]>;
  listarCargosPorDepartamento(departamentoId: number): Promise<Cargo[]>;
  actualizarCargo(id: number, datos: Partial<InsertCargo>): Promise<Cargo | undefined>;

  // ===== CONTRATOS =====
  obtenerContrato(id: number): Promise<Contrato | undefined>;
  obtenerContratosPorEmpleado(empleadoId: number): Promise<Contrato[]>;
  crearContrato(contrato: InsertContrato): Promise<Contrato>;
  actualizarContrato(id: number, datos: Partial<InsertContrato>): Promise<Contrato | undefined>;
  listarContratos(): Promise<Contrato[]>;
  listarContratosPorEstado(estado: string): Promise<Contrato[]>;
  listarContratosProximosVencer(dias: number): Promise<Contrato[]>;
  eliminarContrato(id: number): Promise<boolean>;

  // ===== MOVIMIENTOS LABORALES =====
  crearMovimientoLaboral(movimiento: InsertMovimientoLaboral): Promise<MovimientoLaboral>;
  listarMovimientosPorEmpleado(empleadoId: number): Promise<MovimientoLaboral[]>;
  listarMovimientos(): Promise<MovimientoLaboral[]>;

  // ===== PERÍODOS DE PRUEBA =====
  obtenerPeriodoPrueba(id: number): Promise<PeriodoPrueba | undefined>;
  obtenerPeriodoPruebaPorEmpleado(empleadoId: number): Promise<PeriodoPrueba | undefined>;
  crearPeriodoPrueba(periodo: InsertPeriodoPrueba): Promise<PeriodoPrueba>;
  actualizarPeriodoPrueba(id: number, datos: Partial<InsertPeriodoPrueba>): Promise<PeriodoPrueba | undefined>;
  listarPeriodosPrueba(): Promise<PeriodoPrueba[]>;
  listarPeriodosPruebaProximosVencer(dias: number): Promise<PeriodoPrueba[]>;

  crearEvaluacionPrueba(evaluacion: InsertEvaluacionPrueba): Promise<EvaluacionPrueba>;
  listarEvaluacionesPorPeriodo(periodoPruebaId: number): Promise<EvaluacionPrueba[]>;
  listarEvaluacionesPendientes(): Promise<EvaluacionPrueba[]>;

  // ===== EGRESOS =====
  obtenerEgreso(id: number): Promise<Egreso | undefined>;
  crearEgreso(egreso: InsertEgreso): Promise<Egreso>;
  actualizarEgreso(id: number, datos: Partial<InsertEgreso>): Promise<Egreso | undefined>;
  listarEgresos(): Promise<Egreso[]>;
  listarEgresosPorEstado(estado: string): Promise<Egreso[]>;
  listarEgresosPendientes(): Promise<Egreso[]>;

  crearReasignacionSupervision(reasignacion: InsertReasignacionSupervision): Promise<ReasignacionSupervision>;
  listarReasignacionesPorEgreso(egresoId: number): Promise<ReasignacionSupervision[]>;
}

export class AlmacenamientoMemoria implements IAlmacenamiento {
  // Maps para almacenar datos en memoria
  private usuarios: Map<number, Usuario>;
  private roles: Map<number, Rol>;
  private empleados: Map<number, Empleado>;
  private departamentos: Map<number, Departamento>;
  private cargos: Map<number, Cargo>;
  private contratos: Map<number, Contrato>;
  private movimientosLaborales: Map<number, MovimientoLaboral>;
  private periodosPrueba: Map<number, PeriodoPrueba>;
  private evaluacionesPrueba: Map<number, EvaluacionPrueba>;
  private egresos: Map<number, Egreso>;
  private reasignacionesSupervision: Map<number, ReasignacionSupervision>;

  // Contadores para IDs autoincrementales
  private contadorUsuarios: number;
  private contadorRoles: number;
  private contadorEmpleados: number;
  private contadorDepartamentos: number;
  private contadorCargos: number;
  private contadorContratos: number;
  private contadorMovimientos: number;
  private contadorPeriodos: number;
  private contadorEvaluaciones: number;
  private contadorEgresos: number;
  private contadorReasignaciones: number;

  constructor() {
    // Inicializar todos los Maps
    this.usuarios = new Map();
    this.roles = new Map();
    this.empleados = new Map();
    this.departamentos = new Map();
    this.cargos = new Map();
    this.contratos = new Map();
    this.movimientosLaborales = new Map();
    this.periodosPrueba = new Map();
    this.evaluacionesPrueba = new Map();
    this.egresos = new Map();
    this.reasignacionesSupervision = new Map();

    // Inicializar contadores
    this.contadorUsuarios = 1;
    this.contadorRoles = 1;
    this.contadorEmpleados = 1;
    this.contadorDepartamentos = 1;
    this.contadorCargos = 1;
    this.contadorContratos = 1;
    this.contadorMovimientos = 1;
    this.contadorPeriodos = 1;
    this.contadorEvaluaciones = 1;
    this.contadorEgresos = 1;
    this.contadorReasignaciones = 1;

    // Inicializar datos semilla
    this.inicializarDatosSemilla();
  }

  // ===== MÉTODOS USUARIOS =====
  async obtenerUsuario(id: number): Promise<Usuario | undefined> {
    return this.usuarios.get(id);
  }

  async obtenerUsuarioPorNombre(nombreUsuario: string): Promise<Usuario | undefined> {
    return Array.from(this.usuarios.values()).find(
      (usuario) => usuario.nombreUsuario === nombreUsuario
    );
  }

  async crearUsuario(insertUsuario: InsertUsuario): Promise<Usuario> {
    const id = this.contadorUsuarios++;
    const ahora = new Date();
    const usuario: Usuario = {
      ...insertUsuario,
      id,
      activo: insertUsuario.activo ?? true,
      fechaCreacion: ahora,
      ultimoAcceso: null,
    };
    this.usuarios.set(id, usuario);
    return usuario;
  }

  async actualizarUsuario(id: number, datos: Partial<InsertUsuario>): Promise<Usuario | undefined> {
    const usuario = this.usuarios.get(id);
    if (!usuario) return undefined;

    const usuarioActualizado: Usuario = { ...usuario, ...datos };
    this.usuarios.set(id, usuarioActualizado);
    return usuarioActualizado;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return Array.from(this.usuarios.values());
  }

  async eliminarUsuario(id: number): Promise<boolean> {
    return this.usuarios.delete(id);
  }

  // ===== MÉTODOS ROLES =====
  async obtenerRol(id: number): Promise<Rol | undefined> {
    return this.roles.get(id);
  }

  async crearRol(insertRol: InsertRol): Promise<Rol> {
    const id = this.contadorRoles++;
    const rol: Rol = { ...insertRol, id };
    this.roles.set(id, rol);
    return rol;
  }

  async listarRoles(): Promise<Rol[]> {
    return Array.from(this.roles.values());
  }

  async actualizarRol(id: number, datos: Partial<InsertRol>): Promise<Rol | undefined> {
    const rol = this.roles.get(id);
    if (!rol) return undefined;

    const rolActualizado: Rol = { ...rol, ...datos };
    this.roles.set(id, rolActualizado);
    return rolActualizado;
  }

  // ===== MÉTODOS EMPLEADOS =====
  async obtenerEmpleado(id: number): Promise<Empleado | undefined> {
    return this.empleados.get(id);
  }

  async obtenerEmpleadoPorCedula(cedula: string): Promise<Empleado | undefined> {
    return Array.from(this.empleados.values()).find(
      (empleado) => empleado.cedula === cedula
    );
  }

  async crearEmpleado(insertEmpleado: InsertEmpleado): Promise<Empleado> {
    const id = this.contadorEmpleados++;
    const ahora = new Date();
    const empleado: Empleado = {
      ...insertEmpleado,
      id,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };
    this.empleados.set(id, empleado);

    // Crear contrato inicial automáticamente
    await this.crearContrato({
      empleadoId: id,
      numeroContrato: `CONT-${String(id).padStart(4, '0')}-${new Date().getFullYear()}`,
      tipoContrato: "Indefinido",
      fechaInicio: insertEmpleado.fechaIngreso,
      fechaFin: null,
      salario: insertEmpleado.salarioBase,
      moneda: "USD",
      horarioTrabajo: "Lunes a Viernes 8:00 AM - 5:00 PM",
      ubicacionTrabajo: "Oficina Principal",
      clausulasEspeciales: [],
      estadoContrato: "Activo",
      fechaFirma: insertEmpleado.fechaIngreso,
      firmadoPorEmpleado: true,
      firmadoPorEmpresa: true,
      observaciones: "Contrato inicial generado automáticamente",
      creadoPor: insertEmpleado.creadoPor || 1,
      actualizadoPor: insertEmpleado.actualizadoPor || 1,
    });

    return empleado;
  }

  async actualizarEmpleado(id: number, datos: Partial<InsertEmpleado>): Promise<Empleado | undefined> {
    const empleado = this.empleados.get(id);
    if (!empleado) return undefined;

    const empleadoActualizado: Empleado = {
      ...empleado,
      ...datos,
      fechaActualizacion: new Date(),
    };
    this.empleados.set(id, empleadoActualizado);

    // Si se actualiza la fecha de ingreso, actualizar el contrato inicial
    if (datos.fechaIngreso) {
      const contratos = await this.obtenerContratosPorEmpleado(id);
      const contratoInicial = contratos.find(c => c.observaciones?.includes("Contrato inicial generado automáticamente"));
      
      if (contratoInicial) {
        await this.actualizarContrato(contratoInicial.id, {
          fechaInicio: datos.fechaIngreso,
          fechaFirma: datos.fechaIngreso
        });
      }
    }

    return empleadoActualizado;
  }

  async listarEmpleados(): Promise<Empleado[]> {
    return Array.from(this.empleados.values());
  }

  async listarEmpleadosPorDepartamento(departamentoId: number): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(
      (empleado) => empleado.departamentoId === departamentoId
    );
  }

  async listarEmpleadosPorEstado(estado: string): Promise<Empleado[]> {
    return Array.from(this.empleados.values()).filter(
      (empleado) => empleado.estadoEmpleado === estado
    );
  }

  async buscarEmpleados(termino: string): Promise<Empleado[]> {
    const terminoLower = termino.toLowerCase();
    return Array.from(this.empleados.values()).filter(
      (empleado) =>
        empleado.nombres.toLowerCase().includes(terminoLower) ||
        empleado.apellidos.toLowerCase().includes(terminoLower) ||
        empleado.cedula.includes(termino) ||
        empleado.numeroEmpleado.includes(termino)
    );
  }

  // ===== MÉTODOS DEPARTAMENTOS =====
  async obtenerDepartamento(id: number): Promise<Departamento | undefined> {
    return this.departamentos.get(id);
  }

  async crearDepartamento(insertDepartamento: InsertDepartamento): Promise<Departamento> {
    const id = this.contadorDepartamentos++;
    const departamento: Departamento = { ...insertDepartamento, id };
    this.departamentos.set(id, departamento);
    return departamento;
  }

  async listarDepartamentos(): Promise<Departamento[]> {
    return Array.from(this.departamentos.values());
  }

  async actualizarDepartamento(id: number, datos: Partial<InsertDepartamento>): Promise<Departamento | undefined> {
    const departamento = this.departamentos.get(id);
    if (!departamento) return undefined;

    const departamentoActualizado: Departamento = { ...departamento, ...datos };
    this.departamentos.set(id, departamentoActualizado);
    return departamentoActualizado;
  }

  // ===== MÉTODOS CARGOS =====
  async obtenerCargo(id: number): Promise<Cargo | undefined> {
    return this.cargos.get(id);
  }

  async crearCargo(insertCargo: InsertCargo): Promise<Cargo> {
    const id = this.contadorCargos++;
    const cargo: Cargo = { ...insertCargo, id };
    this.cargos.set(id, cargo);
    return cargo;
  }

  async listarCargos(): Promise<Cargo[]> {
    return Array.from(this.cargos.values());
  }

  async listarCargosPorDepartamento(departamentoId: number): Promise<Cargo[]> {
    return Array.from(this.cargos.values()).filter(
      (cargo) => cargo.departamentoId === departamentoId
    );
  }

  async actualizarCargo(id: number, datos: Partial<InsertCargo>): Promise<Cargo | undefined> {
    const cargo = this.cargos.get(id);
    if (!cargo) return undefined;

    const cargoActualizado: Cargo = { ...cargo, ...datos };
    this.cargos.set(id, cargoActualizado);
    return cargoActualizado;
  }

  // ===== MÉTODOS CONTRATOS =====
  async obtenerContrato(id: number): Promise<Contrato | undefined> {
    return this.contratos.get(id);
  }

  async obtenerContratosPorEmpleado(empleadoId: number): Promise<Contrato[]> {
    return Array.from(this.contratos.values()).filter(
      (contrato) => contrato.empleadoId === empleadoId
    );
  }

  async crearContrato(insertContrato: InsertContrato): Promise<Contrato> {
    const id = this.contadorContratos++;
    const ahora = new Date();
    const contrato: Contrato = {
      ...insertContrato,
      id,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };
    this.contratos.set(id, contrato);
    return contrato;
  }

  async actualizarContrato(id: number, datos: Partial<InsertContrato>): Promise<Contrato | undefined> {
    const contrato = this.contratos.get(id);
    if (!contrato) return undefined;

    const contratoActualizado: Contrato = {
      ...contrato,
      ...datos,
      fechaActualizacion: new Date(),
    };
    this.contratos.set(id, contratoActualizado);
    return contratoActualizado;
  }

  async listarContratos(): Promise<Contrato[]> {
    return Array.from(this.contratos.values());
  }

  async listarContratosPorEstado(estado: string): Promise<Contrato[]> {
    return Array.from(this.contratos.values()).filter(
      (contrato) => contrato.estadoContrato === estado
    );
  }

  async listarContratosProximosVencer(dias: number): Promise<Contrato[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    return Array.from(this.contratos.values()).filter((contrato) => {
      if (!contrato.fechaFin) return false;
      const fechaFin = new Date(contrato.fechaFin);
      return fechaFin <= fechaLimite && contrato.estadoContrato === "Activo";
    });
  }

  async eliminarContrato(id: number): Promise<boolean> {
    return this.contratos.delete(id);
  }

  // ===== MÉTODOS MOVIMIENTOS LABORALES =====
  async crearMovimientoLaboral(insertMovimiento: InsertMovimientoLaboral): Promise<MovimientoLaboral> {
    const id = this.contadorMovimientos++;
    const movimiento: MovimientoLaboral = {
      ...insertMovimiento,
      id,
      fechaCreacion: new Date(),
    };
    this.movimientosLaborales.set(id, movimiento);
    return movimiento;
  }

  async listarMovimientosPorEmpleado(empleadoId: number): Promise<MovimientoLaboral[]> {
    return Array.from(this.movimientosLaborales.values()).filter(
      (movimiento) => movimiento.empleadoId === empleadoId
    );
  }

  async listarMovimientos(): Promise<MovimientoLaboral[]> {
    return Array.from(this.movimientosLaborales.values());
  }

  // ===== MÉTODOS PERÍODOS DE PRUEBA =====
  async obtenerPeriodoPrueba(id: number): Promise<PeriodoPrueba | undefined> {
    return this.periodosPrueba.get(id);
  }

  async obtenerPeriodoPruebaPorEmpleado(empleadoId: number): Promise<PeriodoPrueba | undefined> {
    return Array.from(this.periodosPrueba.values()).find(
      (periodo) => periodo.empleadoId === empleadoId
    );
  }

  async crearPeriodoPrueba(insertPeriodo: InsertPeriodoPrueba): Promise<PeriodoPrueba> {
    const id = this.contadorPeriodos++;
    const periodo: PeriodoPrueba = {
      ...insertPeriodo,
      id,
      fechaCreacion: new Date(),
    };
    this.periodosPrueba.set(id, periodo);
    return periodo;
  }

  async actualizarPeriodoPrueba(id: number, datos: Partial<InsertPeriodoPrueba>): Promise<PeriodoPrueba | undefined> {
    const periodo = this.periodosPrueba.get(id);
    if (!periodo) return undefined;

    const periodoActualizado: PeriodoPrueba = { ...periodo, ...datos };
    this.periodosPrueba.set(id, periodoActualizado);
    return periodoActualizado;
  }

  async listarPeriodosPrueba(): Promise<PeriodoPrueba[]> {
    return Array.from(this.periodosPrueba.values());
  }

  async listarPeriodosPruebaProximosVencer(dias: number): Promise<PeriodoPrueba[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    return Array.from(this.periodosPrueba.values()).filter((periodo) => {
      const fechaFin = new Date(periodo.fechaFin);
      return fechaFin <= fechaLimite && periodo.estadoPeriodo === "Activo";
    });
  }

  // ===== MÉTODOS EVALUACIONES =====
  async crearEvaluacionPrueba(insertEvaluacion: InsertEvaluacionPrueba): Promise<EvaluacionPrueba> {
    const id = this.contadorEvaluaciones++;
    const evaluacion: EvaluacionPrueba = {
      ...insertEvaluacion,
      id,
      fechaCreacion: new Date(),
    };
    this.evaluacionesPrueba.set(id, evaluacion);
    return evaluacion;
  }

  async listarEvaluacionesPorPeriodo(periodoPruebaId: number): Promise<EvaluacionPrueba[]> {
    return Array.from(this.evaluacionesPrueba.values()).filter(
      (evaluacion) => evaluacion.periodoPruebaId === periodoPruebaId
    );
  }

  async listarEvaluacionesPendientes(): Promise<EvaluacionPrueba[]> {
    // Lógica para determinar evaluaciones pendientes
    return Array.from(this.evaluacionesPrueba.values()).filter(
      (evaluacion) => evaluacion.resultado === "Requiere Seguimiento"
    );
  }

  // ===== MÉTODOS EGRESOS =====
  async obtenerEgreso(id: number): Promise<Egreso | undefined> {
    return this.egresos.get(id);
  }

  async crearEgreso(insertEgreso: InsertEgreso): Promise<Egreso> {
    const id = this.contadorEgresos++;
    const ahora = new Date();
    const egreso: Egreso = {
      ...insertEgreso,
      id,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };
    this.egresos.set(id, egreso);
    return egreso;
  }

  async actualizarEgreso(id: number, datos: Partial<InsertEgreso>): Promise<Egreso | undefined> {
    const egreso = this.egresos.get(id);
    if (!egreso) return undefined;

    const egresoActualizado: Egreso = {
      ...egreso,
      ...datos,
      fechaActualizacion: new Date(),
    };
    this.egresos.set(id, egresoActualizado);
    return egresoActualizado;
  }

  async listarEgresos(): Promise<Egreso[]> {
    return Array.from(this.egresos.values());
  }

  async listarEgresosPorEstado(estado: string): Promise<Egreso[]> {
    return Array.from(this.egresos.values()).filter(
      (egreso) => egreso.estadoProceso === estado
    );
  }

  async listarEgresosPendientes(): Promise<Egreso[]> {
    return Array.from(this.egresos.values()).filter(
      (egreso) => egreso.estadoProceso === "Pendiente"
    );
  }

  async obtenerIngresosRecientes(dias: number): Promise<any[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    
    const empleadosRecientes = Array.from(this.empleados.values()).filter(
      (empleado) => {
        const fechaIngreso = new Date(empleado.fechaIngreso);
        return fechaIngreso >= fechaLimite && empleado.estadoEmpleado !== "Egresado";
      }
    );

    // Agrupar por departamento
    const ingresosPorDept = empleadosRecientes.reduce((acc, empleado) => {
      const deptId = empleado.departamentoId;
      const dept = this.departamentos.get(deptId);
      const nombreDept = dept?.nombre || "Sin departamento";
      
      if (!acc[nombreDept]) {
        acc[nombreDept] = 0;
      }
      acc[nombreDept]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(ingresosPorDept)
      .map(([departamento, cantidad]) => ({ departamento, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  // ===== MÉTODOS REASIGNACIONES =====
  async crearReasignacionSupervision(insertReasignacion: InsertReasignacionSupervision): Promise<ReasignacionSupervision> {
    const id = this.contadorReasignaciones++;
    const reasignacion: ReasignacionSupervision = {
      ...insertReasignacion,
      id,
      fechaCreacion: new Date(),
    };
    this.reasignacionesSupervision.set(id, reasignacion);
    return reasignacion;
  }

  async listarReasignacionesPorEgreso(egresoId: number): Promise<ReasignacionSupervision[]> {
    return Array.from(this.reasignacionesSupervision.values()).filter(
      (reasignacion) => reasignacion.egresoId === egresoId
    );
  }

  // ===== MÉTODO PARA INICIALIZAR DATOS SEMILLA =====
  private async inicializarDatosSemilla(): Promise<void> {
    // Crear roles predeterminados
    await this.crearRol({
      nombre: "Gerente RRHH",
      descripcion: "Acceso completo al sistema",
      nivel: 1,
      permisos: ["todos"],
      activo: true,
    });

    await this.crearRol({
      nombre: "Admin RRHH",
      descripcion: "Gestión completa excepto configuración",
      nivel: 2,
      permisos: ["empleados", "contratos", "evaluaciones", "egresos"],
      activo: true,
    });

    await this.crearRol({
      nombre: "Supervisor",
      descripcion: "Gestión de empleados de su área",
      nivel: 3,
      permisos: ["empleados_area", "evaluaciones_area"],
      activo: true,
    });

    // Crear departamentos básicos
    await this.crearDepartamento({
      nombre: "Recursos Humanos",
      descripcion: "Gestión del talento humano",
      gerenteId: null,
      centroCoste: "RRHH001",
      activo: true,
    });

    await this.crearDepartamento({
      nombre: "Tecnología",
      descripcion: "Desarrollo y sistemas",
      gerenteId: null,
      centroCoste: "TEC001",
      activo: true,
    });

    await this.crearDepartamento({
      nombre: "Marketing",
      descripcion: "Mercadeo y comunicaciones",
      gerenteId: null,
      centroCoste: "MKT001",
      activo: true,
    });

    await this.crearDepartamento({
      nombre: "Finanzas",
      descripcion: "Gestión de recursos financieros",
      gerenteId: null,
      centroCoste: "FIN001",
      activo: true,
    });
    await this.crearDepartamento({
      nombre: "Ventas",
      descripcion: "Comercialización de productos y servicios",
      gerenteId: null,
      centroCoste: "VEN001",
      activo: true,
    });
    await this.crearDepartamento({
      nombre: "Operaciones",
      descripcion: "Gestión de procesos y producción",
      gerenteId: null,
      centroCoste: "OPR001",
      activo: true,
    });
    await this.crearDepartamento({
      nombre: "Investigación y Desarrollo",
      descripcion: "Desarrollo de nuevos productos y mejoras",
      gerenteId: null,
      centroCoste: "I+D001",
      activo: true,
    });
    await this.crearDepartamento({
      nombre: "Atención al Cliente",
      descripcion: "Soporte y servicio al cliente",
      gerenteId: null,
      centroCoste: "ATC001",
      activo: true,
    });

    // Crear cargos básicos
    await this.crearCargo({
      titulo: "Gerente de RRHH",
      descripcion: "Responsable de la gestión del talento humano",
      departamentoId: 1,
      nivelSalarial: 5,
      salarioMinimo: "8000",
      salarioMaximo: "12000",
      competenciasRequeridas: ["Liderazgo", "Gestión de Personal", "Legislación Laboral"],
      activo: true,
    });

    await this.crearCargo({
      titulo: "Desarrollador Senior",
      descripcion: "Desarrollo de aplicaciones y sistemas",
      departamentoId: 2,
      nivelSalarial: 4,
      salarioMinimo: "6000",
      salarioMaximo: "10000",
      competenciasRequeridas: ["JavaScript", "React", "Node.js", "Base de Datos"],
      activo: true,
    });

    await this.crearCargo({
      titulo: "Director de Finanzas",
      descripcion: "Responsable de la administración financiera",
      departamentoId: 1,
      nivelSalarial: 5,
      salarioMinimo: "9000",
      salarioMaximo: "15000",
      competenciasRequeridas: ["Análisis Financiero", "Planificación Estratégica", "Liderazgo"],
      activo: true,
    });
    await this.crearCargo({
      titulo: "Ejecutivo de Ventas",
      descripcion: "Captación y gestión de clientes",
      departamentoId: 2,
      nivelSalarial: 3,
      salarioMinimo: "4000",
      salarioMaximo: "8000",
      competenciasRequeridas: ["Técnicas de Venta", "Negociación", "Comunicación"],
      activo: true,
    });
    await this.crearCargo({
      titulo: "Jefe de Operaciones",
      descripcion: "Gestión de procesos operativos",
      departamentoId: 3,
      nivelSalarial: 4,
      salarioMinimo: "7000",
      salarioMaximo: "11000",
      competenciasRequeridas: ["Gestión de Proyectos", "Optimización de Procesos", "Resolución de Problemas"],
      activo: true,
    });
    await this.crearCargo({
      titulo: "Investigador de Producto",
      descripcion: "Estudio y desarrollo de nuevos productos",
      departamentoId: 4,
      nivelSalarial: 4,
      salarioMinimo: "5000",
      salarioMaximo: "9000",
      competenciasRequeridas: ["Investigación de Mercado", "Innovación", "Creatividad"],
      activo: true,
    });
    await this.crearCargo({
      titulo: "Representante de Atención al Cliente",
      descripcion: "Brindar soporte y resolver inquietudes de los clientes",
      departamentoId: 5,
      nivelSalarial: 2,
      salarioMinimo: "3000",
      salarioMaximo: "5000",
      competenciasRequeridas: ["Empatía", "Resolución de Conflictos", "Comunicación Efectiva"],
      activo: true,
    });

    // Crear usuario administrador
    await this.crearUsuario({
      nombreUsuario: "admin",
      contrasena: "admin123", // En producción debe estar hasheada
      email: "admin@empresa.com",
      nombreCompleto: "Administrador del Sistema",
      rolId: 1,
      activo: true,
    });

    // Crear empleados de ejemplo
    await this.crearEmpleado({
      cedula: "V-12345678",
      nombres: "María Elena",
      apellidos: "González Rodríguez",
      fechaNacimiento: "1985-05-15",
      genero: "Femenino",
      estadoCivil: "Casada",
      telefono: "0414-1234567",
      email: "maria.gonzalez@empresa.com",
      direccion: "Av. Libertador, Edificio Central, Piso 5, Apt 5B",
      ciudad: "Caracas",
      estado: "Distrito Capital",
      codigoPostal: "1010",
      numeroEmpleado: "EMP-001",
      fechaIngreso: "2023-01-15",
      departamentoId: 1,
      cargoId: 1,
      supervisorId: null,
      salarioBase: "8500.00",
      tipoNomina: "Mensual",
      estadoEmpleado: "Activo",
      fechaEgreso: null,
      motivoEgreso: null,
      creadoPor: 1,
      actualizadoPor: 1,
    });

    await this.crearEmpleado({
      cedula: "V-23456789",
      nombres: "Carlos Antonio",
      apellidos: "Pérez Martínez",
      fechaNacimiento: "1990-08-22",
      genero: "Masculino",
      estadoCivil: "Soltero",
      telefono: "0426-2345678",
      email: "carlos.perez@empresa.com",
      direccion: "Calle Real, Casa #45, Sector Los Rosales",
      ciudad: "Valencia",
      estado: "Carabobo",
      codigoPostal: "2001",
      numeroEmpleado: "EMP-002",
      fechaIngreso: "2023-06-01",
      departamentoId: 2,
      cargoId: 2,
      supervisorId: 1,
      salarioBase: "7200.00",
      tipoNomina: "Quincenal",
      estadoEmpleado: "Activo",
      fechaEgreso: null,
      motivoEgreso: null,
      creadoPor: 1,
      actualizadoPor: 1,
    });

    await this.crearEmpleado({
      cedula: "E-34567890",
      nombres: "Ana Patricia",
      apellidos: "Silva Montenegro",
      fechaNacimiento: "1988-03-10",
      genero: "Femenino",
      estadoCivil: "Divorciada",
      telefono: "0212-3456789",
      email: "ana.silva@empresa.com",
      direccion: "Urbanización El Paraíso, Torre A, Piso 8, Apt 8C",
      ciudad: "Caracas",
      estado: "Distrito Capital",
      codigoPostal: "1020",
      numeroEmpleado: "EMP-003",
      fechaIngreso: "2024-11-01",
      departamentoId: 2,
      cargoId: 2,
      supervisorId: 1,
      salarioBase: "6800.00",
      tipoNomina: "Mensual",
      estadoEmpleado: "Activo",
      fechaEgreso: null,
      motivoEgreso: null,
      creadoPor: 1,
      actualizadoPor: 1,
    });
  }
}

export const almacenamiento = new AlmacenamientoMemoria();
