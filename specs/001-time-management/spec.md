<!-- SDD Artifact | Version: 1.0 | Phase: Specify | Updated: 2026-08-13 -->
<!-- Project: Time Management | Feature: 001-time-management -->

# Feature Specification: Time Management — Presence & Absence

## Overview
**Feature Name:** Time Management — Presence & Absence
**Feature Number:** 001
**Date:** 2026-08-13
**Status:** Draft

### Problem Statement
Los colaboradores (empleados directos y outsourcing) necesitan saber cuándo un compañero NO está laborando sin tener que contactarlo directamente. Actualmente la confirmación de disponibilidad requiere mensajes manuales o consultas a terceros.

### Proposed Solution
Proveer una herramienta donde cada colaborador pueda indicar su estado de ausencia (día completo, rango de tiempo, o franja horaria dentro del día). La información será visible en modo lectura por el resto del equipo para facilitar coordinación diaria.

### Target Users
- Colaborador (empleado directo)
- Colaborador outsourcing
- Manager (quien supervisa un equipo)
- Recursos Humanos (consulta y auditoría)

## User Stories
As a collaborator, I want to report my absence for a full day or a time range, So that colleagues can see I am not working without contacting me directly.

Priority: Must Have

**Acceptance Criteria (for the story above):**
- Given a user authenticated in the system, When they add an absence entry specifying date or time range, Then the entry is visible to others as read-only.
- Given an existing absence entry, When the owner edits it, Then the updated entry replaces the previous one and shows last-modified metadata.

## Functional Requirements
- FR-001: Permitir a cada colaborador crear una entrada de ausencia que incluya: fecha de inicio, fecha de fin (opcional), y/o una franja horaria dentro de un día.
- FR-002: Mostrar las entradas de ausencia en una vista de calendario y en listados por equipo con estado de solo lectura para observadores.
- FR-003: Registrar metadata por entrada: creador, timestamp de creación, timestamp de última modificación.
- FR-004: Permitir que una ausencia sea marcada como recurrente (opcional) o de un solo evento.
- FR-005: Soportar la superposición y visualización clara cuando múltiples miembros del equipo están ausentes.
- FR-006: Exportar o filtrar por rango de fechas para generar listados de ausencias (solo lectura).
- FR-007: Política de permisos: cada colaborador puede crear/editar sus propias entradas; los managers pueden crear o editar entradas para miembros de su equipo.
- FR-008: Política de retención: los registros de ausencia se conservarán durante 1 año desde la fecha de finalización; después se archivarán o eliminarán según la política de retención del sistema.

## Entity Overview
- Collaborator: Representa a la persona que puede crear una ausencia. Contiene identidad, equipo y rol organizacional.
- AbsenceRecord: Unidad que describe una ausencia (fecha inicio, fecha fin, hora inicio, hora fin, motivo opcional, metadata de auditoría).
- CalendarView / TeamView: Agrupa AbsenceRecords por equipo y rango de fechas para visualización.

## Success Criteria
- SC-001: 80% de los colaboradores pueden consultar el estado de presencia de cualquier miembro del equipo sin enviar mensajes directos (medido por encuesta interna tras 1 mes).
- SC-002: 90% de las consultas de presencia muestran resultado en <1s en condiciones normales de carga.
- SC-003: Reducción del 50% en mensajes directos preguntando "¿estás disponible?" dentro de los equipos piloto tras 2 meses de uso.

## Assumptions & Dependencies
### Assumptions
- Los usuarios están identificados mediante el sistema de identidad de la organización.
- Los colaboradores usarán la interfaz para reportar su propio estado (autorreporte) al menos inicialmente.
### Dependencies
- Dependencia en un servicio de identidad/SSO para autenticar usuarios.
- Dependencia en la existencia de una estructura organizacional (equipos) para la vista por equipo.

## Scope Boundaries
### In Scope
- Registro de ausencias por día y por franja horaria.
- Visualización en calendario y listados por equipo.
- Metadata de auditoría básica (creador, timestamps).
### Out of Scope
- Integración automática con sistemas de nómina o tiempos; no se pretende sustituir registros oficiales de ausencia.
- Cálculo de impacto salarial o métricas de performance por ausencia.
- Reglas complejas de permisos por rol hasta que se defina la política (ver aclaraciones).

## Clarifications Log
| # | Question | Answer | Date | Impact |
|---|----------|--------|------|--------|
| 1 | ¿Política de permisos: managers/HR pueden editar registros de otros? | Managers pueden crear/editar entradas de su equipo; cada colaborador gestiona sus propias entradas. | 2026-08-13 | Afecta FR-007 |
| 2 | ¿Retención de registros (meses/años)? | Los registros se conservan por 1 año desde la fecha de finalización; tras eso se archivarán/eliminarán según política. | 2026-08-13 | Afecta FR-008 |
| 3 | ¿Cómo tratar la recurrencia de ausencias? | Soportar ambas: entradas programadas (recurrentes) con opción de cancelación y entradas manuales por evento. | 2026-08-13 | Afecta FR-004 |

