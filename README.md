# Doce Gestão — Testes com Cypress e PHPUnit

Projeto didático de uma confeitaria em Laravel 13 (Blade, Docker Compose e MySQL) com a resolução da
**Lista de Exercícios: Testes com Cypress e PHPUnit** — 20 exercícios de Cypress (E2E) e 10 de PHPUnit.

## Como rodar

### 1. Subir a aplicação (Docker)

Requisitos: Docker Desktop/OrbStack em execução.

```bash
./docker/install.sh
./docker/start.sh
```

Acesse http://localhost:8000. Logs: `docker compose logs -f app`.

### 2. PHPUnit (exercícios 21–30)

```bash
docker compose exec app php artisan test
# ou, com PHP 8.4 instalado localmente:
php artisan test
```

Os testes usam SQLite em memória (definido no `phpunit.xml`), então não mexem no banco MySQL.

Exercício 21 — para ver a falha proposital do `assertFalse(true)`:

```bash
MOSTRAR_FALHA=1 php artisan test --filter=PrimeiroTesteTest
```

### 3. Cypress (exercícios 1–20)

Com a aplicação rodando em http://localhost:8000:

```bash
npm install
npm run cy:install   # baixa o binário do Cypress (o .npmrc do projeto usa ignore-scripts=true)
npm run cy:open      # modo interativo  (npx cypress open)
npm run cy:run       # modo headless    (npx cypress run)
```

Antes de cada arquivo de teste, a task `db:reset` roda
`docker compose exec -T app php artisan migrate:fresh --seed --force`, então todos os testes começam
com os dados do seed. **Isso apaga os dados do banco de desenvolvimento.**

Sem Docker (servidor com `php artisan serve`), troque o comando:

```bash
CYPRESS_DB_RESET_COMMAND="php artisan migrate:fresh --seed --force" npx cypress run
```

Para não recriar o banco: `CYPRESS_SKIP_DB_RESET=true npx cypress run`.

### Integração contínua

`.github/workflows/testes.yml` roda as duas suítes no GitHub Actions a cada push (PHP 8.4 + SQLite).

## Onde está cada exercício

### Parte 1 — Cypress

| # | Exercício | Arquivo |
|---|-----------|---------|
| 1 | Configuração e `baseUrl` | `cypress.config.js`, `package.json` |
| 2 | Página inicial | `cypress/e2e/home.cy.js` |
| 3 | Navegação pelo menu | `cypress/e2e/navegacao.cy.js` |
| 4 | Listagem de produtos | `cypress/e2e/produtos-listagem.cy.js` |
| 5 | Formulário de novo produto | `cypress/e2e/produtos-listagem.cy.js` |
| 6 | Seletores `data-cy`, `describe`/`it`/`beforeEach` | `resources/views/**` + todos os specs |
| 7 | Cadastro de produto | `cypress/e2e/produtos-cadastro.cy.js` |
| 8 | Formulário vazio | `cypress/e2e/produtos-cadastro.cy.js` |
| 9 | Valores inválidos (um `it` por cenário) | `cypress/e2e/produtos-cadastro.cy.js` |
| 10 | Edição de produto | `cypress/e2e/produtos-edicao-exclusao.cy.js` |
| 11 | Exclusão (com `window:confirm`) | `cypress/e2e/produtos-edicao-exclusao.cy.js` |
| 12 | CRUD de clientes | `cypress/e2e/clientes.cy.js` |
| 13 | Alerta de estoque baixo | `cypress/e2e/estoque-baixo.cy.js` |
| 14 | Fixtures | `cypress/fixtures/produto.json`, `cliente.json` |
| 15 | Comandos customizados | `cypress/support/commands.js` |
| 16 | Paginação | `cypress/e2e/paginacao.cy.js` |
| 17 | Fluxo de pedido e baixa de estoque | `cypress/e2e/pedidos.cy.js` |
| 18 | Estoque insuficiente | `cypress/e2e/pedidos.cy.js` |
| 19 | Fluxo de frete | `cypress/e2e/fretes.cy.js` |
| 20 | `cy.intercept`, task `migrate:fresh --seed` e E2E | `cypress/e2e/e2e-completo.cy.js`, `cypress.config.js`, `cypress/support/e2e.js` |

Comandos criados no exercício 15: `cy.criarProduto(dados)`, `cy.criarCliente(dados)`, `cy.criarPedido(...)`,
`cy.lerEstoque(nome)`, `cy.preencherProduto(dados)`, `cy.preencherCliente(dados)`,
`cy.selecionarOpcaoContendo(campo, texto)` e o atalho `cy.dataCy('seletor')`.

### Parte 2 — PHPUnit

| # | Exercício | Arquivo |
|---|-----------|---------|
| 21 | Primeiro teste (`assertTrue` / `assertFalse`) | `tests/Unit/PrimeiroTesteTest.php` |
| 22 | Rota inicial | `tests/Feature/RotaInicialTest.php` |
| 23 | Rotas dos módulos | `tests/Feature/RotasModulosTest.php` |
| 24 | Conteúdo da página (`assertSee`) | `tests/Feature/ConteudoPaginaTest.php` |
| 25 | Rota inexistente (404) | `tests/Feature/RotaInexistenteTest.php` |
| 26 | `RefreshDatabase` + `assertDatabaseHas` | `tests/Feature/ProdutoBancoTest.php` |
| 27 | Cadastro via POST | `tests/Feature/CadastroClienteTest.php` |
| 28 | Validação (`assertSessionHasErrors`) | `tests/Feature/ValidacaoProdutoTest.php` |
| 29 | Atualização (PUT) e exclusão (DELETE) | `tests/Feature/AtualizacaoExclusaoTest.php` |
| 30 | Baixa de estoque (10 − 3 = 7) e pedido acima do estoque | `tests/Feature/BaixaEstoqueTest.php` |

## Alterações feitas na aplicação

- **Views Blade:** atributos `data-cy` em menu, tabelas, linhas, campos, botões, alertas e paginação;
  mensagem de erro abaixo de cada campo (`erro-nome`, `erro-preco`, ...); badge **"⚠ Estoque baixo"** e classe
  `estoque-baixo` quando o estoque fica no mínimo ou abaixo dele; coluna de rastreio na listagem de fretes.
- **Factories:** `ProductFactory`, `CustomerFactory`, `OrderFactory` e `DeliveryFactory` (e `HasFactory` nos models).
- **Controllers:** as listagens desempatam por `id` (`latest()->orderByDesc('id')`), para que a paginação
  tenha ordem fixa quando vários registros são criados no mesmo segundo.

## Módulos da aplicação

- **Produtos e estoque:** categoria em select, preço, estoque mínimo e alerta visual de estoque baixo.
- **Clientes:** dados de contato e endereço.
- **Pedidos/vendas:** selects de cliente e produto, status, validação de estoque e baixa automática na criação.
- **Fretes/entregas:** pedido, endereço, taxa, data prevista, rastreio e status.

Rotas: `/produtos`, `/clientes`, `/pedidos` e `/entregas` (o menu chama esta última de "Fretes").
