// Exercício 20 — cy.intercept + teste ponta a ponta
// O banco é recriado pela task `db:reset` (ver cypress.config.js e support/e2e.js).
describe('Ponta a ponta: cliente → produto → pedido → frete', () => {
  before(() => {
    // Garante explicitamente o banco limpo para esta suíte
    cy.task('db:reset', null, { timeout: 120000 });
  });

  it('o banco começa apenas com os dados do seed', () => {
    cy.visit('/');
    cy.dataCy('card-produtos').should('contain', '3');
    cy.dataCy('card-clientes').should('contain', '2');
    cy.dataCy('card-pedidos').should('contain', '0');
    cy.dataCy('card-entregas').should('contain', '0');
  });

  it('monitora o POST de pedido com cy.intercept e conclui o fluxo', () => {
    cy.intercept('POST', '/pedidos').as('criarPedido');

    cy.criarCliente({ nome: 'Cliente E2E' });
    cy.criarProduto({ nome: 'Produto E2E', estoque: 10, preco: 25 });

    // Pedido com estoque insuficiente: o Laravel responde 302 de volta ao formulário
    cy.visit('/pedidos/create');
    cy.selecionarOpcaoContendo('campo-cliente', 'Cliente E2E');
    cy.selecionarOpcaoContendo('campo-produto', 'Produto E2E');
    cy.dataCy('campo-quantidade').clear().type('50');
    cy.dataCy('btn-salvar').click();
    cy.wait('@criarPedido').then(({ request, response }) => {
      expect(request.body).to.include('quantity=50');
      expect(response.statusCode).to.eq(302);
      expect(response.headers.location).to.include('/pedidos/create');
    });
    cy.dataCy('erro-quantidade').should('be.visible');

    // Pedido válido: 302 para a listagem
    cy.dataCy('campo-quantidade').clear().type('4');
    cy.dataCy('campo-status').select('confirmed');
    cy.dataCy('btn-salvar').click();
    cy.wait('@criarPedido').then(({ response }) => {
      expect(response.statusCode).to.eq(302);
      expect(response.headers.location).to.match(/\/pedidos$/);
    });
    cy.dataCy('alerta-sucesso').should('have.text', 'Pedido criado e estoque atualizado.');
    cy.lerEstoque('Produto E2E').should('eq', 6);

    // Frete do pedido
    cy.visit('/pedidos');
    cy.contains('[data-cy="linha-pedido"]', 'Cliente E2E')
      .invoke('attr', 'data-id')
      .then((pedidoId) => {
        cy.intercept('POST', '/entregas').as('criarEntrega');
        cy.visit('/entregas/create');
        cy.dataCy('campo-pedido').select(pedidoId);
        cy.dataCy('campo-endereco').type('Rua E2E, 1');
        cy.dataCy('campo-cidade').type('São Paulo');
        cy.dataCy('campo-taxa').clear().type('12');
        cy.dataCy('campo-data-prevista').type('2026-12-24');
        cy.dataCy('campo-rastreio').type('E2E000001');
        cy.dataCy('btn-salvar').click();
        cy.wait('@criarEntrega').its('response.statusCode').should('eq', 302);

        cy.get(`[data-cy="linha-entrega"][data-pedido="${pedidoId}"]`).within(() => {
          cy.dataCy('entrega-cliente').should('have.text', 'Cliente E2E');
          cy.dataCy('entrega-status').should('have.text', 'scheduled');
        });
      });

    cy.visit('/');
    cy.dataCy('card-pedidos').should('contain', '1');
    cy.dataCy('card-entregas').should('contain', '1');
  });
});
