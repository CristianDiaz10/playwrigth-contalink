module.exports = {
  theme: 'bootstrap',                       // Tema visual y responsive
  jsonFile: 'reports/cucumber_report.json', // Ruta al JSON generado por Cucumber
  output: 'reports/cucumber_report.html',   // Ruta del HTML generado
  reportSuiteAsScenarios: true,             // Mostrar cada escenario como suite independiente
  launchReport: false,                       // Mejor no abrir automáticamente (controla con script npm)
  metadata: {
    "App Name": "Contalink UI",
    "Test Environment": "QA",
    "Browser": process.env.BROWSER || "Chrome",
    "Platform": process.platform,          // Detecta la plataforma actual (Windows, Linux, etc)
    "Executed": "Local",
  },
  screenshotsDirectory: 'reports/screenshots', // Carpeta para screenshots si usas
  storeScreenshots: true,                    // Guarda y muestra screenshots en el reporte
};
