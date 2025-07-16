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
  // Step de Cucumber que espera un número entero (como 200) desde el archivo .feature.
  // Se guarda en la variable expectedStatus.

  for (const res of responses) {
    // Recorre cada respuesta en el arreglo 'responses'.

    if (res.status !== expectedStatus) {
      // Si el status de alguna respuesta no es igual al esperado...

      throw new Error(`❌ Se recibió status ${res.status} en una de las respuestas, se esperaba ${expectedStatus}`);
      // Lanza un error indicando qué status se recibió y cuál se esperaba.
      // Esto detiene el test y lo marca como fallido.
    }
  }

  console.log(`✅ Todas las respuestas fueron ${expectedStatus} OK`);
  // Si todas las respuestas pasaron, se imprime un mensaje de éxito.
});