// Exercícios 10 e 11 — Edição e exclusão de produto
import { formatarPreco } from '../support/utils';

describe('Produtos — edição', () => {
  beforeEach(() => {
    cy.visit('/produtos');
  });

  it('altera o preço de um produto existente', () => {
    const novoPreco = 99.9;

    cy.contains('[data-cy="linha-produto"]', 'Bolo de chocolate').find('[data-cy="btn-editar"]').click();
    cy.url().should('match', /\/produtos\/\d+\/edit$/);
    cy.dataCy('campo-nome').should('have.value', 'Bolo de chocolate');

    cy.dataCy('campo-preco').clear().type(String(novoPreco));
    cy.dataCy('btn-salvar').click();

    cy.location('pathname').should('eq', '/produtos');
    cy.dataCy('alerta-sucesso').should('have.text', 'Produto atualizado com sucesso.');
    cy.contains('[data-cy="linha-produto"]', 'Bolo de chocolate')
      .find('[data-cy="produto-preco"]')
      .should('have.text', formatarPreco(novoPreco));
  });
});

describe('Produtos — exclusão', () => {
  beforeEach(() => {
    cy.criarProduto({ nome: `Produto para excluir ${Date.now()}` }).as('produto');
  });

  it('exclui o produto ao confirmar', function () {
    cy.on('window:confirm', (mensagem) => {
      expect(mensagem).to.eq('Remover produto?');
      return true;
    });

    cy.contains('[data-cy="linha-produto"]', this.produto.nome).find('[data-cy="btn-excluir"]').click();

    cy.dataCy('alerta-sucesso').should('have.text', 'Produto removido.');
    cy.dataCy('tabela-produtos').should('not.contain', this.produto.nome);
  });

  it('mantém o produto ao cancelar o confirm', function () {
    cy.on('window:confirm', () => false);

    cy.contains('[data-cy="linha-produto"]', this.produto.nome).find('[data-cy="btn-excluir"]').click();

    cy.dataCy('alerta-sucesso').should('not.exist');
    cy.dataCy('tabela-produtos').should('contain', this.produto.nome);
  });
});
