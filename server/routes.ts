import type { Express } from "express";
import { createServer, type Server } from "http";
import { almacenamiento } from "./storage";
import { 
  insertUsuarioSchema, 
  insertEmpleadoSchema, 
  insertDepartamentoSchema,
  insertCargoSchema,
  insertContratoSchema,
  insertPeriodoPruebaSchema,
  insertEvaluacionPruebaSchema,
  insertEgresoSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== RUTAS DE USUARIOS Y AUTENTICACIÓN =====
  
  // Obtener todos los usuarios
  app.get("/api/usuarios", async (req, res) => {
    try {
      const usuarios = await almacenamiento.listarUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  });

  // Obtener usuario por ID
  app.get("/api/usuarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const usuario = await almacenamiento.obtenerUsuario(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  });

  // Crear nuevo usuario
  app.post("/api/usuarios", async (req, res) => {
    try {
      const datosUsuario = insertUsuarioSchema.parse(req.body);
      const nuevoUsuario = await almacenamiento.crearUsuario(datosUsuario);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ error: "Datos de usuario inválidos" });
    }
  });

  // Obtener todos los roles
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await almacenamiento.listarRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener roles" });
    }
  });

  // ===== RUTAS DE EMPLEADOS =====
  
  // Obtener todos los empleados
  app.get("/api/empleados", async (req, res) => {
    try {
      const { departamento, estado, busqueda } = req.query;
      
      let empleados;
      if (busqueda) {
        empleados = await almacenamiento.buscarEmpleados(busqueda as string);
      } else if (departamento) {
        empleados = await almacenamiento.listarEmpleadosPorDepartamento(parseInt(departamento as string));
      } else if (estado) {
        empleados = await almacenamiento.listarEmpleadosPorEstado(estado as string);
      } else {
        empleados = await almacenamiento.listarEmpleados();
      }
      
      res.json(empleados);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener empleados" });
    }
  });

  // Obtener empleado por ID
  app.get("/api/empleados/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const empleado = await almacenamiento.obtenerEmpleado(id);
      if (!empleado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }
      res.json(empleado);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener empleado" });
    }
  });

  // Crear nuevo empleado
  app.post("/api/empleados", async (req, res) => {
    try {
      const datosEmpleado = insertEmpleadoSchema.parse(req.body);
      const nuevoEmpleado = await almacenamiento.crearEmpleado(datosEmpleado);
      res.status(201).json(nuevoEmpleado);
    } catch (error) {
      res.status(400).json({ error: "Datos de empleado inválidos" });
    }
  });

  // Actualizar empleado
  app.put("/api/empleados/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const datosActualizacion = req.body;
      const empleadoActualizado = await almacenamiento.actualizarEmpleado(id, datosActualizacion);
      if (!empleadoActualizado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }
      res.json(empleadoActualizado);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar empleado" });
    }
  });

  // ===== RUTAS DE DEPARTAMENTOS =====
  
  // Obtener todos los departamentos
  app.get("/api/departamentos", async (req, res) => {
    try {
      const departamentos = await almacenamiento.listarDepartamentos();
      res.json(departamentos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener departamentos" });
    }
  });

  // Crear nuevo departamento
  app.post("/api/departamentos", async (req, res) => {
    try {
      const datosDepartamento = insertDepartamentoSchema.parse(req.body);
      const nuevoDepartamento = await almacenamiento.crearDepartamento(datosDepartamento);
      res.status(201).json(nuevoDepartamento);
    } catch (error) {
      res.status(400).json({ error: "Datos de departamento inválidos" });
    }
  });

  // ===== RUTAS DE CARGOS =====
  
  // Obtener todos los cargos
  app.get("/api/cargos", async (req, res) => {
    try {
      const { departamento } = req.query;
      let cargos;
      
      if (departamento) {
        cargos = await almacenamiento.listarCargosPorDepartamento(parseInt(departamento as string));
      } else {
        cargos = await almacenamiento.listarCargos();
      }
      
      res.json(cargos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener cargos" });
    }
  });

  // Crear nuevo cargo
  app.post("/api/cargos", async (req, res) => {
    try {
      const datosCargo = insertCargoSchema.parse(req.body);
      const nuevoCargo = await almacenamiento.crearCargo(datosCargo);
      res.status(201).json(nuevoCargo);
    } catch (error) {
      res.status(400).json({ error: "Datos de cargo inválidos" });
    }
  });

  // ===== RUTAS DE CONTRATOS =====
  
  // Obtener todos los contratos
  app.get("/api/contratos", async (req, res) => {
    try {
      const { estado, empleado } = req.query;
      let contratos;
      
      if (empleado) {
        contratos = await almacenamiento.obtenerContratosPorEmpleado(parseInt(empleado as string));
      } else if (estado) {
        contratos = await almacenamiento.listarContratosPorEstado(estado as string);
      } else {
        contratos = await almacenamiento.listarContratos();
      }
      
      res.json(contratos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener contratos" });
    }
  });

  // Obtener contratos próximos a vencer
  app.get("/api/contratos/proximos-vencer/:dias", async (req, res) => {
    try {
      const dias = parseInt(req.params.dias);
      const contratos = await almacenamiento.listarContratosProximosVencer(dias);
      res.json(contratos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener contratos próximos a vencer" });
    }
  });

  // Crear nuevo contrato
  app.post("/api/contratos", async (req, res) => {
    try {
      const datosContrato = insertContratoSchema.parse(req.body);
      const nuevoContrato = await almacenamiento.crearContrato(datosContrato);
      res.status(201).json(nuevoContrato);
    } catch (error) {
      res.status(400).json({ error: "Datos de contrato inválidos" });
    }
  });

  // Actualizar contrato
  app.put("/api/contratos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const datosActualizacion = req.body;
      const contratoActualizado = await almacenamiento.actualizarContrato(id, datosActualizacion);
      if (!contratoActualizado) {
        return res.status(404).json({ error: "Contrato no encontrado" });
      }
      res.json(contratoActualizado);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar contrato" });
    }
  });

  // ===== RUTAS DE PERÍODOS DE PRUEBA =====
  
  // Obtener todos los períodos de prueba
  app.get("/api/periodos-prueba", async (req, res) => {
    try {
      const periodos = await almacenamiento.listarPeriodosPrueba();
      res.json(periodos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener períodos de prueba" });
    }
  });

  // Obtener períodos próximos a vencer
  app.get("/api/periodos-prueba/proximos-vencer/:dias", async (req, res) => {
    try {
      const dias = parseInt(req.params.dias);
      const periodos = await almacenamiento.listarPeriodosPruebaProximosVencer(dias);
      res.json(periodos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener períodos próximos a vencer" });
    }
  });

  // Crear nuevo período de prueba
  app.post("/api/periodos-prueba", async (req, res) => {
    try {
      const datosPeriodo = insertPeriodoPruebaSchema.parse(req.body);
      const nuevoPeriodo = await almacenamiento.crearPeriodoPrueba(datosPeriodo);
      res.status(201).json(nuevoPeriodo);
    } catch (error) {
      res.status(400).json({ error: "Datos de período de prueba inválidos" });
    }
  });

  // Crear evaluación de período de prueba
  app.post("/api/evaluaciones-prueba", async (req, res) => {
    try {
      const datosEvaluacion = insertEvaluacionPruebaSchema.parse(req.body);
      const nuevaEvaluacion = await almacenamiento.crearEvaluacionPrueba(datosEvaluacion);
      res.status(201).json(nuevaEvaluacion);
    } catch (error) {
      res.status(400).json({ error: "Datos de evaluación inválidos" });
    }
  });

  // Obtener evaluaciones por período
  app.get("/api/evaluaciones-prueba/periodo/:id", async (req, res) => {
    try {
      const periodoPruebaId = parseInt(req.params.id);
      const evaluaciones = await almacenamiento.listarEvaluacionesPorPeriodo(periodoPruebaId);
      res.json(evaluaciones);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener evaluaciones" });
    }
  });

  // ===== RUTAS DE EGRESOS =====
  
  // Obtener todos los egresos
  app.get("/api/egresos", async (req, res) => {
    try {
      const { estado } = req.query;
      let egresos;
      
      if (estado) {
        egresos = await almacenamiento.listarEgresosPorEstado(estado as string);
      } else {
        egresos = await almacenamiento.listarEgresos();
      }
      
      res.json(egresos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener egresos" });
    }
  });

  // Obtener egresos pendientes
  app.get("/api/egresos/pendientes", async (req, res) => {
    try {
      const egresos = await almacenamiento.listarEgresosPendientes();
      res.json(egresos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener egresos pendientes" });
    }
  });

  // Crear nuevo egreso
  app.post("/api/egresos", async (req, res) => {
    try {
      const datosEgreso = insertEgresoSchema.parse(req.body);
      const nuevoEgreso = await almacenamiento.crearEgreso(datosEgreso);
      res.status(201).json(nuevoEgreso);
    } catch (error) {
      res.status(400).json({ error: "Datos de egreso inválidos" });
    }
  });

  // Actualizar egreso
  app.put("/api/egresos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const datosActualizacion = req.body;
      const egresoActualizado = await almacenamiento.actualizarEgreso(id, datosActualizacion);
      if (!egresoActualizado) {
        return res.status(404).json({ error: "Egreso no encontrado" });
      }
      res.json(egresoActualizado);
    } catch (error) {
      res.status(400).json({ error: "Error al actualizar egreso" });
    }
  });

  // ===== RUTAS DE ESTADÍSTICAS Y DASHBOARD =====
  
  // Obtener estadísticas del dashboard
  app.get("/api/dashboard/estadisticas", async (req, res) => {
    try {
      const empleados = await almacenamiento.listarEmpleados();
      const empleadosNoEgresados = empleados.filter(e => e.estadoEmpleado !== "Egresado");
      const empleadosPeriodoPrueba = empleados.filter(e => e.estadoEmpleado === "Periodo Prueba");
      const empleadosVacaciones = empleados.filter(e => e.estadoEmpleado === "Vacaciones");
      
      // Calcular nuevos ingresos del último mes
      const fechaLimiteUltimoMes = new Date();
      fechaLimiteUltimoMes.setMonth(fechaLimiteUltimoMes.getMonth() - 1);
      const nuevosIngresosUltimoMes = empleados.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        return fechaIngreso >= fechaLimiteUltimoMes && e.estadoEmpleado !== "Egresado";
      }).length;

      // Calcular nuevos ingresos del último trimestre
      const fechaLimiteUltimoTrimestre = new Date();
      fechaLimiteUltimoTrimestre.setMonth(fechaLimiteUltimoTrimestre.getMonth() - 3);
      const nuevosIngresosUltimoTrimestre = empleados.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        return fechaIngreso >= fechaLimiteUltimoTrimestre && e.estadoEmpleado !== "Egresado";
      }).length;

      // Variación del último mes (simulada)
      const totalAnterior = empleadosNoEgresados.length - nuevosIngresosUltimoMes;
      const variacionPorcentaje = totalAnterior > 0 ? Math.round(((nuevosIngresosUltimoMes / totalAnterior) * 100)) : 0;
      
      const periodosPrueba = await almacenamiento.listarPeriodosPruebaProximosVencer(7);
      
      const estadisticas = {
        totalEmpleados: empleadosNoEgresados.length,
        empleadosPeriodoPrueba: empleadosPeriodoPrueba.length,
        empleadosVacaciones: empleadosVacaciones.length,
        nuevosIngresosUltimoMes,
        nuevosIngresosUltimoTrimestre,
        variacionPorcentaje,
        periodosProximosVencer: periodosPrueba.length
      };

      res.json(estadisticas);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  });

  // Obtener ingresos recientes por departamento
  app.get("/api/dashboard/ingresos-recientes", async (req, res) => {
    try {
      const { periodo = "30" } = req.query;
      const dias = parseInt(periodo as string);
      const ingresosRecientes = await almacenamiento.obtenerIngresosRecientes(dias);
      res.json(ingresosRecientes);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener ingresos recientes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
