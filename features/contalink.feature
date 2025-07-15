Feature: Gestión de facturas

  @regression @factura
  Scenario: Crear y eliminar una factura
    Given el usuario inicia sesión con contraseña "UXTY789@!!1"
    When hace clic en "Nueva factura"
    Then captura la factura FAC-7081986 con total $1200 y estado "Vigente"
    And confirma la creación
    Then la factura "FAC-7081986" debe aparecer en los resultados de búsqueda
    When elimina la factura "FAC-7081986"
    Then la factura "FAC-7081986" ya no debería estar visible en la lista