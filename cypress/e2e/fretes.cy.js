// Exercício 19 — Fluxo de frete
const linhaDaEntrega = (pedidoId) => cy.get(`[data-cy="linha-entrega"][data-pedido="${pedidoId}"]`);

describe('Fretes — cadastro e atualização de status', () => {
  it('cria um frete para um pedido e atualiza o status até a entrega', () => {
    const frete = { endereco: 'Rua do Frete, 42', cidade: 'Campinas', taxa: '15.90', data: '2026-12-20', rastreio: 'BR123456789' };

    cy.criarCliente().then((cliente) => {
      cy.criarProduto().then((produto) => {
        cy.criarPedido({ cliente: cliente.nome, produto: produto.nome, quantidade: 2 }).then((pedidoId) => {
          // Cadastro
          cy.visit('/entregas');
          cy.dataCy('btn-nova-entrega').click();
          cy.dataCy('campo-pedido').select(pedidoId);
          cy.dataCy('campo-endereco').type(frete.endereco);
          cy.dataCy('campo-cidade').type(frete.cidade);
          cy.dataCy('campo-taxa').clear().type(frete.taxa);
          cy.dataCy('campo-data-prevista').type(frete.data);
          cy.dataCy('campo-rastreio').type(frete.rastreio);
          cy.dataCy('campo-status').should('have.value', 'scheduled');
          cy.dataCy('btn-salvar').click();

          cy.dataCy('alerta-sucesso').should('have.text', 'Entrega cadastrada.');
          linhaDaEntrega(pedidoId).within(() => {
            cy.dataCy('entrega-cliente').should('have.text', cliente.nome);
            cy.dataCy('entrega-destino').should('have.text', `${frete.endereco}, ${frete.cidade}`);
            cy.dataCy('entrega-taxa').should('have.text', 'R$ 15,90');
            cy.dataCy('entrega-data').should('have.text', '20/12/2026');
            cy.dataCy('entrega-rastreio').should('have.text', frete.rastreio);
            cy.dataCy('entrega-status').should('have.text', 'scheduled');
          });

          // Atualizações de status: agendada → em trânsito → entregue
          ['in_transit', 'delivered'].forEach((status) => {
            linhaDaEntrega(pedidoId).find('[data-cy="btn-editar"]').click();
            cy.dataCy('campo-status').select(status);
            cy.dataCy('btn-salvar').click();

            cy.dataCy('alerta-sucesso').should('have.text', 'Entrega atualizada.');
            linhaDaEntrega(pedidoId).find('[data-cy="entrega-status"]').should('have.text', status);
          });

          // Um pedido com frete não aparece mais para um novo frete
          cy.visit('/entregas/create');
          cy.dataCy('campo-pedido').find(`option[value="${pedidoId}"]`).should('not.exist');
        });
      });
    });
  });
});
