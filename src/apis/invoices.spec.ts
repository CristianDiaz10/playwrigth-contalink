import { test, expect, request, APIRequestContext } from '@playwright/test'; 
// 📦 Importa las funciones de testeo y tipos necesarios desde Playwright

const AUTH_HEADER = { Authorization: 'UXTY789@!!1' }; 
// 🔐 Header con token de autorización que se usará en todas las peticiones

let apiContext: APIRequestContext; 
// 🌐 Variable para guardar el contexto de peticiones HTTP
// Se inicializa en beforeAll y se usa en los tests

test.describe('API Invoices', () => {
// 🧪 Agrupa todos los tests relacionados con /v1/invoices bajo una misma descripción

  test.beforeAll(async ({ playwright }) => {
    // 🚀 Antes de ejecutar los tests, crea un contexto HTTP usando Playwright
    apiContext = await playwright.request.newContext({
      baseURL: 'https://candidates-api.contalink.com',  // 🌍 URL base de la API
      extraHTTPHeaders: AUTH_HEADER,                     // 🔐 Usa el token en cada request
    });
  });

  test('GET /V1/invoices debe responder 200 y retornar un array (vacío o con facturas)', async () => {
    // 📥 Test que verifica que se pueda obtener un listado de facturas con folio específico

    const response = await apiContext.get('/V1/invoices?page=1&invoice_number=FAC-7081986');
    // 📡 Realiza un GET a la API con parámetros de búsqueda

    expect(response.status()).toBe(200);
    // ✅ Verifica que la respuesta tenga código 200

    const body = await response.json();
    // 🔍 Extrae el cuerpo JSON de la respuesta

    expect(Array.isArray(body.invoices)).toBe(true);
    // ✅ Verifica que la propiedad 'invoices' sea un arreglo

    if (body.invoices.length > 0) {
      const factura = body.invoices[0];
      // 🔍 Toma la primera factura del array

      expect(factura).toHaveProperty('id');
      expect(factura).toHaveProperty('invoiceNumber');
      expect(typeof factura.invoiceNumber).toBe('string');
      // ✅ Verifica que tenga propiedades esperadas
    }
  });

  test('POST /V1/invoices - creación correcta (201)', async () => {
    // 🧾 Crea una nueva factura con datos válidos

    const newInvoice = {
      invoiceNumber: 'FAC-123456',
      total: 1000,
      estado: 'Vigente',
    };

    const response = await apiContext.post('/V1/invoices', { data: newInvoice });
    expect(response.status()).toBe(201);
    // ✅ Espera que la creación devuelva código 201

    const body = await response.json();
    expect(body.invoiceNumber).toBe(newInvoice.invoiceNumber);
    expect(body.total).toBe(newInvoice.total);
    expect(body.estado).toBe(newInvoice.estado);
    // ✅ Valida que los datos devueltos coincidan con los enviados
  });

  test('POST /v1/invoices - total negativo debe devolver 400/422 (validación)', async () => {
    // ❌ Intenta crear una factura inválida con total negativo

    const badInvoice = {
      invoiceNumber: 'FAC-123457',
      total: -500,
      estado: 'Vigente',
    };

    const response = await apiContext.post('/v1/invoices', { data: badInvoice });

    expect([400, 422]).toContain(response.status());
    // ✅ Valida que se reciba un error de validación (400 o 422)
  });

  test('GET /v1/invoices/:id - sin token devuelve 401', async () => {
    // 🔒 Verifica que la API rechaza peticiones sin autorización

    const unauthContext = await request.newContext({
      baseURL: 'https://candidates-api.contalink.com',
    });

    const response = await unauthContext.get('/v1/invoices/123');
    expect(response.status()).toBe(401);
    // ✅ Espera que la respuesta sea 401 no autorizado

    await unauthContext.dispose(); // 🧹 Limpia el contexto sin token
  });

  test('DELETE /v1/invoices/:id - elimina factura creada', async () => {
    // 🗑️ Este test crea una factura y luego la elimina

    const invoiceToDelete = {
      invoiceNumber: 'FAC-DELETE-001',
      total: 1500,
      estado: 'Vigente',
    };

    const createResp = await apiContext.post('/v1/invoices', { data: invoiceToDelete });
    expect(createResp.status()).toBe(201); // ✅ Confirma que fue creada

    const createdInvoice = await createResp.json();
    const id = createdInvoice.id || createdInvoice._id || null;
    expect(id).not.toBeNull(); // ✅ Asegura que se recibió un ID

    const deleteResp = await apiContext.delete(`/v1/invoices/${id}`);
    expect(deleteResp.status()).toBe(200); // ✅ Confirma que fue eliminada
  });

  test.afterAll(async () => {
    await apiContext.dispose();
    // 🧼 Después de todos los tests, se cierra el contexto para liberar recursos
  });
});

