// Utilidad para realizar llamadas a la API del backend
// Configuración centralizada para todas las operaciones RRHH del sistema

import { useState } from "react";
import { 
  type Usuario, 
  type Empleado, 
  type Departamento, 
  type Cargo, 
  type Contrato,
  type PeriodoPrueba,
  type EvaluacionPrueba,
  type Egreso,
  type InsertUsuario,
  type InsertEmpleado,
  type InsertDepartamento,
  type InsertCargo,
  type InsertContrato,
  type InsertPeriodoPrueba,
  type InsertEvaluacionPrueba,
  type InsertEgreso
} from "@shared/schema";

const BASE_URL = "/api";

// ===== TIPOS DE DATOS =====
interface Contrato {
  id: number;
  empleadoId: number;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin?: string;
  salarioBase: string;
  estadoContrato: string;
  detalles?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  empleado?: {
    nombres: string;
    apellidos: string;
    cedula: string;
    numeroEmpleado: string;
  };
  departamento?: string;
  cargo?: string;
  motivoCambioCargo?: string; // Nuevo campo para el motivo del cambio de cargo
}

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaIngreso: string;
  fechaSalida?: string | null;
  estado: string;
  departamentoId: number;
  cargoId: number;
  salario: string;
  contactoEmergencia: string;
  telefono: string;
  direccion: string;
  correoElectronico: string;
  fechaNacimiento: string;
  numeroCuentaBancaria: string;
  bancoId: number;
  tipoCuentaBancaria: string;
  epsId: number;
  afpId: number;
  cajaCompensacionId: number;
  salud: string;
  fondoPensiones: string;
  riesgoLaboral: string;
  tipoContrato: string;
  fechaFinContrato?: string | null;
  detalles?: string | null;
  departamento?: {
    id: number;
    nombre: string;
  };
  cargo?: {
    id: number;
    nombre: string;
    departamentoId: number;
  };
  contratos?: Contrato[];
}

interface Departamento {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface Cargo {
  id: number;
  nombre: string;
  departamentoId: number;
  departamento?: Departamento;
}

interface PeriodoPrueba {
  id: number;
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  empleado?: Empleado;
}

interface EvaluacionPrueba {
  id: number;
  periodoPruebaId: number;
  evaluadorId: number;
  fechaEvaluacion: string;
  calificacion: number;
  comentarios: string;
  evaluador?: Empleado;
  periodoPrueba?: PeriodoPrueba;
}

interface Egreso {
  id: number;
  empleadoId: number;
  fechaEgreso: string;
  motivo: string;
  estado: string;
  detalles?: string;
  empleado?: Empleado;
}


// Función genérica para hacer peticiones HTTP
async function hacerPeticion<T>(
  url: string, 
  opciones?: RequestInit
): Promise<T> {
  const respuesta = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...opciones?.headers,
    },
    ...opciones,
  });

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || `Error HTTP: ${respuesta.status}`);
  }

  return respuesta.json();
}

// ===== API DE USUARIOS =====
export const apiUsuarios = {
  obtenerTodos: (): Promise<Usuario[]> => 
    hacerPeticion("/usuarios"),

  obtenerPorId: (id: number): Promise<Usuario> => 
    hacerPeticion(`/usuarios/${id}`),

  crear: (datos: InsertUsuario): Promise<Usuario> => 
    hacerPeticion("/usuarios", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  actualizar: (id: number, datos: Partial<InsertUsuario>): Promise<Usuario> => 
    hacerPeticion(`/usuarios/${id}`, {
      method: "PUT", 
      body: JSON.stringify(datos),
    }),
};

// ===== API DE EMPLEADOS =====
export const apiEmpleados = {
  obtenerTodos: (filtros?: {
    departamento?: number;
    estado?: string;
    busqueda?: string;
  }): Promise<Empleado[]> => {
    const params = new URLSearchParams();
    if (filtros?.departamento) params.append("departamento", filtros.departamento.toString());
    if (filtros?.estado) params.append("estado", filtros.estado);
    if (filtros?.busqueda) params.append("busqueda", filtros.busqueda);

    const query = params.toString();
    return hacerPeticion(`/empleados${query ? `?${query}` : ""}`);
  },

  obtenerPorId: (id: number): Promise<Empleado> => 
    hacerPeticion(`/empleados/${id}`),

  crear: (datos: InsertEmpleado): Promise<Empleado> => 
    hacerPeticion("/empleados", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  actualizar: (id: number, datos: Partial<InsertEmpleado>): Promise<Empleado> => 
    hacerPeticion(`/empleados/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    }),
};

// ===== API DE DEPARTAMENTOS =====
export const apiDepartamentos = {
  obtenerTodos: (): Promise<Departamento[]> => 
    hacerPeticion("/departamentos"),

  crear: (datos: InsertDepartamento): Promise<Departamento> => 
    hacerPeticion("/departamentos", {
      method: "POST",
      body: JSON.stringify(datos),
    }),
};

// ===== API DE CARGOS =====
export const apiCargos = {
  obtenerTodos: (departamentoId?: number): Promise<Cargo[]> => {
    const query = departamentoId ? `?departamento=${departamentoId}` : "";
    return hacerPeticion(`/cargos${query}`);
  },

  crear: (datos: InsertCargo): Promise<Cargo> => 
    hacerPeticion("/cargos", {
      method: "POST",
      body: JSON.stringify(datos),
    }),
};

// ===== API DE CONTRATOS =====
export const apiContratos = {
  obtenerTodos: (filtros?: { busqueda?: string; estado?: string }): Promise<Contrato[]> => {
    const params = new URLSearchParams()
    if (filtros?.busqueda) params.append('busqueda', filtros.busqueda)
    if (filtros?.estado) params.append('estado', filtros.estado)
    const query = params.toString() ? `?${params}` : ''
    return hacerPeticion(`/contratos${query}`)
  },

  obtenerPorId: (id: number): Promise<Contrato> => 
    hacerPeticion(`/contratos/${id}`),

  obtenerPorEmpleado: (empleadoId: number): Promise<Contrato[]> => 
    hacerPeticion(`/contratos/empleado/${empleadoId}`),

  obtenerHistorial: (): Promise<Contrato[]> => 
    hacerPeticion('/contratos/historial'),

  crear: (datos: InsertContrato): Promise<Contrato> => 
    hacerPeticion("/contratos", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  actualizar: (id: number, datos: Partial<InsertContrato>): Promise<Contrato> => 
    hacerPeticion(`/contratos/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    }),

  eliminar: (id: number): Promise<void> => 
    hacerPeticion(`/contratos/${id}`, {
      method: 'DELETE',
    }),

  proximosVencer: (dias: number = 30): Promise<Contrato[]> => 
    hacerPeticion(`/contratos/proximos-vencer?dias=${dias}`),
};

// ===== API DE PERÍODOS DE PRUEBA =====
export const apiPeriodosPrueba = {
  obtenerTodos: (): Promise<PeriodoPrueba[]> => 
    hacerPeticion("/periodos-prueba"),

  obtenerProximosVencer: (dias: number): Promise<PeriodoPrueba[]> => 
    hacerPeticion(`/periodos-prueba/proximos-vencer/${dias}`),

  crear: (datos: InsertPeriodoPrueba): Promise<PeriodoPrueba> => 
    hacerPeticion("/periodos-prueba", {
      method: "POST",
      body: JSON.stringify(datos),
    }),
};

// ===== API DE EVALUACIONES =====
export const apiEvaluaciones = {
  crear: (datos: InsertEvaluacionPrueba): Promise<EvaluacionPrueba> => 
    hacerPeticion("/evaluaciones-prueba", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  obtenerPorPeriodo: (periodoPruebaId: number): Promise<EvaluacionPrueba[]> => 
    hacerPeticion(`/evaluaciones-prueba/periodo/${periodoPruebaId}`),
};

// ===== API DE EGRESOS =====
export const apiEgresos = {
  obtenerTodos: (estado?: string): Promise<Egreso[]> => {
    const query = estado ? `?estado=${estado}` : "";
    return hacerPeticion(`/egresos${query}`);
  },

  obtenerPendientes: (): Promise<Egreso[]> => 
    hacerPeticion("/egresos/pendientes"),

  crear: (datos: InsertEgreso): Promise<Egreso> => 
    hacerPeticion("/egresos", {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  actualizar: (id: number, datos: Partial<InsertEgreso>): Promise<Egreso> => 
    hacerPeticion(`/egresos/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    }),
};

// ===== API DE DASHBOARD =====
export const apiDashboard = {
  obtenerEstadisticas: (): Promise<{
    totalEmpleados: number;
    empleadosPeriodoPrueba: number;
    empleadosVacaciones: number;
    nuevosIngresosUltimoMes: number;
    nuevosIngresosUltimoTrimestre: number;
    variacionPorcentaje: number;
    periodosProximosVencer: number;
    contratosActivos: number;
    contratosProximosVencer: number;
    contratosVencidos: number;
  }> => hacerPeticion("/dashboard/estadisticas"),

  obtenerIngresosRecientes: (periodo: number = 30): Promise<Array<{
    departamento: string;
    cantidad: number;
  }>> => hacerPeticion(`/dashboard/ingresos-recientes?periodo=${periodo}`),

  obtenerPeriodosPruebaProximos: (dias: number = 7): Promise<Array<{
    id: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    fechaIngreso: string;
    fechaFinPeriodo: string;
    diasRestantes: number;
    departamento: string;
    cargo: string;
  }>> => hacerPeticion(`/dashboard/periodos-prueba-proximos?dias=${dias}`),
};

// ===== UTILIDADES ADICIONALES =====
export class ErrorAPI extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ErrorAPI";
  }
}

// Hook personalizado para manejo de estados de carga
export const crearEstadoCarga = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = async <T>(promesa: Promise<T>): Promise<T | null> => {
    setCargando(true);
    setError(null);

    try {
      const resultado = await promesa;
      return resultado;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      setError(mensaje);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, ejecutar };
};

// Exportar todo el API como objeto para fácil importación
export const sistemaRRHH = {
  usuarios: apiUsuarios,
  empleados: apiEmpleados,
  departamentos: apiDepartamentos,
  cargos: apiCargos,
  contratos: apiContratos,
  dashboard: apiDashboard,
};

export default sistemaRRHH;