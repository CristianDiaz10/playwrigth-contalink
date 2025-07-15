const reporter = require('cucumber-html-reporter');
// Importa la librería 'cucumber-html-reporter' para generar reportes HTML a partir del JSON de Cucumber

const options = {
  theme: 'bootstrap',                 // Define el tema visual del reporte, 'bootstrap' es uno común y limpio
  jsonFile: 'reports/cucumber_report.json',  // Ruta al archivo JSON que contiene los resultados de la ejecución de Cucumber
  output: 'reports/cucumber_report.html',    // Ruta donde se guardará el reporte HTML generado
  reportSuiteAsScenarios: true,      // Opcional: agrupa el reporte mostrando los escenarios como suites individuales
  launchReport: true,                 // Al generar el reporte, abre automáticamente el archivo HTML en el navegador predeterminado
};

reporter.generate(options);
// Ejecuta la función para crear el reporte HTML usando las opciones definidas