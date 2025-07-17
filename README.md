# k6 Invoice GET Performance Test

Este proyecto contiene un test de performance usando k6 para el endpoint GET /v1/invoices.

## Archivos

- invoice-get-performance.js: Script de k6 para test de carga
- README.md: Este archivo con instrucciones

## Requisitos

- Tener k6 instalado (https://k6.io/docs/getting-started/installation/)

## Cómo ejecutar

1. Abrir terminal y navegar a esta carpeta.
2. Ejecutar:

k6 run invoice-get-performance.js

markdown
Copiar
Editar

3. Ver los resultados en consola.


Extras- Anotaciones

Checks
checks_total.......................: 617     19.933695/s
checks_succeeded...................: 0.00%   0 out of 617
checks_failed......................: 100.00% 617 out of 617

✗ status is 200
  ↳  0% — ✓ 0 / ✗ 617
checks_total: Se hicieron 617 verificaciones (checks) en total durante el test.

checks_succeeded: Ningún check pasó exitosamente (0%).

checks_failed: Todos los 617 checks fallaron.

El check que falla es el que verifica si el status HTTP fue 200 (status is 200), es decir, ninguna respuesta fue con código 200.


HTTPS
http_req_duration......................: avg=96.67ms  min=90.05ms  med=96.5ms   max=135.08ms p(90)=100.69ms p(95)=101.62ms
http_req_failed........................: 100.00% 617 out of 617
http_reqs..............................: 617     19.933695/s
http_req_duration: Tiempo promedio que tarda cada petición en completarse (~96 ms en promedio).

http_req_failed: Todas las 617 peticiones fallaron (100%). Es un error general de k6 para indicar que la respuesta no fue exitosa.

http_reqs: Se hicieron 617 peticiones durante el test, a casi 20 por segundo (que es el objetivo).

EXCECUTION
iteration_duration.....................: avg=987.82ms min=422.45ms med=999.64ms max=1.29s    p(90)=1s       p(95)=1s
iterations.............................: 617     19.933695/s
vus....................................: 20      min=20         max=20
vus_max................................: 20      min=20         max=20
iteration_duration: Cada iteración (una ejecución del código dentro de la función principal) tarda en promedio ~988 ms.

iterations: Se completaron 617 iteraciones (igual que las peticiones).

vus: El número de usuarios virtuales (VUs) fue constante en 20.

vus_max: El máximo número de VUs también fue 20.

NETWORK
data_received..........................: 184 kB  5.9 kB/s
data_sent..............................: 34 kB   1.1 kB/s
data_received: Se recibieron 184 KB de datos en total.

data_sent: Se enviaron 34 KB de datos en total.

PRUEBAFINAL
running (0m31.0s), 00/20 VUs, 617 complete and 0 interrupted iterations
default ✓ [======================================] 20 VUs  30s
El test corrió 31 segundos con 20 usuarios virtuales (VUs).

Se completaron 617 iteraciones exitosamente (aunque con checks fallidos).

No hubo iteraciones interrumpidas.

¿Por qué fallaron todos los checks?
El check principal que haces es probablemente algo así:
check(res, { 'status is 200': (r) => r.status === 200 });
Pero el resultado indica que ninguna respuesta fue 200. Lo más probable es que el servidor esté devolviendo otro código (404, 401, 500, etc). Esto causa que el check falle y k6 marque la petición como fallida.


PROBLEMAS DE ERROR

La URL es correcta.
El token o header Authorization es válido.
La API esté activa y disponible.


Ejecutar k6 performance:
k6 run loadtest.js

Para correr test playwright:
1- npm run test:chrome
2- node generate-report.js

Ejecutar
1-npx cucumber-js --require-module ts-node/register --require src/steps/**/*.ts --require src/support/world.ts --format json:reports/cucumber_report.json
2-node generate-report.js ó reports/cucumber_report.html

Ejecutar APIS
1-npx playwright test src/apis/invoices.spec.ts ó npm run test:api
2-npm run report:api
Nota: si el puerto esta ocupado ejecutar: 
1-netstat -ano | findstr :9323
2-taskkill /PID 32756 /F
ok
API
1 - get : https://candidates-api.contalink.com/V1/invoices?page=1&invoice_number=FAC-7081986 