<!-- SDD Artifact | Version: 1.0 | Phase: Constitution | Updated: 2026-08-13 -->
<!-- Project: Time Management | Feature: 001-time-management -->

# Project Constitution: Time Management

## Preamble
Esta constitución establece principios y normas para el proyecto "Time Management", cuyo propósito es permitir a los colaboradores reportar y consultar ausencias (días completos y franjas horarias) de forma transparente y confiable. Todas las decisiones de diseño e implementación deben alinearse con estas reglas; las excepciones requieren justificación en plan.md.

## Article I: Modularity
Cada característica deberá diseñarse como módulo independiente con interfaces públicas bien definidas. Microcambios locales no deben requerir despliegues globales.

## Article II: Interface-First Design
Las APIs y contratos deben definirse antes de implementar. Los cambios en la interfaz requieren versionado y migración documentada.

## Article III: Testing Standards
- Cobertura mínima de pruebas unitarias: 60% en código crítico (objetivo inicial).
- Pruebas de integración: cubrir endpoints y flujos de registro/consulta de ausencias.
- E2E: escenarios clave (reportar ausencia, editar, visualizar calendario del equipo) en pipelines de CI.
- No se permiten merges en ramas protegidas sin pasar la CI.

## Article IV: Configuration & Environment
- Todas las configuraciones (URLs, claves, feature flags) deben estar externalizadas mediante variables de entorno.
- No hardcodear secretos ni credenciales en el repositorio.

## Article V: Error Handling
- Respuestas de error consistentes y amigables para el usuario.
- Registrar errores internos con trazas estructuradas; no exponer detalles internos al usuario.

## Article VI: Observability
- Logging estructurado (JSON) con correlación de request_id.
- Health-check endpoint básico (/health) que reporte dependencia de DB y servicios críticos.
- Métricas: tasa de errores, latencia p95, número de registros de ausencia por día.

## Article VII: Security
- Autenticación: integrar con el sistema de identidad existente (SSO/LDAP) cuando sea posible.
- Autorización: aplicar principios de menor privilegio; registrar modificaciones por usuario.
- Cifrado: TLS para tránsito; secretos gestionados por herramienta segura.

## Article VIII: Performance
- Objetivo inicial: latencia de lectura <300ms para consultas simples, p95 < 1s.
- Escalabilidad: diseñar para al menos 1000 usuarios concurrentes en fase inicial.

## Article IX: Documentation
- README debe permitir a un nuevo desarrollador ejecutar el proyecto en <30 minutos.
- Documentar API (OpenAPI) y los criterios de aceptación en spec.md.

## Technology Stack Governance (defaults)
| Layer | Technology (Sugerido) | Version | Non-negotiable? |
|-------|----------------------|---------|-----------------|
| Backend | Node.js (Express) | LTS | No |
| Frontend | React | LTS | No |
| Database | PostgreSQL | 15+ | No |
| Hosting | Cloud (Proveedor a definir) | N/A | No |
| Auth | SSO/OAuth | N/A | No |
| CI/CD | GitHub Actions | N/A | No |

## Amendments
| # | Date | Description | Rationale |
|---|------|-------------|-----------|
| 1 | 2026-08-13 | Constitución inicial | Kickoff del proyecto

