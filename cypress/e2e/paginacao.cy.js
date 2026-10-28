// Exercício 16 — Paginação (usa cy.criarProduto do Exercício 15)
const POR_PAGINA = 10;

const nomesDaPagina = () =>
  cy.dataCy('produto-nome').then(($nomes) => [...$nomes].map((el) => el.innerText.trim()));

describe('Produtos — paginação', () => {
  before(() => {
    // O seed tem 3 produtos; criamos mais 9 para passar do limite de 10 por página
    for (let i = 1; i <= 9; i += 1) {
      cy.criarProduto({ nome: `Paginação ${String(i).padStart(2, '0')}` });
    }
  });

  beforeEach(() => {
    cy.visit('/produtos');
  });

  it('a primeira página tem o limite de registros e um link "próxima"', () => {
    cy.dataCy('linha-produto').should('have.length', POR_PAGINA);
    cy.dataCy('paginacao').find('a[rel="next"]').should('exist');
  });

  it('a próxima página mostra outros registros e a anterior continua acessível', () => {
    nomesDaPagina().then((pagina1) => {
      cy.dataCy('paginacao').find('a[rel="next"]').first().click();
      cy.url().should('include', 'page=2');
      cy.dataCy('linha-produto').should('have.length', 2);

      nomesDaPagina().then((pagina2) => {
        pagina2.forEach((nome) => expect(pagina1).not.to.include(nome));
      });

      cy.dataCy('paginacao').find('a[rel="prev"]').first().click();
      cy.url().should('include', 'page=1');
      cy.dataCy('linha-produto').should('have.length', POR_PAGINA);
      nomesDaPagina().should('deep.equal', pagina1);
    });
  });
});
