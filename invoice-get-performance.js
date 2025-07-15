import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
  rps: 20,
};

const BASE_URL = 'https://candidates-api.contalink.com/v1/invoices';
const AUTH_HEADER = { Authorization: 'UXTY789@!!1' };

export default function () {
  const res = http.get(BASE_URL, { headers: AUTH_HEADER });

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.05);
}