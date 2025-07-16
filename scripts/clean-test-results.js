const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'test-results', 'api');

fs.rm(dir, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error('No se pudo borrar la carpeta:', err);
  } else {
    console.log('Carpeta test-results/api eliminada.');
  }
});