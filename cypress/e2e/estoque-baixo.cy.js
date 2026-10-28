// Exercício 13 — Alerta de estoque baixo
describe('Produtos — alerta de estoque baixo', () => {
  it('mostra o alerta quando o estoque está abaixo do mínimo', () => {
    cy.criarProduto({ nome: `Estoque baixo ${Date.now()}`, estoque: 2, estoqueMinimo: 5 }).then((produto) => {
      cy.contains('[data-cy="linha-produto"]', produto.nome).within(() => {
        cy.dataCy('produto-estoque').should('have.class', 'estoque-baixo');
        cy.dataCy('alerta-estoque-baixo').should('be.visible').and('contain', 'Estoque baixo');
        cy.dataCy('produto-estoque').should('have.css', 'background-color', 'rgb(255, 224, 215)');
      });
    });
  });

  it('não mostra o alerta quando o estoque está acima do mínimo', () => {
    cy.criarProduto({ nome: `Estoque ok ${Date.now()}`, estoque: 20, estoqueMinimo: 5 }).then((produto) => {
      cy.contains('[data-cy="linha-produto"]', produto.nome).within(() => {
        cy.dataCy('produto-estoque').should('not.have.class', 'estoque-baixo');
        cy.dataCy('alerta-estoque-baixo').should('not.exist');
      });
    });
  });
});
