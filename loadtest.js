import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // 20 usuarios virtuales para simular 20 rps
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las requests deben completarse en menos de 500ms
  },
};

export default function () {
  const url = 'https://candidates-api.contalink.com/V1/invoices?page=1';
  const params = {
    headers: {
      'Authorization': 'UXTY789@!!1',
    },
  };

  http.get(url, params);  // Ejecuta un GET con el header de autorización
  sleep(1);               // Espera 1 segundo entre cada request
}