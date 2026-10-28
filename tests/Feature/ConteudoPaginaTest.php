<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 24 — Conteúdo da página. */
class ConteudoPaginaTest extends TestCase
{
    use RefreshDatabase;

    public function test_listagem_exibe_titulo_e_cabecalhos(): void
    {
        $this->get('/produtos')
            ->assertOk()
            ->assertSee('Produtos e estoque')
            ->assertSeeInOrder(['Produto', 'Categoria', 'Preço', 'Estoque']);
    }

    public function test_listagem_exibe_produto_criado_no_teste(): void
    {
        Product::create([
            'name' => 'Torta de limão',
            'category' => 'Doces',
            'price' => 49.9,
            'stock' => 8,
            'minimum_stock' => 2,
            'active' => true,
        ]);

        $this->get('/produtos')
            ->assertOk()
            ->assertSee('Torta de limão')
            ->assertSee('R$ 49,90');
    }

    public function test_listagem_vazia_exibe_mensagem(): void
    {
        $this->get('/produtos')->assertSee('Nenhum produto cadastrado.');
    }
}
