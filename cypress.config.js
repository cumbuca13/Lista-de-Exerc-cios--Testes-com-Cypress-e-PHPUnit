import { defineConfig } from 'cypress';
import { execSync } from 'node:child_process';

// Exercício 1 (baseUrl) e Exercício 20 (task que recria o banco antes da suíte).
//
// Por padrão o banco é recriado dentro do container Docker do projeto.
// Para rodar sem Docker (ex.: `php artisan serve` local ou no CI), defina:
//   CYPRESS_DB_RESET_COMMAND="php artisan migrate:fresh --seed --force"
const COMANDO_PADRAO = 'docker compose exec -T app php artisan migrate:fresh --seed --force';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      on('task', {
        'db:reset'() {
          const comando = config.env.DB_RESET_COMMAND || COMANDO_PADRAO;
          execSync(comando, { cwd: config.projectRoot, stdio: 'inherit' });
          return null; // tasks precisam retornar algo diferente de undefined
        },
      });

      return config;
    },
  },
});
