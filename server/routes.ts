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
      console.error("Error al crear empleado:", error);
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

      // Sincronizar con contrato activo si hay cambios relevantes
      if (datosActualizacion.cargoId || datosActualizacion.salarioBase || datosActualizacion.fechaIngreso) {
        const contratosEmpleado = await almacenamiento.obtenerContratosPorEmpleado(id);
        const contratoActivo = contratosEmpleado.find(c => c.estadoContrato === "Activo");

        if (contratoActivo) {
          const actualizacionContrato: any = {};
          
          if (datosActualizacion.salarioBase && contratoActivo.salario !== datosActualizacion.salarioBase) {
            actualizacionContrato.salario = datosActualizacion.salarioBase;
          }

          if (datosActualizacion.fechaIngreso && contratoActivo.fechaInicio !== datosActualizacion.fechaIngreso) {
            actualizacionContrato.fechaInicio = datosActualizacion.fechaIngreso;
          }

          if (Object.keys(actualizacionContrato).length > 0) {
            actualizacionContrato.actualizadoPor = datosActualizacion.actualizadoPor || 1;
            actualizacionContrato.observaciones = (contratoActivo.observaciones || '') + 
              ' - Actualizado desde módulo de empleados';
            
            await almacenamiento.actualizarContrato(contratoActivo.id, actualizacionContrato);
          }
        }
      }

      res.json(empleadoActualizado);
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      res.status(400).json({ error: "Error al actualizar empleado" });
    }
  });

  // ===== RUTAS DE DEPARTAMENTOS =====
  app.get("/api/departamentos", async (req, res) => {
    try {
      const departamentos = await almacenamiento.listarDepartamentos()
      res.json(departamentos)
    } catch (error) {
      console.error("Error obteniendo departamentos:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  })

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
  app.get("/api/contratos", async (req, res) => {
    try {
      const contratos = await almacenamiento.listarContratos()
      const empleados = await almacenamiento.listarEmpleados()
      const departamentos = await almacenamiento.listarDepartamentos()
      const cargos = await almacenamiento.listarCargos()

      const contratosConDetalles = contratos.map(contrato => {
        const empleado = empleados.find(e => e.id === contrato.empleadoId)
        const departamento = departamentos.find(d => d.id === empleado?.departamentoId)
        const cargo = cargos.find(c => c.id === empleado?.cargoId)

        return {
          ...contrato,
          empleado: empleado ? {
            nombres: empleado.nombres,
            apellidos: empleado.apellidos,
            cedula: empleado.cedula,
            numeroEmpleado: empleado.numeroEmpleado
          } : null,
          departamento: departamento?.nombre || 'Sin departamento',
          cargo: cargo?.titulo || 'Sin cargo'
        }
      })

      res.json(contratosConDetalles)
    } catch (error) {
      console.error("Error obteniendo contratos:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  })

  app.get("/api/contratos/empleado/:empleadoId", async (req, res) => {
    try {
      const empleadoId = parseInt(req.params.empleadoId)
      const contratos = await almacenamiento.obtenerContratosPorEmpleado(empleadoId)
      res.json(contratos)
    } catch (error) {
      console.error("Error obteniendo contratos del empleado:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  })

  // Obtener historial de contratos agrupado por empleado
  app.get("/api/contratos/historial", async (req, res) => {
    try {
      const contratos = await almacenamiento.listarContratos()
      const empleados = await almacenamiento.listarEmpleados()
      const departamentos = await almacenamiento.listarDepartamentos()
      const cargos = await almacenamiento.listarCargos()

      // Agrupar contratos por empleado
      const historialPorEmpleado = new Map()

      contratos.forEach(contrato => {
        const empleado = empleados.find(e => e.id === contrato.empleadoId)
        if (!empleado) return

        const departamento = departamentos.find(d => d.id === empleado.departamentoId)
        const cargo = cargos.find(c => c.id === empleado.cargoId)

        if (!historialPorEmpleado.has(contrato.empleadoId)) {
          historialPorEmpleado.set(contrato.empleadoId, {
            empleado: {
              id: empleado.id,
              nombres: empleado.nombres,
              apellidos: empleado.apellidos,
              cedula: empleado.cedula,
              numeroEmpleado: empleado.numeroEmpleado
            },
            departamento: departamento?.nombre || 'Sin departamento',
            cargo: cargo?.titulo || 'Sin cargo',
            contratos: []
          })
        }

        historialPorEmpleado.get(contrato.empleadoId).contratos.push(contrato)
      })

      // Ordenar contratos por fecha de inicio (más reciente primero)
      const resultado = Array.from(historialPorEmpleado.values()).map(item => ({
        ...item,
        contratos: item.contratos.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
      }))

      res.json(resultado)
    } catch (error) {
      console.error("Error obteniendo historial de contratos:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  })

  app.post("/api/contratos", async (req, res) => {
    try {
      const datosContrato = req.body;

      // Si no es el contrato inicial, finalizar el contrato activo anterior
      if (datosContrato.tipoContrato !== "Indefinido" || datosContrato.observaciones !== "Contrato inicial generado automáticamente") {
        const contratosExistentes = await almacenamiento.obtenerContratosPorEmpleado(datosContrato.empleadoId);
        const contratoActivo = contratosExistentes.find(c => c.estadoContrato === "Activo");

        if (contratoActivo) {
          // Calcular fecha de fin del contrato anterior (día anterior al nuevo)
          const fechaInicioNuevo = new Date(datosContrato.fechaInicio);
          const fechaFinAnterior = new Date(fechaInicioNuevo);
          fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);

          await almacenamiento.actualizarContrato(contratoActivo.id, {
            fechaFin: fechaFinAnterior.toISOString().split('T')[0],
            estadoContrato: "Terminado",
            observaciones: (contratoActivo.observaciones || '') + ' - Finalizado por nuevo contrato'
          });
        }
      }

      // Sincronizar información del empleado con el nuevo contrato
      const empleado = await almacenamiento.obtenerEmpleado(datosContrato.empleadoId);
      if (empleado) {
        const actualizacionEmpleado: any = {};
        let requiereActualizacion = false;

        // Sincronizar cargo si es diferente
        if (datosContrato.cargoId && empleado.cargoId !== datosContrato.cargoId) {
          actualizacionEmpleado.cargoId = datosContrato.cargoId;
          requiereActualizacion = true;
        }

        // Sincronizar salario si es diferente
        if (datosContrato.salario && empleado.salarioBase !== datosContrato.salario) {
          actualizacionEmpleado.salarioBase = datosContrato.salario;
          requiereActualizacion = true;
        }

        // Sincronizar fecha de ingreso si es el contrato inicial
        if (datosContrato.fechaInicio && empleado.fechaIngreso !== datosContrato.fechaInicio && 
            (datosContrato.motivoContrato === 'Nuevo Ingreso' || 
             datosContrato.observaciones?.includes('Contrato inicial'))) {
          actualizacionEmpleado.fechaIngreso = datosContrato.fechaInicio;
          requiereActualizacion = true;
        }

        if (requiereActualizacion) {
          actualizacionEmpleado.actualizadoPor = datosContrato.creadoPor || 1;
          actualizacionEmpleado.fechaActualizacion = new Date().toISOString();
          await almacenamiento.actualizarEmpleado(empleado.id, actualizacionEmpleado);
        }
      }

      const nuevoContrato = await almacenamiento.crearContrato(datosContrato);
      res.json(nuevoContrato);
    } catch (error) {
      console.error("Error creando contrato:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  app.put("/api/contratos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const datosActualizacion = req.body;
      
      const contratoActualizado = await almacenamiento.actualizarContrato(id, datosActualizacion)
      if (!contratoActualizado) {
        return res.status(404).json({ error: "Contrato no encontrado" })
      }

      // Sincronizar con empleado si es el contrato activo y hay cambios relevantes
      if (contratoActualizado.estadoContrato === "Activo" && 
          (datosActualizacion.salario || datosActualizacion.fechaInicio || datosActualizacion.cargoId)) {
        
        const empleado = await almacenamiento.obtenerEmpleado(contratoActualizado.empleadoId);
        if (empleado) {
          const actualizacionEmpleado: any = {};
          
          if (datosActualizacion.salario && empleado.salarioBase !== datosActualizacion.salario) {
            actualizacionEmpleado.salarioBase = datosActualizacion.salario;
          }

          if (datosActualizacion.fechaInicio && empleado.fechaIngreso !== datosActualizacion.fechaInicio) {
            actualizacionEmpleado.fechaIngreso = datosActualizacion.fechaInicio;
          }

          if (datosActualizacion.cargoId && empleado.cargoId !== datosActualizacion.cargoId) {
            actualizacionEmpleado.cargoId = datosActualizacion.cargoId;
          }

          if (Object.keys(actualizacionEmpleado).length > 0) {
            actualizacionEmpleado.actualizadoPor = datosActualizacion.actualizadoPor || 1;
            actualizacionEmpleado.fechaActualizacion = new Date().toISOString();
            
            await almacenamiento.actualizarEmpleado(empleado.id, actualizacionEmpleado);
          }
        }
      }

      res.json(contratoActualizado)
    } catch (error) {
      console.error("Error actualizando contrato:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  })

  app.delete("/api/contratos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      const contrato = await almacenamiento.obtenerContrato(id)
      if (!contrato) {
        return res.status(404).json({ error: "Contrato no encontrado" })
      }

      // Verificar si se puede eliminar el contrato
      if (contrato.estadoContrato === "Activo") {
        return res.status(400).json({ error: "No se puede eliminar un contrato activo" })
      }

      await almacenamiento.eliminarContrato(id)
      res.status(204).send()
    } catch (error) {
      console.error("Error eliminando contrato:", error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  })

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
      const contratos = await almacenamiento.listarContratos();
      const fechaActual = new Date();
      const fechaLimiteUltimoMes = new Date(fechaActual.getTime() - (30 * 24 * 60 * 60 * 1000));
      const fechaLimiteUltimoTrimestre = new Date(fechaActual.getTime() - (90 * 24 * 60 * 60 * 1000));

      // Empleados activos (no incluye "Inactivo")
      const empleadosActivos = empleados.filter(e => e.estadoEmpleado !== "Inactivo");
      const empleadosPeriodoPrueba = empleadosActivos.filter(e => e.estadoEmpleado === "PeriodoPrueba");
      const empleadosVacaciones = empleadosActivos.filter(e => e.estadoEmpleado === "Vacaciones");

      // Calcular períodos de prueba próximos a vencer (empleados que están en período de prueba y les quedan 7 días o menos)
      const periodosProximosVencer = empleadosPeriodoPrueba.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        const fechaFinPeriodo = new Date(fechaIngreso.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días después del ingreso
        const diasRestantes = Math.ceil((fechaFinPeriodo.getTime() - fechaActual.getTime()) / (24 * 60 * 60 * 1000));
        return diasRestantes <= 7 && diasRestantes >= 0;
      }).length;

      // Calcular nuevos ingresos del último mes (solo empleados activos)
      const nuevosIngresosUltimoMes = empleadosActivos.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        return fechaIngreso >= fechaLimiteUltimoMes;
      });

      // Calcular nuevos ingresos del último trimestre (solo empleados activos)
      const nuevosIngresosUltimoTrimestre = empleadosActivos.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        return fechaIngreso >= fechaLimiteUltimoTrimestre;
      });

      // Variación del último mes
      const empleadosActivosUltimoMes = empleados.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        return fechaIngreso >= fechaLimiteUltimoMes && e.estadoEmpleado !== "Inactivo";
      }).length;

      // Estadísticas de contratos
      const contratosActivos = contratos.filter(c => c.estadoContrato === "Activo");
      const contratosPorVencer = contratos.filter(c => {
        if (!c.fechaFin || c.estadoContrato !== "Activo") return false;
        const fechaFin = new Date(c.fechaFin);
        const diasRestantes = Math.ceil((fechaFin.getTime() - fechaActual.getTime()) / (24 * 60 * 60 * 1000));
        return diasRestantes <= 30 && diasRestantes >= 0;
      }).length;

      const contratosVencidos = contratos.filter(c => {
        if (!c.fechaFin || c.estadoContrato !== "Activo") return false;
        const fechaFin = new Date(c.fechaFin);
        return fechaFin < fechaActual;
      }).length;

      res.json({
        totalEmpleados: empleadosActivos.length,
        empleadosActivos: empleadosActivos.length,
        empleadosPeriodoPrueba: empleadosPeriodoPrueba.length,
        empleadosVacaciones: empleadosVacaciones.length,
        nuevosIngresosUltimoMes: nuevosIngresosUltimoMes.length,
        nuevosIngresosUltimoTrimestre: nuevosIngresosUltimoTrimestre.length,
        variacionPorcentaje: 5, // Esto se puede calcular con datos históricos
        periodosProximosVencer,
        contratosActivos: contratosActivos.length,
        contratosProximosVencer: contratosPorVencer,
        contratosVencidos,
        totalContratos: contratos.length
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  });

  // Obtener empleados en período de prueba próximos a vencer
  app.get("/api/dashboard/periodos-prueba-proximos", async (req, res) => {
    try {
      const { dias = "7" } = req.query;
      const diasLimite = parseInt(dias as string);
      const empleados = await almacenamiento.listarEmpleados();
      const departamentos = await almacenamiento.listarDepartamentos();
      const cargos = await almacenamiento.listarCargos();
      const hoy = new Date();

      // Filtrar empleados en período de prueba próximos a vencer
      const empleadosPeriodoPrueba = empleados.filter(e => e.estadoEmpleado === "PeriodoPrueba");

      const periodosProximos = empleadosPeriodoPrueba.map(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        const fechaFinPeriodo = new Date(fechaIngreso.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días después del ingreso
        const diasRestantes = Math.ceil((fechaFinPeriodo.getTime() - hoy.getTime()) / (24 * 60 * 60 * 1000));

        const departamento = departamentos.find(d => d.id === e.departamentoId);
        const cargo = cargos.find(c => c.id === e.cargoId);

        return {
          id: e.id,
          nombres: e.nombres,
          apellidos: e.apellidos,
          cedula: e.cedula,
          fechaIngreso: e.fechaIngreso,
          fechaFinPeriodo: fechaFinPeriodo.toISOString().split('T')[0],
          diasRestantes,
          departamento: departamento?.nombre || 'Sin departamento',
          cargo: cargo?.titulo || 'Sin cargo'
        };
      }).filter(e => e.diasRestantes <= diasLimite && e.diasRestantes >= 0)
      .sort((a, b) => a.diasRestantes - b.diasRestantes);

      res.json(periodosProximos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener períodos próximos a vencer" });
    }
  });

  // Obtener ingresos recientes por departamento
  app.get("/api/dashboard/ingresos-recientes", async (req, res) => {
    try {
      const { periodo = "30" } = req.query;
      const dias = parseInt(periodo as string);

      const empleados = await almacenamiento.listarEmpleados();
      const departamentos = await almacenamiento.listarDepartamentos();

      // Calcular fecha límite
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      // Filtrar empleados recientes activos
      const empleadosRecientes = empleados.filter(e => {
        const fechaIngreso = new Date(e.fechaIngreso);
        return fechaIngreso >= fechaLimite && e.estadoEmpleado !== "Inactivo";
      });

      // Agrupar por departamento
      const ingresosPorDepartamento = departamentos.map(dept => {
        const empleadosDelDept = empleadosRecientes.filter(e => e.departamentoId === dept.id);
        return {
          departamento: dept.nombre,
          cantidad: empleadosDelDept.length,
          empleados: empleadosDelDept.map(e => ({
            nombre: `${e.nombres} ${e.apellidos}`,
            fechaIngreso: e.fechaIngreso
          }))
        };
      }).filter(item => item.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad);

      res.json(ingresosPorDepartamento);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener ingresos recientes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}