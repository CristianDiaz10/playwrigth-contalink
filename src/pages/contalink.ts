import { Page, expect } from "@playwright/test";

export class InvoicePage {
  constructor(private page: Page) {}

async clickNuevaFactura() {
  console.log("🧾 Buscando botón 'Nueva factura'...");
  try {
    await this.page.waitForSelector('text="Nueva Factura"', { timeout: 10000 });
    const button = this.page.locator('text="Nueva Factura"');
    await button.waitFor({ state: 'visible', timeout: 10000 });
    console.log("✅ Botón 'Nueva Factura' visible");
    await button.click();
  } catch (error) {
    console.log("❌ No se encontró el botón 'Nueva Factura'");
    // Opcional: Mostrar algo de HTML para debug
    const html = await this.page.content();
    console.log("HTML de la página al momento del error:", html.slice(0, 500)); // solo primeros 500 caracteres
    throw error;
  }
}

async capturarFactura(folio: string, total: string, estado: string) {
  console.log(`📝 Capturando factura: ${folio}, total: ${total}, estado: ${estado}`);

  // Esperar y llenar el folio
  await this.page.locator('#invoiceNumber').waitFor({ state: 'visible' });
  await this.page.locator('#invoiceNumber').click();
  await this.page.locator('#invoiceNumber').fill(folio);
  await this.page.waitForTimeout(1000); // pausa de 1 segundo

  // Esperar y llenar el total
  await this.page.getByRole('spinbutton', { name: 'Total' }).waitFor({ state: 'visible' });
  await this.page.getByRole('spinbutton', { name: 'Total' }).click();
  await this.page.getByRole('spinbutton', { name: 'Total' }).fill(total);
  await this.page.waitForTimeout(1000); // pausa de 1 segundo

  // Esperar y seleccionar el estado
  await this.page.getByLabel('Estado').waitFor({ state: 'visible' });
  await this.page.getByLabel('Estado').selectOption(estado);
  await this.page.waitForTimeout(1000); // pausa de 1 segundo
}

async confirmarCreacion() {
  console.log("✅ Confirmando creación de factura");
  const btnCrear = this.page.getByRole('button', { name: 'Crear Factura' });
  await btnCrear.waitFor({ state: 'visible', timeout: 10000 });
  await btnCrear.click();
  await this.page.waitForTimeout(1000); // espera 1 segundo para que se vea el click
}

async verificarFacturaEnLista(folio: string) {
  console.log(`🔍 Buscando factura: ${folio}`);

  const input = this.page.getByRole('textbox', { name: 'Número de Factura' });
  const buscarBtn = this.page.getByRole('button', { name: 'Buscar' });

  // Esperar a que el input esté visible y listo
  await input.waitFor({ state: 'visible' });
  await input.fill(folio);

  // Esperar a que el botón esté visible y habilitado
  await buscarBtn.waitFor({ state: 'visible' });
  
  // Opcional: desplazarse al botón para asegurarse que esté en vista
  await buscarBtn.scrollIntoViewIfNeeded();

  // Click con espera explícita
  await buscarBtn.click();

  // Esperar que el resultado aparezca
  await this.page.waitForSelector(`text=${folio}`, { timeout: 15000 });
}


async eliminarTodasLasFacturas(folio: string) {
  // Tiempo máximo de espera para que se elimine una factura individualmente (5 segundos)
  const timeoutPorFactura = 5000;
  // Tiempo máximo total para eliminar todas las facturas (60 segundos)
  const maxTimeout = 60000;
  // Guardamos el tiempo inicial para controlar el timeout total
  const startTime = Date.now();

  while (true) {
    // Localizamos todas las filas de la tabla que contienen el folio buscado
    const filas = this.page.locator(`tr:has-text("${folio}")`);
    // Contamos cuántas filas/facturas con ese folio hay en la tabla
    const count = await filas.count();
    console.log(`🗑️ Encontradas ${count} facturas con folio ${folio}`);

    // Si ya no hay filas, significa que eliminamos todas las facturas, salimos del ciclo
    if (count === 0) {
      console.log(`🧹 Todas las facturas con folio ${folio} han sido eliminadas`);
      break;
    }

    // Si ya pasó el tiempo máximo permitido, lanzamos un error para detener el proceso
    if (Date.now() - startTime > maxTimeout) {
      throw new Error(`⏰ Timeout excedido eliminando facturas con folio ${folio}`);
    }

    // Tomamos la primera fila que contiene el folio (para eliminarla)
    const fila = filas.first();
    // Dentro de esa fila, localizamos el botón para eliminar factura
    const btnEliminar = fila.locator('button[title="Eliminar factura"]');

    // Hacemos scroll para asegurarnos que el botón sea visible y pueda hacerle clic
    await btnEliminar.scrollIntoViewIfNeeded();

    // Registramos un evento para capturar el diálogo de confirmación y aceptarlo automáticamente
    this.page.once('dialog', async (dialog) => {
      console.log(`🛑 Diálogo detectado: ${dialog.message()}`);
      await dialog.accept();
    });

    console.log(`🗑️ Intentando eliminar factura con folio ${folio}`);
    // Hacemos clic en el botón eliminar
    await btnEliminar.click();

    // Esperamos que la fila desaparezca de la tabla (confirmando que se eliminó)
    await fila.waitFor({ state: 'detached', timeout: timeoutPorFactura });

    // Pausa 1 segundo para dar tiempo a que la tabla se refresque y sea visible el siguiente registro
    await this.page.waitForTimeout(1000);
  }
}



  async verificarFacturaNoVisible(folio: string) {
    console.log(`🚫 Verificando que no exista factura: ${folio}`);
    await this.page.waitForSelector(`text=${folio}`, { state: "detached" });
  }
}