// Exercícios 17 e 18 — Fluxo completo de pedido e estoque insuficiente
describe('Pedidos — fluxo completo com baixa de estoque', () => {
  it('cria cliente e produto, registra o pedido e baixa o estoque', () => {
    const quantidade = 3;

    cy.criarCliente().then((cliente) => {
      cy.criarProduto({ estoque: 10, preco: 20 }).then((produto) => {
        cy.lerEstoque(produto.nome).should('eq', 10).as('estoqueAntes');

        cy.visit('/pedidos');
        cy.dataCy('btn-novo-pedido').click();
        cy.selecionarOpcaoContendo('campo-cliente', cliente.nome);
        cy.selecionarOpcaoContendo('campo-produto', produto.nome);
        cy.dataCy('campo-quantidade').clear().type(String(quantidade));
        cy.dataCy('campo-status').select('confirmed');
        cy.dataCy('btn-salvar').click();

        cy.location('pathname').should('eq', '/pedidos');
        cy.dataCy('alerta-sucesso').should('have.text', 'Pedido criado e estoque atualizado.');
        cy.contains('[data-cy="linha-pedido"]', cliente.nome).within(() => {
          cy.dataCy('pedido-produto').should('contain', `${produto.nome} (${quantidade})`);
          cy.dataCy('pedido-total').should('have.text', 'R$ 60,00');
          cy.dataCy('pedido-status').should('have.text', 'confirmed');
        });

        cy.get('@estoqueAntes').then((antes) => {
          cy.lerEstoque(produto.nome).should('eq', antes - quantidade);
        });
      });
    });
  });
});

describe('Pedidos — estoque insuficiente', () => {
  it('não cria o pedido quando a quantidade é maior que o estoque', () => {
    cy.criarCliente().then((cliente) => {
      cy.criarProduto({ estoque: 5 }).then((produto) => {
        cy.visit('/pedidos');
        cy.dataCy('linha-pedido').should('not.exist');

        cy.visit('/pedidos/create');
        cy.selecionarOpcaoContendo('campo-cliente', cliente.nome);
        cy.selecionarOpcaoContendo('campo-produto', produto.nome);
        cy.dataCy('campo-quantidade').clear().type('6');
        cy.dataCy('btn-salvar').click();

        cy.location('pathname').should('eq', '/pedidos/create');
        cy.dataCy('erro-quantidade').should('have.text', 'Estoque insuficiente para este produto.');
        cy.dataCy('campo-quantidade').should('have.value', '6');

        cy.visit('/pedidos');
        cy.dataCy('tabela-vazia').should('be.visible');
        cy.lerEstoque(produto.nome).should('eq', 5);
      });
    });
  });
});
