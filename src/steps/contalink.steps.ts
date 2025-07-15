import { Given, When, Then } from "@cucumber/cucumber"; 
// Importa funciones para definir pasos (steps) de Cucumber

import { CustomWorld } from "../support/world"; 
// Importa la clase CustomWorld que extiende el contexto de Cucumber con propiedades y métodos personalizados

import { InvoicePage } from "../pages/contalink"; 
// Importa la clase que maneja la lógica de la página de facturas (Page Object Model)

import { LoginPage } from "../pages/LoginPage"; 
// Importa la clase que maneja la página de login (Page Object Model)


// Define un step "Given" con un parámetro {string}, que representa la contraseña (o código de acceso)
Given('el usuario inicia sesión con contraseña {string}', async function (this: CustomWorld, password: string) {
  // Crea una instancia de LoginPage usando la página actual de Playwright del contexto `this`
  const loginPage = new LoginPage(this.page);

  // Navega a la página de login
  await loginPage.goto();

  // Usa el método de LoginPage para hacer login con el código de acceso (password)
  await loginPage.loginWithAccessCode(password);
  // Comentario aclara que el parámetro "password" es en realidad un código de acceso
});


// Define un step "When" con un parámetro {string} y un timeout personalizado de 30 segundos
When(
  'hace clic en {string}',
  { timeout: 30 * 1000 },

  // Función asincrónica que se ejecuta cuando el step coincide
  async function (buttonName: string) {
    // Log en consola para indicar qué botón se intenta clickear
    console.log(`➡️ Intentando hacer clic en "${buttonName}"`);

    // Condicional para manejar el botón "Nueva factura"
    if (buttonName === "Nueva factura") {
      // Usa la instancia this.invoicePage ya creada para hacer click en "Nueva factura"
      await this.invoicePage.clickNuevaFactura();

      // Log que confirma que el click se completó exitosamente
      console.log(`✅ Click en "${buttonName}" completado`);
    } else {
      // Si el botón no está implementado en el step, lanza un error para evitar pasos inválidos
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
  // Usa la instancia de InvoicePage que ya está creada en this.invoicePage
  // para evitar crear una nueva instancia innecesaria
  await this.invoicePage.confirmarCreacion();
});

Then(
  "la factura {string} debe aparecer en los resultados de búsqueda",
  { timeout: 20 * 1000 }, // Timeout personalizado de 20 segundos para este step
  async function (this: CustomWorld, folio: string) {
    // Crea una nueva instancia de InvoicePage con la página actual
    const invoicePage = new InvoicePage(this.page);
    // Llama al método para verificar que la factura con el folio dado aparece en la lista
    await invoicePage.verificarFacturaEnLista(folio);
  }
);

When(
  'elimina la factura {string}',
  { timeout: 70 * 1000 }, // Timeout de 70 segundos para este paso, considerando que puede tomar más tiempo
  async function (this: CustomWorld, folio: string) {
    // Crea una instancia de InvoicePage para manipular la página
    const invoicePage = new InvoicePage(this.page);
    // Ejecuta la función para eliminar todas las facturas con ese folio
    await invoicePage.eliminarTodasLasFacturas(folio);
  }
);

Then("la factura {string} ya no debería estar visible en la lista", async function (this: CustomWorld, folio: string) {
  // Nueva instancia de InvoicePage para verificar la visibilidad
  const invoicePage = new InvoicePage(this.page);
  // Verifica que la factura con el folio dado ya no esté visible en la lista
  await invoicePage.verificarFacturaNoVisible(folio);
});