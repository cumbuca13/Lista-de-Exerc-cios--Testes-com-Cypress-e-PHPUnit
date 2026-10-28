// Exercícios 4 e 5 — Listagem de produtos e formulário de novo produto
// (Exercício 6: todos os seletores usam data-cy, com describe/it e beforeEach)
describe('Produtos — listagem', () => {
  beforeEach(() => {
    cy.visit('/produtos');
  });

  it('exibe a tabela com os produtos do seed', () => {
    cy.dataCy('tabela-produtos').should('exist');
    cy.dataCy('linha-produto').should('have.length.at.least', 1);
    cy.dataCy('tabela-produtos').should('contain', 'Bolo de chocolate');
  });

  it('exibe os cabeçalhos principais', () => {
    ['Produto', 'Categoria', 'Preço', 'Estoque'].forEach((cabecalho) => {
      cy.dataCy('tabela-produtos').find('th').contains(cabecalho).should('be.visible');
    });
  });

  it('cada linha mostra nome, categoria, preço e estoque', () => {
    cy.dataCy('linha-produto').first().within(() => {
      cy.dataCy('produto-nome').invoke('text').should('not.be.empty');
      cy.dataCy('produto-categoria').invoke('text').should('match', /Bolos|Doces|Salgados|Bebidas/);
      cy.dataCy('produto-preco').invoke('text').should('match', /^R\$ \d/);
      cy.dataCy('produto-estoque').invoke('text').should('match', /\d+ un\./);
    });
  });
});

describe('Produtos — abrir formulário de novo produto', () => {
  beforeEach(() => {
    cy.visit('/produtos');
    cy.dataCy('btn-novo-produto').click();
  });

  it('vai para /produtos/create', () => {
    cy.url().should('include', '/produtos/create');
    cy.dataCy('titulo-pagina').should('have.text', 'Novo produto');
  });

  it('exibe os campos do formulário', () => {
    cy.dataCy('campo-nome').should('be.visible');
    cy.dataCy('campo-categoria').should('match', 'select');
    cy.dataCy('campo-categoria').find('option').should('have.length', 5); // "Selecione" + 4 categorias
    cy.dataCy('campo-preco').should('have.attr', 'type', 'number');
    cy.dataCy('campo-estoque').should('have.attr', 'type', 'number');
    cy.dataCy('campo-estoque-minimo').should('have.attr', 'type', 'number');
  });
});
