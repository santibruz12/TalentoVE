import { pgTable, text, serial, integer, boolean, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== USUARIOS Y AUTENTICACIÓN =====
export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombreUsuario: text("nombre_usuario").notNull().unique(),
  contrasena: text("contrasena").notNull(),
  email: text("email").notNull().unique(),
  nombreCompleto: text("nombre_completo").notNull(),
  rolId: integer("rol_id").notNull(),
  activo: boolean("activo").default(true).notNull(),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
  ultimoAcceso: timestamp("ultimo_acceso", { withTimezone: true }),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion").notNull(),
  nivel: integer("nivel").notNull(), // 1-6 niveles jerárquicos
  permisos: text("permisos").array().notNull(), // Array de permisos
  activo: boolean("activo").default(true).notNull(),
});

// ===== EMPLEADOS =====
export const empleados = pgTable("empleados", {
  id: serial("id").primaryKey(),
  cedula: text("cedula").notNull().unique(),
  nombres: text("nombres").notNull(),
  apellidos: text("apellidos").notNull(),
  fechaNacimiento: date("fecha_nacimiento").notNull(),
  genero: text("genero").notNull(), // 'M', 'F', 'Otro'
  estadoCivil: text("estado_civil").notNull(),
  telefono: text("telefono").notNull(),
  email: text("email").notNull().unique(),
  direccion: text("direccion").notNull(),
  ciudad: text("ciudad").notNull(),
  estado: text("estado").notNull(),
  codigoPostal: text("codigo_postal"),
  
  // Información laboral
  numeroEmpleado: text("numero_empleado").notNull().unique(),
  fechaIngreso: date("fecha_ingreso").notNull(),
  departamentoId: integer("departamento_id").notNull(),
  cargoId: integer("cargo_id").notNull(),
  supervisorId: integer("supervisor_id"),
  salarioBase: decimal("salario_base", { precision: 12, scale: 2 }).notNull(),
  tipoNomina: text("tipo_nomina").notNull(), // 'Quincenal', 'Mensual'
  
  // Estado del empleado
  estadoEmpleado: text("estado_empleado").notNull().default("Activo"), // 'Activo', 'Inactivo', 'Periodo Prueba', 'Vacaciones', 'Licencia'
  fechaEgreso: date("fecha_egreso"),
  motivoEgreso: text("motivo_egreso"),
  
  // Campos de auditoría
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true }).defaultNow().notNull(),
  creadoPor: integer("creado_por").notNull(),
  actualizadoPor: integer("actualizado_por").notNull(),
});

export const departamentos = pgTable("departamentos", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
  gerenteId: integer("gerente_id"),
  centroCoste: text("centro_coste"),
  activo: boolean("activo").default(true).notNull(),
});

export const cargos = pgTable("cargos", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  departamentoId: integer("departamento_id").notNull(),
  nivelSalarial: integer("nivel_salarial").notNull(),
  salarioMinimo: decimal("salario_minimo", { precision: 12, scale: 2 }),
  salarioMaximo: decimal("salario_maximo", { precision: 12, scale: 2 }),
  competenciasRequeridas: text("competencias_requeridas").array(),
  activo: boolean("activo").default(true).notNull(),
});

// ===== CONTRATOS =====
export const contratos = pgTable("contratos", {
  id: serial("id").primaryKey(),
  empleadoId: integer("empleado_id").notNull(),
  numeroContrato: text("numero_contrato").notNull().unique(),
  tipoContrato: text("tipo_contrato").notNull(), // 'Indefinido', 'Determinado', 'Por Obra', 'Pasantía'
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin"),
  salario: decimal("salario", { precision: 12, scale: 2 }).notNull(),
  moneda: text("moneda").notNull().default("USD"),
  horarioTrabajo: text("horario_trabajo").notNull(),
  ubicacionTrabajo: text("ubicacion_trabajo").notNull(),
  clausulasEspeciales: text("clausulas_especiales").array(),
  
  // Estado del contrato
  estadoContrato: text("estado_contrato").notNull().default("Borrador"), // 'Borrador', 'Pendiente', 'Firmado', 'Activo', 'Terminado', 'Rescindido'
  fechaFirma: date("fecha_firma"),
  firmadoPorEmpleado: boolean("firmado_por_empleado").default(false),
  firmadoPorEmpresa: boolean("firmado_por_empresa").default(false),
  
  // Información adicional según legislación venezolana
  tiempoSocial: integer("tiempo_social").default(0), // años de servicio
  fideicomiso: decimal("fideicomiso", { precision: 12, scale: 2 }).default("0"),
  observaciones: text("observaciones"),
  
  // Marcador para identificar contratos generados automáticamente
  generadoAutomaticamente: boolean("generado_automaticamente").default(false),
  
  // Auditoría
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true }).defaultNow().notNull(),
  creadoPor: integer("creado_por").notNull(),
  actualizadoPor: integer("actualizado_por").notNull(),
});

export const movimientosLaborales = pgTable("movimientos_laborales", {
  id: serial("id").primaryKey(),
  empleadoId: integer("empleado_id").notNull(),
  tipoMovimiento: text("tipo_movimiento").notNull(), // 'Promoción', 'Transferencia', 'Cambio Salario', 'Cambio Departamento'
  departamentoAnterior: integer("departamento_anterior"),
  departamentoNuevo: integer("departamento_nuevo"),
  cargoAnterior: integer("cargo_anterior"),
  cargoNuevo: integer("cargo_nuevo"),
  salarioAnterior: decimal("salario_anterior", { precision: 12, scale: 2 }),
  salarioNuevo: decimal("salario_nuevo", { precision: 12, scale: 2 }),
  fechaEfectiva: date("fecha_efectiva").notNull(),
  motivo: text("motivo").notNull(),
  observaciones: text("observaciones"),
  aprobadoPor: integer("aprobado_por").notNull(),
  fechaAprobacion: timestamp("fecha_aprobacion", { withTimezone: true }),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
});

// ===== PERÍODOS DE PRUEBA =====
export const periodosPrueba = pgTable("periodos_prueba", {
  id: serial("id").primaryKey(),
  empleadoId: integer("empleado_id").notNull().unique(),
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin").notNull(),
  duracionDias: integer("duracion_dias").notNull().default(90), // 90 días según ley venezolana
  supervisorId: integer("supervisor_id").notNull(),
  estadoPeriodo: text("estado_periodo").notNull().default("Activo"), // 'Activo', 'Evaluado', 'Aprobado', 'No Aprobado'
  observaciones: text("observaciones"),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
});

export const evaluacionesPrueba = pgTable("evaluaciones_prueba", {
  id: serial("id").primaryKey(),
  periodoPruebaId: integer("periodo_prueba_id").notNull(),
  evaluadorId: integer("evaluador_id").notNull(),
  fechaEvaluacion: date("fecha_evaluacion").notNull(),
  tipoEvaluacion: text("tipo_evaluacion").notNull(), // 'Intermedia', 'Final'
  
  // Criterios de evaluación
  desempenoTecnico: integer("desempeno_tecnico").notNull(), // 1-5
  trabajoEquipo: integer("trabajo_equipo").notNull(), // 1-5
  puntualidad: integer("puntualidad").notNull(), // 1-5
  actitud: integer("actitud").notNull(), // 1-5
  adaptacion: integer("adaptacion").notNull(), // 1-5
  
  calificacionTotal: decimal("calificacion_total", { precision: 3, scale: 1 }).notNull(),
  resultado: text("resultado").notNull(), // 'Aprobado', 'No Aprobado', 'Requiere Seguimiento'
  comentarios: text("comentarios"),
  recomendaciones: text("recomendaciones"),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
});

// ===== EGRESOS =====
export const egresos = pgTable("egresos", {
  id: serial("id").primaryKey(),
  empleadoId: integer("empleado_id").notNull(),
  tipoEgreso: text("tipo_egreso").notNull(), // 'Renuncia Voluntaria', 'Despido Justificado', 'Despido Injustificado', 'Mutuo Acuerdo', 'Jubilación', 'Fallecimiento'
  fechaSolicitud: date("fecha_solicitud").notNull(),
  fechaUltimoDia: date("fecha_ultimo_dia").notNull(),
  motivoDetallado: text("motivo_detallado").notNull(),
  solicitadoPor: integer("solicitado_por").notNull(),
  aprobadoPor: integer("aprobado_por"),
  
  // Estado del proceso
  estadoProceso: text("estado_proceso").notNull().default("Pendiente"), // 'Pendiente', 'En Proceso', 'Aprobado', 'Completado', 'Rechazado'
  
  // Información del finiquito
  finiquitoCalculado: boolean("finiquito_calculado").default(false),
  montoFiniquito: decimal("monto_finiquito", { precision: 12, scale: 2 }),
  conceptosFiniquito: text("conceptos_finiquito").array(),
  finiquitoPagado: boolean("finiquito_pagado").default(false),
  fechaPagoFiniquito: date("fecha_pago_finiquito"),
  
  // Documentos y procesos
  entregaActivos: boolean("entrega_activos").default(false),
  entregaDocumentos: boolean("entrega_documentos").default(false),
  cartaRecomendacion: boolean("carta_recomendacion").default(false),
  exitInterview: boolean("exit_interview").default(false),
  
  observaciones: text("observaciones"),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
  fechaActualizacion: timestamp("fecha_actualizacion", { withTimezone: true }).defaultNow().notNull(),
});

export const reasignacionesSupervision = pgTable("reasignaciones_supervision", {
  id: serial("id").primaryKey(),
  egresoId: integer("egreso_id").notNull(),
  empleadoAfectadoId: integer("empleado_afectado_id").notNull(),
  supervisorAnteriorId: integer("supervisor_anterior_id").notNull(),
  supervisorNuevoId: integer("supervisor_nuevo_id").notNull(),
  fechaReasignacion: date("fecha_reasignacion").notNull(),
  motivoReasignacion: text("motivo_reasignacion").notNull(),
  aprobadoPor: integer("aprobado_por").notNull(),
  fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow().notNull(),
});

// ===== ESQUEMAS DE INSERCIÓN =====
export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  fechaCreacion: true,
  ultimoAcceso: true,
});

export const insertRolSchema = createInsertSchema(roles).omit({
  id: true,
});

export const insertEmpleadoSchema = createInsertSchema(empleados).omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});

export const insertDepartamentoSchema = createInsertSchema(departamentos).omit({
  id: true,
});

export const insertCargoSchema = createInsertSchema(cargos).omit({
  id: true,
});

export const insertContratoSchema = createInsertSchema(contratos).omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});

export const insertMovimientoLaboralSchema = createInsertSchema(movimientosLaborales).omit({
  id: true,
  fechaCreacion: true,
});

export const insertPeriodoPruebaSchema = createInsertSchema(periodosPrueba).omit({
  id: true,
  fechaCreacion: true,
});

export const insertEvaluacionPruebaSchema = createInsertSchema(evaluacionesPrueba).omit({
  id: true,
  fechaCreacion: true,
});

export const insertEgresoSchema = createInsertSchema(egresos).omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
});

export const insertReasignacionSupervisionSchema = createInsertSchema(reasignacionesSupervision).omit({
  id: true,
  fechaCreacion: true,
});

// ===== TIPOS DE DATOS =====
export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;

export type Rol = typeof roles.$inferSelect;
export type InsertRol = z.infer<typeof insertRolSchema>;

export type Empleado = typeof empleados.$inferSelect;
export type InsertEmpleado = z.infer<typeof insertEmpleadoSchema>;

export type Departamento = typeof departamentos.$inferSelect;
export type InsertDepartamento = z.infer<typeof insertDepartamentoSchema>;

export type Cargo = typeof cargos.$inferSelect;
export type InsertCargo = z.infer<typeof insertCargoSchema>;

export type Contrato = typeof contratos.$inferSelect;
export type InsertContrato = z.infer<typeof insertContratoSchema>;

export type MovimientoLaboral = typeof movimientosLaborales.$inferSelect;
export type InsertMovimientoLaboral = z.infer<typeof insertMovimientoLaboralSchema>;

export type PeriodoPrueba = typeof periodosPrueba.$inferSelect;
export type InsertPeriodoPrueba = z.infer<typeof insertPeriodoPruebaSchema>;

export type EvaluacionPrueba = typeof evaluacionesPrueba.$inferSelect;
export type InsertEvaluacionPrueba = z.infer<typeof insertEvaluacionPruebaSchema>;

export type Egreso = typeof egresos.$inferSelect;
export type InsertEgreso = z.infer<typeof insertEgresoSchema>;

export type ReasignacionSupervision = typeof reasignacionesSupervision.$inferSelect;
export type InsertReasignacionSupervision = z.infer<typeof insertReasignacionSupervisionSchema>;

// ===== TIPOS DE ENUMERACIÓN =====
export const TiposContrato = ["Indefinido", "Determinado", "Por Obra", "Pasantía"] as const;
export const EstadosEmpleado = ["Activo", "Inactivo", "Periodo Prueba", "Vacaciones", "Licencia"] as const;
export const EstadosContrato = ["Borrador", "Pendiente", "Firmado", "Activo", "Terminado", "Rescindido"] as const;
export const TiposMovimiento = ["Promoción", "Transferencia", "Cambio Salario", "Cambio Departamento"] as const;
export const TiposEgreso = ["Renuncia Voluntaria", "Despido Justificado", "Despido Injustificado", "Mutuo Acuerdo", "Jubilación", "Fallecimiento"] as const;
export const EstadosProceso = ["Pendiente", "En Proceso", "Aprobado", "Completado", "Rechazado"] as const;
