// Exercício 3 — Navegação pelo menu
describe('Navegação pelo menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const paginas = [
    { link: 'nav-produtos', url: '/produtos', titulo: 'Produtos e estoque' },
    { link: 'nav-clientes', url: '/clientes', titulo: 'Clientes' },
    { link: 'nav-pedidos', url: '/pedidos', titulo: 'Pedidos / vendas' },
    { link: 'nav-fretes', url: '/entregas', titulo: 'Fretes e entregas' },
  ];

  paginas.forEach(({ link, url, titulo }) => {
    it(`abre ${url} pelo menu`, () => {
      cy.dataCy(link).click();
      cy.url().should('include', url);
      cy.dataCy('titulo-pagina').should('contain', titulo);
    });
  });

  it('navega por todas as páginas em sequência e volta ao início', () => {
    paginas.forEach(({ link, url }) => {
      cy.dataCy(link).click();
      cy.url().should('include', url);
    });
    cy.dataCy('nav-inicio').click();
    cy.location('pathname').should('eq', '/');
  });
});
