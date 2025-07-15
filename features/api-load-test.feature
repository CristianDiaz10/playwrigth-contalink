Feature: Prueba de carga a la API de facturas

  @api @carga
  Scenario: Verificar que el endpoint de facturas responda exitosamente bajo carga
    Given que se ejecuta una prueba de carga sobre el endpoint de facturas
    Then todas las respuestas deben tener un status 200