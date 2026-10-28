<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 26 — Banco de dados com RefreshDatabase. */
class ProdutoBancoTest extends TestCase
{
    use RefreshDatabase;

    public function test_cria_produto_com_model_create(): void
    {
        Product::create([
            'name' => 'Pão de mel',
            'category' => 'Doces',
            'price' => 7.5,
            'stock' => 40,
            'minimum_stock' => 10,
            'active' => true,
        ]);

        $this->assertDatabaseHas('products', ['name' => 'Pão de mel', 'stock' => 40]);
        $this->assertDatabaseCount('products', 1);
    }

    public function test_cria_produto_com_factory(): void
    {
        $produto = Product::factory()->create(['name' => 'Bolo de cenoura', 'category' => 'Bolos']);

        $this->assertDatabaseHas('products', ['id' => $produto->id, 'name' => 'Bolo de cenoura', 'category' => 'Bolos']);
    }

    public function test_banco_comeca_vazio_em_cada_teste(): void
    {
        // RefreshDatabase desfaz o que os outros testes gravaram.
        $this->assertDatabaseCount('products', 0);
    }
}
