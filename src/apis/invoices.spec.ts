import { test, expect } from '@playwright/test';

// Define un header de autorización que se usará en las peticiones API
const AUTH_HEADER = { Authorization: 'UXTY789@!!1' };

test.describe('API Invoices', () => {
  let apiContext; // Contexto para realizar peticiones HTTP durante los tests

  // Antes de todos los tests, crea un contexto de API con baseURL y header de autorización
  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'https://candidates-api.contalink.com',
      extraHTTPHeaders: AUTH_HEADER,
    });
  });

  // Después de todos los tests, libera el contexto para limpiar recursos
  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // Test que verifica que el endpoint GET /v1/invoices responde con 200 y un array (vacío o no)
  test('GET /v1/invoices - debe devolver lista vacía o no vacía con 200', async () => {
    const response = await apiContext.get('/v1/invoices');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy(); // Verifica que la respuesta es un arreglo
  });

  // Test que crea una factura (POST /v1/invoices) y espera código 201 (creado) con datos correctos
  test('POST /v1/invoices - creación correcta (201)', async () => {
    const newInvoice = {
      invoiceNumber: 'FAC-123456',
      total: 1000,
      estado: 'Vigente',
    };

    const response = await apiContext.post('/v1/invoices', { data: newInvoice });
    expect(response.status()).toBe(201);

    const body = await response.json();
    // Verifica que la factura creada contiene los mismos datos que se enviaron
    expect(body.invoiceNumber).toBe(newInvoice.invoiceNumber);
    expect(body.total).toBe(newInvoice.total);
    expect(body.estado).toBe(newInvoice.estado);
  });

  // Test que intenta crear una factura con total negativo y espera un error 400 o 422 (validación)
  test('POST /v1/invoices - total negativo debe devolver 400/422 (validación)', async () => {
    const badInvoice = {
      invoiceNumber: 'FAC-123457',
      total: -500,
      estado: 'Vigente',
    };

    const response = await apiContext.post('/v1/invoices', { data: badInvoice });
    expect([400, 422]).toContain(response.status()); // Valida que sea uno de esos códigos de error
  });

  // Test que intenta obtener una factura sin token de autorización, debe devolver 401 (no autorizado)
  test('GET /v1/invoices/:id - sin token devuelve 401', async () => {
    // Crea un contexto sin header Authorization
    const unauthContext = await test.request.newContext({
      baseURL: 'https://candidates-api.contalink.com',
    });

    const response = await unauthContext.get('/v1/invoices/123');
    expect(response.status()).toBe(401);

    await unauthContext.dispose();
  });

  // Test que crea una factura y luego la elimina, comprobando los estados HTTP esperados
  test('DELETE /v1/invoices/:id - elimina factura creada', async () => {
    const invoiceToDelete = {
      invoiceNumber: 'FAC-DELETE-001',
      total: 1500,
      estado: 'Vigente',
    };

    // Crea la factura primero
    const createResp = await apiContext.post('/v1/invoices', { data: invoiceToDelete });
    expect(createResp.status()).toBe(201);

    const createdInvoice = await createResp.json();
    // Obtiene el ID de la factura creada (puede venir en 'id' o '_id')
    const id = createdInvoice.id || createdInvoice._id || null;
    expect(id).not.toBeNull();

    // Elimina la factura usando su ID
    const deleteResp = await apiContext.delete(`/v1/invoices/${id}`);
    expect(deleteResp.status()).toBe(200); // Espera respuesta exitosa
  });
});