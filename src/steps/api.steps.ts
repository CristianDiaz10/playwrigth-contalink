import { Given, Then } from "@cucumber/cucumber";
import axios from "axios";

let responses: { status: number }[] = [];

Given('que se ejecuta una prueba de carga sobre el endpoint de facturas', async function () {
  const BASE_URL = 'https://candidates-api.contalink.com/v1/invoices';
  const headers = { Authorization: 'UXTY789@!!1' };

  responses = []; // Reiniciamos respuestas antes de iniciar

  for (let i = 0; i < 20; i++) {
    try {
      // Ejecutamos petición GET con headers de autorización
      const res = await axios.get(BASE_URL, { headers });
      // Guardamos el status recibido
      responses.push({ status: res.status });
    } catch (error: unknown) {
      // Manejo seguro de error desconocido
      if (axios.isAxiosError(error) && error.response) {
        // Si es error Axios con respuesta, guardamos status HTTP real
        responses.push({ status: error.response.status });
      } else {
        // Error inesperado, guardamos status genérico 500
        responses.push({ status: 500 });
      }
    }
  }
});

Then('todas las respuestas deben tener un status {int}', function (expectedStatus: number) {
  for (const res of responses) {
    if (res.status !== expectedStatus) {
      throw new Error(`❌ Se recibió status ${res.status} en una de las respuestas, se esperaba ${expectedStatus}`);
    }
  }
  console.log(`✅ Todas las respuestas fueron ${expectedStatus} OK`);
});