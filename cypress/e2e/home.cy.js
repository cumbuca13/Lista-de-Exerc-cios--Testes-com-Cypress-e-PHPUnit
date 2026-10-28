// Exercício 2 — Visitar a página inicial
describe('Página inicial', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('exibe o nome "Doce Gestão"', () => {
    cy.contains('Doce Gestão');
    cy.dataCy('marca').should('contain', 'Doce Gestão');
  });

  it('exibe o título do painel e os cards de resumo', () => {
    cy.dataCy('titulo-pagina').should('have.text', 'Painel da confeitaria');
    ['produtos', 'clientes', 'pedidos', 'entregas'].forEach((card) => {
      cy.dataCy(`card-${card}`).should('be.visible');
    });
  });
});
