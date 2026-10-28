import './commands';

// Exercício 20: recria o banco (migrate:fresh --seed) antes de cada arquivo de
// teste, garantindo que todos comecem com os mesmos dados do seed.
// Para pular (ex.: banco já preparado), rode com CYPRESS_SKIP_DB_RESET=true.
before(() => {
  if (!Cypress.env('SKIP_DB_RESET')) {
    cy.task('db:reset', null, { timeout: 120000 });
  }
});
