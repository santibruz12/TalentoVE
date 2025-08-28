// Utilidad para realizar llamadas a la API del backend
// Configuración centralizada para todas las operaciones CRUD del sistema RRHH

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
  obtenerTodos: (filtros?: {
    estado?: string;
    empleado?: number;
  }): Promise<Contrato[]> => {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append("estado", filtros.estado);
    if (filtros?.empleado) params.append("empleado", filtros.empleado.toString());
    
    const query = params.toString();
    return hacerPeticion(`/contratos${query ? `?${query}` : ""}`);
  },
  
  obtenerProximosVencer: (dias: number): Promise<Contrato[]> => 
    hacerPeticion(`/contratos/proximos-vencer/${dias}`),
  
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
    empleadosActivos: number;
    empleadosPeriodoPrueba: number;
    contratosActivos: number;
    periodosProximosVencer: number;
    egresosPendientes: number;
    totalEmpleados: number;
  }> => hacerPeticion("/dashboard/estadisticas"),
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
  periodosPrueba: apiPeriodosPrueba,
  evaluaciones: apiEvaluaciones,
  egresos: apiEgresos,
  dashboard: apiDashboard,
};

export default sistemaRRHH;