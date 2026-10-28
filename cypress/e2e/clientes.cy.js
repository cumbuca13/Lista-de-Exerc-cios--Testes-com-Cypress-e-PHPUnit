// Exercício 12 — CRUD de clientes (dados da fixture cliente.json, Exercício 14)
describe('Clientes — CRUD', () => {
  beforeEach(function () {
    cy.fixture('cliente').as('cliente');
  });

  it('cria, edita e exclui um cliente', function () {
    const { edicao, ...cliente } = this.cliente;

    // Criar
    cy.visit('/clientes');
    cy.dataCy('btn-novo-cliente').click();
    cy.url().should('include', '/clientes/create');
    cy.preencherCliente(cliente);
    cy.dataCy('btn-salvar').click();

    cy.dataCy('alerta-sucesso').should('have.text', 'Cliente cadastrado com sucesso.');
    cy.contains('[data-cy="linha-cliente"]', cliente.nome).within(() => {
      cy.dataCy('cliente-contato').should('contain', cliente.email).and('contain', cliente.telefone);
      cy.dataCy('cliente-endereco').should('contain', cliente.endereco).and('contain', cliente.cidade);
    });

    // Editar
    cy.contains('[data-cy="linha-cliente"]', cliente.nome).find('[data-cy="btn-editar"]').click();
    cy.dataCy('campo-nome').should('have.value', cliente.nome);
    cy.preencherCliente(edicao);
    cy.dataCy('btn-salvar').click();

    cy.dataCy('alerta-sucesso').should('have.text', 'Cliente atualizado com sucesso.');
    cy.contains('[data-cy="linha-cliente"]', cliente.nome).within(() => {
      cy.dataCy('cliente-contato').should('contain', edicao.telefone);
      cy.dataCy('cliente-endereco').should('contain', edicao.endereco).and('contain', edicao.cidade);
    });

    // Excluir
    cy.on('window:confirm', () => true);
    cy.contains('[data-cy="linha-cliente"]', cliente.nome).find('[data-cy="btn-excluir"]').click();
    cy.dataCy('alerta-sucesso').should('have.text', 'Cliente removido.');
    cy.dataCy('tabela-clientes').should('not.contain', cliente.nome);
  });

  it('não cadastra cliente sem nome', () => {
    cy.visit('/clientes/create');
    cy.dataCy('form-cliente').invoke('attr', 'novalidate', 'novalidate');
    cy.dataCy('campo-email').type('sem.nome@example.com');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-nome').should('be.visible');
  });

  it('valida o formato do e-mail', () => {
    cy.visit('/clientes/create');
    cy.dataCy('form-cliente').invoke('attr', 'novalidate', 'novalidate');
    cy.dataCy('campo-nome').type('Cliente E-mail Inválido');
    cy.dataCy('campo-email').type('email-invalido');
    cy.dataCy('btn-salvar').click();
    cy.dataCy('erro-email').should('be.visible');
  });
});
