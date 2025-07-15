import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { InvoicePage } from "../pages/contalink";
import { LoginPage } from "../pages/LoginPage";



Given('el usuario inicia sesión con contraseña {string}', async function (this: CustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.loginWithAccessCode(password);  // 'password' es en realidad el código de acceso
});


When(
  'hace clic en {string}',
  { timeout: 30 * 1000 },
  async function (buttonName: string) {
    console.log(`➡️ Intentando hacer clic en "${buttonName}"`);

    if (buttonName === "Nueva factura") {
      // Usa this.invoicePage, no una variable local no inicializada
      await this.invoicePage.clickNuevaFactura();
      console.log(`✅ Click en "${buttonName}" completado`);
    } else {
      throw new Error(`Botón "${buttonName}" no implementado en step`);
    }
  }
);

Then(
  // ✅ Expresión regular que valida el texto completo del step y captura 3 valores:
  // - El número del folio (solo dígitos)
  // - El total en formato flexible: permite decimales y comas
  // - El estado, con o sin comillas
  /^captura la factura FAC-(\d+) con total \$([0-9.,]+) y estado "?([^"]+)"?$/,

  // ✅ Opcional: timeout personalizado de 20 segundos para este step
  { timeout: 20 * 1000 },

  // ✅ Función asincrónica que será ejecutada si el texto del step coincide con el patrón regex
  async function (
    this: CustomWorld,     // 🔧 Contexto compartido de Cucumber para acceder al navegador y a tus pages
    folioPart: string,     // 📦 Grupo 1 del regex: solo la parte numérica del folio, ejemplo: "7081986"
    total: string,         // 💰 Grupo 2 del regex: total capturado como string, ej. "1200", "1,200.00"
    estado: string         // 🏷️ Grupo 3 del regex: estado capturado, con o sin comillas, ej. "Vigente"
  ) {
    // 🔧 Reconstruimos el folio completo, agregando el prefijo "FAC-"
    const folio = `FAC-${folioPart}`;

    // 🧾 Logueamos la información capturada para depuración
    console.log(`📝 Capturando factura: ${folio}, Total: ${total}, Estado: ${estado}`);

    // 🧪 Llamamos al método del Page Object para realizar la acción en la interfaz
    await this.invoicePage.capturarFactura(folio, total, estado);

    // ✅ Confirmamos que la acción se completó exitosamente
    console.log("✅ Factura capturada correctamente");
  }
);

When("confirma la creación", async function (this: CustomWorld) {
  // Usa la instancia que ya tienes en this.invoicePage para no crear otra nueva
  await this.invoicePage.confirmarCreacion();
});

Then(
  "la factura {string} debe aparecer en los resultados de búsqueda",
  { timeout: 20 * 1000 }, // 20 segundos
  async function (this: CustomWorld, folio: string) {
    const invoicePage = new InvoicePage(this.page);
    await invoicePage.verificarFacturaEnLista(folio);
  }
);

When(
  'elimina la factura {string}',
  { timeout: 70 * 1000 }, // 70 segundos
  async function (this: CustomWorld, folio: string) {
    const invoicePage = new InvoicePage(this.page);
    await invoicePage.eliminarTodasLasFacturas(folio);
  }
);


Then("la factura {string} ya no debería estar visible en la lista", async function (this: CustomWorld, folio: string) {
  const invoicePage = new InvoicePage(this.page);
  await invoicePage.verificarFacturaNoVisible(folio);
});