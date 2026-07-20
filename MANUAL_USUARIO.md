# Manual de Usuario — Plataforma Nexus ISP

> Sistema de gestión de clientes, pagos y estado de servicio para proveedores de Internet (planes Starlink Residencial).

---

## Índice

1. [¿Qué es Nexus ISP?](#1-qué-es-nexus-isp)
2. [Antes de empezar](#2-antes-de-empezar)
3. [Iniciar sesión](#3-iniciar-sesión)
4. [El panel y la navegación](#4-el-panel-y-la-navegación)
5. [Dashboard (Inicio)](#5-dashboard-inicio)
6. [Gestión de clientes](#6-gestión-de-clientes)
7. [Gestión de pagos](#7-gestión-de-pagos)
8. [Cómo funciona el estado del servicio](#8-cómo-funciona-el-estado-del-servicio)
9. [Cerrar sesión](#9-cerrar-sesión)
10. [Preguntas frecuentes](#10-preguntas-frecuentes)

---

## 1. ¿Qué es Nexus ISP?

**Plataforma Nexus ISP** es un sistema web para administrar la operación de un proveedor de Internet. Con él puede:

- Registrar y editar **clientes** (datos de contacto, plan y tarifa).
- Registrar **pagos** mensuales de cada cliente.
- Ver de un vistazo el **estado del negocio**: clientes activos, suspendidos, pagos pendientes y total cobrado en el mes.
- **Suspender y reactivar el servicio automáticamente** según el pago de cada cliente.

El sistema está pensado para ser sencillo y rápido de usar en el día a día.

---

## 2. Antes de empezar

Para usar la plataforma necesita:

- Un **navegador web** moderno (Chrome, Edge o Firefox actualizados).
- La **dirección de acceso** del sistema (por ejemplo, `http://localhost:3000` si se ejecuta localmente, o la URL que le haya entregado el responsable técnico).
- Sus **credenciales de acceso** (usuario y contraseña).

> **Nota de seguridad:** las credenciales iniciales de fábrica son usuario `admin` y contraseña `admin123`. Por seguridad, solicite al responsable técnico que cambie estas credenciales antes de poner el sistema en producción.

---

## 3. Iniciar sesión

1. Abra el navegador y entre a la dirección del sistema.
2. Verá la pantalla de **inicio de sesión** con el logo de Nexus.
3. Escriba su **usuario** y su **contraseña**.
4. Pulse el botón **Iniciar sesión**.

**¿Qué puede pasar?**

- ✅ Si los datos son correctos, entrará directamente al **Dashboard**.
- ❌ Si los datos son incorrectos, aparecerá un mensaje de error en rojo. Revise el usuario y la contraseña y vuelva a intentarlo.

> La sesión permanece activa durante **12 horas**. Pasado ese tiempo deberá iniciar sesión nuevamente.

---

## 4. El panel y la navegación

Una vez dentro, verá un menú con las tres secciones principales del sistema:

| Sección | Para qué sirve |
|---------|----------------|
| **Dashboard** | Resumen general del negocio y pagos recientes. |
| **Clientes** | Registrar, buscar y editar clientes. |
| **Pagos** | Registrar pagos y ver el historial. |

En la parte superior también encontrará el botón para **cerrar sesión**.

---

## 5. Dashboard (Inicio)

El Dashboard es la pantalla de resumen. Muestra el estado actual del negocio en tiempo real.

### Indicadores principales (tarjetas)

- 🔵 **Clientes activos** — total de clientes con servicio funcionando.
- 🔴 **Clientes suspendidos** — total de clientes con el servicio cortado por falta de pago.
- 🟡 **Pagos pendientes** — clientes que tienen un pago vencido o sin registrar.
- 🟢 **Cobrado este mes** — suma total de los pagos recibidos durante el mes actual.

### Clientes con pago pendiente

Una lista con los clientes que tienen pagos vencidos, para que pueda darles seguimiento.

### Pagos recientes

Una tabla con los últimos pagos registrados (fecha, cliente, período y monto).

> **Botón Actualizar:** pulse este botón para recargar las cifras y ver la información más reciente.

---

## 6. Gestión de clientes

Entre a la sección **Clientes** desde el menú. La pantalla tiene tres áreas: el formulario para crear clientes, el buscador y la tabla de clientes.

### 6.1. Registrar un cliente nuevo

En el formulario de la izquierda complete los datos:

| Campo | ¿Obligatorio? | Detalle |
|-------|---------------|---------|
| **Nombre completo** | Sí | Nombre del cliente. |
| **Teléfono** | Sí | Número de contacto. |
| **Correo electrónico** | No | Opcional. |
| **Dirección** | Sí | Ubicación del servicio. |
| **Nombre del plan** | Sí | Viene precargado como *Plan Starlink Residencial*. |
| **Tarifa mensual** | Sí | Viene precargada en **$40**. Puede modificarla. |
| **Primer mes gratis** | No | Casilla opcional (ver abajo). |

Pulse **Guardar** para crear el cliente.

**Sobre la casilla "Primer mes gratis":**

- ✅ **Activada:** el cliente queda **Activo** y con un mes de servicio por delante.
- ⬜ **Desactivada:** el cliente queda **Suspendido** desde el inicio, hasta que registre su primer pago.

### 6.2. Buscar y filtrar clientes

En el área de búsqueda puede:

- **Buscar** escribiendo el nombre, teléfono o ID del cliente.
- **Filtrar por estado** con el menú desplegable: *Todos*, *Activos* o *Suspendidos*.

La cantidad de resultados se muestra para que sepa cuántos clientes coinciden.

### 6.3. La tabla de clientes

Muestra todos los clientes con: **ID, Nombre, Teléfono, Plan, Estado del servicio** (Activo / Suspendido) y un botón para **Editar**.

### 6.4. Editar un cliente

1. Pulse el botón **Editar** en la fila del cliente.
2. Se abrirá una ventana con sus datos.
3. Modifique lo que necesite: nombre, teléfono, correo, dirección, plan, tarifa o el **estado del servicio** (Activo / Suspendido).
4. Pulse **Guardar** para confirmar, o **Cancelar** para descartar los cambios.

> Cambiar el estado a **Activo** o **Suspendido** manualmente le permite forzar el corte o la reactivación del servicio sin esperar a un pago.

---

## 7. Gestión de pagos

Entre a la sección **Pagos** desde el menú.

### 7.1. Registrar un pago

En el formulario complete:

| Campo | Detalle |
|-------|---------|
| **Cliente** | Seleccione el cliente del menú desplegable. |
| **Monto** | Cantidad pagada (precargado en **$40**). |
| **Fecha de pago** | Fecha en que se recibió el pago (por defecto, hoy). |
| **Período** | Mes que cubre el pago, en formato **AAAA-MM** (por defecto, el mes actual). |
| **Nota** | Comentario opcional (por ejemplo, "pago en efectivo"). |

Pulse **Guardar** para registrar el pago.

**¿Qué ocurre al registrar un pago?**

- La fecha de vencimiento del cliente se **extiende 30 días** a partir de la fecha de pago.
- Si el cliente estaba **suspendido**, se **reactiva automáticamente** (pasa a Activo).

### 7.2. Historial de pagos

Debajo del formulario verá la tabla con todos los pagos registrados, ordenados del más reciente al más antiguo, mostrando: **Fecha, Cliente, Período, Monto y Nota**.

---

## 8. Cómo funciona el estado del servicio

El sistema administra el corte y la reactivación del servicio de forma **automática**, siguiendo estas reglas:

1. **Al registrar un cliente:**
   - Con *primer mes gratis* → queda **Activo** por 30 días.
   - Sin *primer mes gratis* → queda **Suspendido** hasta su primer pago.

2. **Al registrar un pago:**
   - El vencimiento se mueve 30 días hacia adelante.
   - El cliente queda **Activo**.

3. **Cuando vence la fecha de pago:**
   - Si un cliente pasa su fecha de vencimiento sin pagar, el sistema lo marca como **Suspendido** automáticamente.
   - Ese cliente aparecerá en **Pagos pendientes** en el Dashboard.

> En resumen: **un cliente al día está Activo; un cliente con pago vencido se suspende solo.** Registrar el pago lo reactiva.

---

## 9. Cerrar sesión

Pulse el botón de **cerrar sesión** en la parte superior del panel. Volverá a la pantalla de inicio de sesión y su sesión quedará cerrada de forma segura.

> Cierre siempre la sesión si usa una computadora compartida.

---

## 10. Preguntas frecuentes

**¿Por qué un cliente aparece como Suspendido si pagó?**
Verifique que el pago se haya registrado en la sección **Pagos** con la fecha correcta. Al registrarlo, el cliente se reactiva automáticamente. También puede activarlo manualmente desde **Editar cliente**.

**¿Puedo cambiar la tarifa de un cliente?**
Sí. Use el botón **Editar** en la tabla de clientes y modifique el campo de tarifa mensual.

**El total cobrado del mes no coincide con lo que esperaba.**
El indicador "Cobrado este mes" solo suma los pagos cuya **fecha de pago** cae dentro del mes actual. Revise las fechas en el historial de pagos.

**Me cerró la sesión solo.**
Por seguridad, la sesión expira a las **12 horas**. Solo debe volver a iniciar sesión.

**¿Cuántos usuarios pueden usar el sistema?**
Actualmente el sistema funciona con **un único usuario administrador** con acceso total a todas las funciones.

**Olvidé la contraseña / quiero cambiarla.**
Las credenciales las gestiona el responsable técnico en la configuración del sistema. Contáctelo para restablecerlas o cambiarlas.

---

*Manual de usuario — Plataforma Nexus ISP*
