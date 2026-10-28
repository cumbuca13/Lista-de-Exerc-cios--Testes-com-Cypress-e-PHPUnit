// Exercícios 7, 8 e 9 — Cadastro, formulário vazio e valores inválidos
// (Exercício 14: os dados vêm de cypress/fixtures/produto.json)
import { formatarPreco } from '../support/utils';

// Desliga a validação HTML5 para que o envio chegue ao Laravel
const desligarValidacaoDoNavegador = () => {
  cy.dataCy('form-produto').invoke('attr', 'novalidate', 'novalidate');
};

describe('Produtos — cadastro', () => {
  beforeEach(() => {
    cy.visit('/produtos/create');
  });

  it('cadastra um produto com os dados da fixture', () => {
    cy.fixture('produto').then((produto) => {
      cy.preencherProduto(produto);
      cy.dataCy('btn-salvar').click();

      cy.location('pathname').should('eq', '/produtos');
      cy.dataCy('alerta-sucesso').should('have.text', 'Produto cadastrado com sucesso.');
      cy.contains('[data-cy="linha-produto"]', produto.nome).within(() => {
        cy.dataCy('produto-categoria').should('have.text', produto.categoria);
        cy.dataCy('produto-preco').should('have.text', formatarPreco(produto.preco));
        cy.dataCy('produto-estoque').should('contain', `${produto.estoque} un.`);
      });
    });
  });
});

describe('Produtos — formulário vazio', () => {
  beforeEach(() => {
    cy.visit('/produtos/create');
  });

  it('o navegador bloqueia o envio dos campos obrigatórios (HTML5)', () => {
    cy.dataCy('btn-salvar').click();
    cy.location('pathname').should('eq', '/produtos/create');
    cy.dataCy('campo-nome').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
      expect($input[0].validationMessage).to.not.be.empty;
    });
  });

  it('o servidor mostra uma mensagem de erro para cada campo obrigatório', () => {
    desligarValidacaoDoNavegador();
    cy.dataCy('campo-estoque').clear();
    cy.dataCy('campo-estoque-minimo').clear();
    cy.dataCy('btn-salvar').click();

    cy.location('pathname').should('eq', '/produtos/create');
    cy.dataCy('alerta-erros').should('be.visible');
    ['erro-nome', 'erro-categoria', 'erro-preco', 'erro-estoque', 'erro-estoque-minimo'].forEach((erro) => {
      cy.dataCy(erro).should('be.visible').invoke('text').should('not.be.empty');
    });
  });
});

describe('Produtos — valores inválidos', () => {
  beforeEach(() => {
    cy.visit('/produtos/create');
    cy.fixture('produto').then((produto) => cy.preencherProduto(produto));
    desligarValidacaoDoNavegador();
  });

  it('rejeita preço negativo', () => {
    cy.dataCy('campo-preco').clear().type('-5');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-preco').should('be.visible');
    cy.location('pathname').should('eq', '/produtos/create');
  });

  it('rejeita estoque negativo', () => {
    cy.dataCy('campo-estoque').clear().type('-3');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-estoque').should('be.visible');
  });

  it('rejeita estoque mínimo negativo', () => {
    cy.dataCy('campo-estoque-minimo').clear().type('-1');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-estoque-minimo').should('be.visible');
  });

  it('o campo numérico do navegador não aceita texto', () => {
    cy.dataCy('campo-preco').clear().type('abc');
    cy.dataCy('campo-preco').should('have.value', '');
  });

  it('rejeita texto no preço (enviado mesmo assim ao servidor)', () => {
    // transforma o input em texto para conseguir enviar "abc"
    cy.dataCy('campo-preco').invoke('attr', 'type', 'text').clear().type('abc');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-preco').should('be.visible');
  });

  it('rejeita texto no estoque (enviado mesmo assim ao servidor)', () => {
    cy.dataCy('campo-estoque').invoke('attr', 'type', 'text').clear().type('dez');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-estoque').should('be.visible');
  });

  it('mantém os valores digitados após o erro (old input)', () => {
    cy.dataCy('campo-preco').clear().type('-5');
    cy.dataCy('btn-salvar').click();
    cy.fixture('produto').then((produto) => {
      cy.dataCy('campo-nome').should('have.value', produto.nome);
    });
  });
});
