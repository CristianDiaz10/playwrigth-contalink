import http from 'k6/http';                // Importa el módulo para hacer peticiones HTTP en k6
import { check, sleep } from 'k6';         // Importa funciones para validaciones y para simular pausas

export const options = {
  vus: 20,                                // Número de usuarios virtuales concurrentes que ejecutan el script
  duration: '30s',                        // Duración total de la prueba (30 segundos)
  rps: 20,                               // Límite de Requests Per Second (máximo 20 peticiones por segundo)
};

const BASE_URL = 'https://candidates-api.contalink.com/v1/invoices'; // URL base para las peticiones a la API
const AUTH_HEADER = { Authorization: 'UXTY789@!!1' };                 // Header con el token de autorización para autenticar

export default function () {              // Función principal que ejecuta cada usuario virtual en bucle
  const res = http.get(BASE_URL, { headers: AUTH_HEADER });  // Hace una petición GET al endpoint de facturas con el header de autorización

  check(res, {                           // Valida la respuesta para asegurar que el status sea 200 OK
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.05);                          // Simula una pausa de 0.05 segundos entre iteraciones para no saturar el servidor
}