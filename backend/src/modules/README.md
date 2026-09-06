# Módulos previstos

Los próximos módulos siguen los dominios ya existentes en el frontend: `users`,
`categories`, `products`, `inventory`, `promotions`, `banners`, `quotes` y `uploads`.

Cada módulo tendrá sus propios `dto`, controller, service y repository. Las reglas de
administración se protegerán con `JwtAuthGuard` y `RolesGuard`; el frontend nunca será
la fuente de verdad para los permisos.
