import { IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
// Importa la interfaz IWorldOptions y la función para registrar tu clase mundo

import { Browser, BrowserContext, Page, chromium, firefox } from "@playwright/test";
// Importa tipos y funciones de Playwright para control de navegador y páginas

import { InvoicePage } from '../pages/contalink';
// Importa tu Page Object para manejar la página de facturas

export class CustomWorld {
  // Clase personalizada que actuará como contexto para tus tests Cucumber

  browser!: Browser;
  // Instancia del navegador (Chromium, Firefox, etc.)

  context!: BrowserContext;
  // Contexto aislado dentro del navegador para mantener sesiones separadas

  page!: Page;
  // Página o pestaña donde se ejecutarán las acciones

  invoicePage!: InvoicePage;
  // Instancia del Page Object para la página de facturas

  options: IWorldOptions;
  // Guardamos las opciones que Cucumber nos pasa al crear el mundo
  // Estas opciones incluyen funciones para attach, log, etc.

  constructor(options: IWorldOptions) {
    // Constructor que recibe las opciones que Cucumber proporciona

    this.options = options;
    // Guardamos las opciones para uso interno si necesitamos (por ejemplo logs o screenshots)
  }

  async initBrowser() {
    // Método asíncrono para inicializar el navegador antes de cada escenario

    const browserName = process.env.BROWSER || "chromium";
    // Obtiene el navegador deseado de la variable de entorno o usa chromium por defecto

    console.log(`🟢 Iniciando navegador: ${browserName}`);
    // Log para indicar qué navegador se está iniciando

    const launchers = { chromium, firefox };
    // Diccionario para mapear nombres a funciones que lanzan navegadores

    const browserType = launchers[browserName as keyof typeof launchers] || chromium;
    // Selecciona el tipo de navegador basado en la variable o chromium si no existe

    this.browser = await browserType.launch({ headless: false });
    // Lanza el navegador en modo visible (headless: false)

    this.context = await this.browser.newContext();
    // Crea un nuevo contexto (sesión) aislado dentro del navegador

    this.page = await this.context.newPage();
    // Abre una nueva pestaña para realizar acciones

    this.invoicePage = new InvoicePage(this.page);
    // Inicializa tu Page Object de facturas con la página creada

    console.log("✅ Navegador iniciado");
    // Log para confirmar que el navegador está listo
  }

  async closeBrowser() {
    // Método para cerrar la página, contexto y navegador después de cada escenario

    console.log("🛑 Cerrando navegador");
    // Log para indicar que se está cerrando el navegador

    await this.page?.close();
    // Cierra la pestaña si existe

    await this.context?.close();
    // Cierra el contexto y limpia la sesión

    await this.browser?.close();
    // Cierra el navegador completamente
  }
}

setWorldConstructor(CustomWorld);
// Registra la clase CustomWorld para que Cucumber la use como contexto en los tests