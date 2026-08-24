---
name: subir-produccion
description: Commitea los cambios pendientes en la rama "desarrollo" y sincroniza "master" (produccion) con ese mismo commit. Se activa cuando el usuario escribe la frase exacta "SUBIR PRODUCCION" (en cualquier combinacion de mayusculas/minusculas), o pide explicitamente "subir a produccion" / "sincronizar con master" / "publicar los cambios de desarrollo en master".
---

# Subir a producción

Reproduce el flujo de git que se usa en este repo para pasar cambios de
`desarrollo` a `master`: un commit en `desarrollo`, push, y luego un
fast-forward de `master` al mismo commit. No es un PR ni un deploy
separado — `master` es la rama que sirve producción, así que este
flujo publica los cambios en cuanto se ejecuta.

## Antes de empezar

Esto es una acción de alto impacto (push directo a `master`/producción).
La frase "SUBIR PRODUCCION" del usuario ya es la autorización para
correr el flujo completo sin pedir confirmación adicional por el mismo —
pero igual hay que frenar y avisar (no adivinar ni forzar) si algo no
encaja con los pasos de abajo.

## Pasos

1. **Revisar el estado.**
   - `git status` — nunca uses `-uall`.
   - `git diff` (staged y unstaged) para saber exactamente qué se va a commitear.
   - Si no hay cambios pendientes en absoluto, decilo y no crees un commit vacío.
   - Si hay archivos sueltos o de aspecto sospechoso (`.env`, credenciales, algo
     que no reconozcas de la conversación actual), preguntá antes de agregarlos.

2. **Chequeo de tipos.** Corré `npx tsc --noEmit -p .` desde la raíz del repo.
   Si falla, mostrá el error y **no sigas** con el commit/push hasta que se
   resuelva o el usuario decida explícitamente ignorarlo.

3. **Commit en `desarrollo`.**
   - Asegurate de estar parado en la rama `desarrollo` (`git branch --show-current`).
     Si hay cambios pendientes en otra rama, avisá — no los muevas solo.
   - Agregá los archivos relevantes por nombre (no `git add -A` a ciegas).
   - Redactá un mensaje de commit en español, enfocado en el *por qué* del
     cambio (no una lista de archivos), siguiendo el estilo de los commits
     recientes del repo (`git log --oneline -5`).
   - Cerrá el mensaje con:
     ```
     Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
     ```

4. **Push de `desarrollo`.**
   ```bash
   git push origin desarrollo
   ```

5. **Sincronizar `master`.**
   - `git fetch origin`
   - Verificá que el fast-forward es seguro:
     ```bash
     git log --oneline origin/master..origin/desarrollo   # lo que master va a sumar
     git log --oneline origin/desarrollo..origin/master   # debe salir vacío
     ```
   - Si el segundo comando **no** sale vacío, `master` tiene commits que
     `desarrollo` no tiene (alguien commiteó directo ahí). **Parate ahí,
     avisá al usuario y no fusiones nada** — no uses `--no-ff`, `merge -X`
     ni `push --force` para resolverlo por tu cuenta.
   - Si está limpio para fast-forward:
     ```bash
     git checkout master
     git merge --ff-only desarrollo
     git push origin master
     ```

6. **Volver a `desarrollo`.**
   ```bash
   git checkout desarrollo
   ```
   El usuario trabaja sobre `desarrollo`; no lo dejes parado en `master`.

7. **Confirmar al usuario** con el hash del commit y qué se sincronizó
   (p. ej. "Commit `abc1234` en desarrollo y master, ambos actualizados
   en origin").

## Cuándo NO seguir el flujo tal cual

- Rama actual distinta de `desarrollo` con cambios sin commitear de otra
  tarea: preguntá primero.
- `master` divergió (paso 5): parar y preguntar, no forzar.
- El typecheck falla: parar y arreglar o preguntar, no commitear código roto.
- Nombres de rama distintos a `desarrollo`/`master` en el futuro (si el
  repo cambia de convención): confirmá con el usuario antes de asumir.
