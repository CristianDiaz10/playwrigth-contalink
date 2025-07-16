import { Then } from '@cucumber/cucumber';
// Importa la función 'Then' de Cucumber para definir un step de tipo "Entonces"

import { exec } from 'child_process';
// Importa 'exec' de Node.js para poder ejecutar comandos de consola (como `k6 run`)

import { promisify } from 'util';
// Importa 'promisify' para convertir funciones con callbacks en Promesas (uso con async/await)

import { CustomWorld } from '../support/world';
// Importa tu clase CustomWorld que extiende el contexto de Cucumber (usada como 'this')

const execAsync = promisify(exec);
// Convierte 'exec' en una función basada en Promesas, para poder usar 'await execAsync(...)'

// Define el step de Cucumber con una duración extendida (30 segundos) para que no falle por timeout
Then(
  'ejecuto el test de performance k6',       // Nombre del step (debe coincidir con el .feature)
  { timeout: 60_000 },                        // ⏱ Aumenta el tiempo máximo de espera a 30s
  async function (this: CustomWorld) {        // Función async que tiene acceso al contexto de Cucumber
    const loadtestPath = 'loadtest.js';       // Ruta del archivo de prueba de carga con k6

    try {
      // Ejecuta el comando `k6 run` con el archivo especificado
      const { stdout, stderr } = await execAsync(`k6 run "${loadtestPath}"`);
      
      // Muestra en consola la salida estándar del comando k6 (resultados del test)
      console.log('k6 output:', stdout);

      // Si hubo salida de error (stderr), la muestra también en consola
      if (stderr) console.error('k6 stderr:', stderr);
    } catch (error) {
      // Si ocurrió un error al ejecutar el comando (por ejemplo, k6 no instalado o falla en el script)
      console.error('Error ejecutando k6:', error);
      throw error; // Lanza el error para que Cucumber marque el step como fallido
    }
  }
);