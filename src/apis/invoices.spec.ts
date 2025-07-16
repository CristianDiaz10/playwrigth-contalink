import { test, expect } from '@playwright/test';

const AUTH_HEADER = { Authorization: 'UXTY789@!!1' };

test.describe('API Invoices', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'https://candidates-api.contalink.com',
      extraHTTPHeaders: AUTH_HEADER,
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('GET /v1/invoices - debe devolver lista vacía o no vacía con 200', async () => {
    const response = await apiContext.get('/v1/invoices');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('POST /v1/invoices - creación correcta (201)', async () => {
    const newInvoice = {
      invoiceNumber: 'FAC-123456',
      total: 1000,
      estado: 'Vigente',
    };

    const response = await apiContext.post('/v1/invoices', { data: newInvoice });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.invoiceNumber).toBe(newInvoice.invoiceNumber);
    expect(body.total).toBe(newInvoice.total);
    expect(body.estado).toBe(newInvoice.estado);
  });

  test('POST /v1/invoices - total negativo debe devolver 400/422 (validación)', async () => {
    const badInvoice = {
      invoiceNumber: 'FAC-123457',
      total: -500,
      estado: 'Vigente',
    };

    const response = await apiContext.post('/v1/invoices', { data: badInvoice });
    expect([400, 422]).toContain(response.status());
  });

  test('GET /v1/invoices/:id - sin token devuelve 401', async () => {
    const unauthContext = await test.request.newContext({
      baseURL: 'https://candidates-api.contalink.com',
    });

    const response = await unauthContext.get('/v1/invoices/123');
    expect(response.status()).toBe(401);

    await unauthContext.dispose();
  });

  test('DELETE /v1/invoices/:id - elimina factura creada', async () => {
    const invoiceToDelete = {
      invoiceNumber: 'FAC-DELETE-001',
      total: 1500,
      estado: 'Vigente',
    };

    const createResp = await apiContext.post('/v1/invoices', { data: invoiceToDelete });
    expect(createResp.status()).toBe(201);

    const createdInvoice = await createResp.json();
    const id = createdInvoice.id || createdInvoice._id || null;
    expect(id).not.toBeNull();

    const deleteResp = await apiContext.delete(`/v1/invoices/${id}`);
    expect(deleteResp.status()).toBe(200);
  });
});