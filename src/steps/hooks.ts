import { Before, After } from "@cucumber/cucumber";
// Importa los hooks Before y After de Cucumber

import { CustomWorld } from "../support/world";
// Importa la clase CustomWorld para usar sus métodos

Before(async function (this: CustomWorld) {
  // Hook que se ejecuta antes de cada escenario
  // 'this' es la instancia de CustomWorld

  await this.initBrowser();
  // Inicializa el navegador y página para el escenario actual
});

After(async function (this: CustomWorld) {
  // Hook que se ejecuta después de cada escenario
  // 'this' es la instancia de CustomWorld

  await this.closeBrowser();
  // Cierra todo lo que se abrió para dejar limpio
});