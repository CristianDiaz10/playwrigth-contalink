const reporter = require('cucumber-html-reporter');

const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber_report.json',   // Ruta del JSON generado por cucumber-js
  output: 'reports/cucumber_report.html',     // Ruta donde se guardará el reporte HTML
  reportSuiteAsScenarios: true,
  launchReport: false,                         // Cambia a true para abrir el reporte automáticamente
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "QA",
    "Browser": "Chrome",
    "Platform": process.platform,
    "Executed": "Local"
  }
};

reporter.generate(options);