import { Page } from "@playwright/test";

const BASE_URL = "https://candidates-qa.contalink.com";

export class LoginPage {
  // Guarda la instancia de Playwright Page para interactuar con el navegador
  constructor(private page: Page) {}

  // Método para navegar a la página de login
  async goto() {
    console.log("➡️ Navegando a login...");
    // Navega a la URL de la página de login
    await this.page.goto("https://candidates-qa.contalink.com/");
    
    // Espera que el input con placeholder "Código de acceso" esté visible en el DOM
    await this.page.waitForSelector('[placeholder="Código de acceso"]');
    
    // Pausa la ejecución 1 segundo para hacerlo más visible
    await this.page.waitForTimeout(1000);
    
    // Mensaje en consola que confirma que la página ya cargó
    console.log("✅ Página de login cargada");
  }

  // Método para hacer login usando un código de acceso
  async loginWithAccessCode(code: string) {
    console.log(`🔐 Ingresando código de acceso: ${code}`);
    
    // Rellena el campo de texto con el código que recibe como parámetro
    await this.page.fill('[placeholder="Código de acceso"]', code);
    
    // Pausa 1 segundo para visualizar la acción
    await this.page.waitForTimeout(1000);
    
    // Hace clic en el botón que contiene el texto "Validar Código"
    await this.page.click('button:has-text("Validar Código")');
    
    // Espera que la página termine de cargar recursos (red en calma)
    await this.page.waitForLoadState('networkidle');
    
    // Pausa 1 segundo antes de continuar
    await this.page.waitForTimeout(1000);
    
    // Mensaje que confirma que el código fue validado exitosamente
    console.log("✅ Código validado");
  }
}