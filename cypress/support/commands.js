// Exercício 15 — Comandos customizados.
import { unico } from './utils';

// Atalho para seletores estáveis: cy.dataCy('btn-salvar')
Cypress.Commands.add('dataCy', (valor, opcoes) => cy.get(`[data-cy="${valor}"]`, opcoes));

// Seleciona em um <select> a opção cujo texto contém `texto`
Cypress.Commands.add('selecionarOpcaoContendo', (campo, texto) => {
  cy.dataCy(campo)
    .contains('option', texto)
    .then(($opcao) => {
      cy.dataCy(campo).select($opcao.val());
    });
});

// Preenche o formulário de produto (sem enviar). Só preenche as chaves informadas.
Cypress.Commands.add('preencherProduto', (produto) => {
  if (produto.nome !== undefined) cy.dataCy('campo-nome').clear().type(produto.nome);
  if (produto.categoria !== undefined) cy.dataCy('campo-categoria').select(produto.categoria);
  if (produto.descricao !== undefined) cy.dataCy('campo-descricao').clear().type(produto.descricao);
  if (produto.preco !== undefined) cy.dataCy('campo-preco').clear().type(String(produto.preco));
  if (produto.estoque !== undefined) cy.dataCy('campo-estoque').clear().type(String(produto.estoque));
  if (produto.estoqueMinimo !== undefined) {
    cy.dataCy('campo-estoque-minimo').clear().type(String(produto.estoqueMinimo));
  }
});

// Cria um produto pela interface e devolve os dados usados.
// Ex.: cy.criarProduto({ nome: 'Pudim', estoque: 3 }).then((produto) => ...)
Cypress.Commands.add('criarProduto', (dados = {}) => {
  const produto = {
    nome: unico('Produto'),
    categoria: 'Doces',
    preco: 10,
    estoque: 10,
    estoqueMinimo: 5,
    ...dados,
  };

  cy.visit('/produtos/create');
  cy.preencherProduto(produto);
  cy.dataCy('btn-salvar').click();
  cy.location('pathname').should('eq', '/produtos');
  cy.dataCy('alerta-sucesso').should('contain', 'Produto cadastrado com sucesso.');

  return cy.wrap(produto);
});

// Preenche o formulário de cliente (sem enviar)
Cypress.Commands.add('preencherCliente', (cliente) => {
  const campos = { nome: 'campo-nome', email: 'campo-email', telefone: 'campo-telefone', endereco: 'campo-endereco', cidade: 'campo-cidade' };
  Object.entries(campos).forEach(([chave, campo]) => {
    if (cliente[chave] !== undefined) cy.dataCy(campo).clear().type(cliente[chave]);
  });
});

// Cria um cliente pela interface e devolve os dados usados
Cypress.Commands.add('criarCliente', (dados = {}) => {
  const cliente = {
    nome: unico('Cliente'),
    email: `cliente${Date.now()}@example.com`,
    telefone: '(11) 90000-0000',
    endereco: 'Rua dos Testes, 123',
    cidade: 'São Paulo',
    ...dados,
  };

  cy.visit('/clientes/create');
  cy.preencherCliente(cliente);
  cy.dataCy('btn-salvar').click();
  cy.location('pathname').should('eq', '/clientes');
  cy.dataCy('alerta-sucesso').should('contain', 'Cliente cadastrado com sucesso.');

  return cy.wrap(cliente);
});

// Cria um pedido e devolve o id dele (lido da listagem)
Cypress.Commands.add('criarPedido', ({ cliente, produto, quantidade = 1, status = 'pending' }) => {
  cy.visit('/pedidos/create');
  cy.selecionarOpcaoContendo('campo-cliente', cliente);
  cy.selecionarOpcaoContendo('campo-produto', produto);
  cy.dataCy('campo-quantidade').clear().type(String(quantidade));
  cy.dataCy('campo-status').select(status);
  cy.dataCy('btn-salvar').click();
  cy.location('pathname').should('eq', '/pedidos');
  cy.dataCy('alerta-sucesso').should('contain', 'Pedido criado e estoque atualizado.');

  return cy.contains('[data-cy="linha-pedido"]', cliente).invoke('attr', 'data-id');
});

// Lê o estoque atual de um produto na listagem (data-estoque do badge)
Cypress.Commands.add('lerEstoque', (nomeProduto) => {
  cy.visit('/produtos');
  return cy
    .contains('[data-cy="linha-produto"]', nomeProduto)
    .find('[data-cy="produto-estoque"]')
    .invoke('attr', 'data-estoque')
    .then(Number);
});
