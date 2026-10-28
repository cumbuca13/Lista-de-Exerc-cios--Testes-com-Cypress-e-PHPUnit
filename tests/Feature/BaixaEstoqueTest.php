<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 30 — Baixa de estoque. */
class BaixaEstoqueTest extends TestCase
{
    use RefreshDatabase;

    private Customer $cliente;

    private Product $produto;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cliente = Customer::factory()->create();
        $this->produto = Product::factory()->create(['stock' => 10, 'price' => 12]);
    }

    public function test_pedido_de_3_unidades_deixa_estoque_em_7(): void
    {
        $this->post(route('pedidos.store'), [
            'customer_id' => $this->cliente->id,
            'product_id' => $this->produto->id,
            'quantity' => 3,
            'status' => 'pending',
        ])->assertRedirect(route('pedidos.index'))->assertSessionHasNoErrors();

        $this->assertSame(7, $this->produto->fresh()->stock);
        $this->assertDatabaseHas('orders', [
            'customer_id' => $this->cliente->id,
            'product_id' => $this->produto->id,
            'quantity' => 3,
            'unit_price' => 12,
        ]);
    }

    public function test_pedido_maior_que_estoque_nao_e_criado(): void
    {
        $this->from(route('pedidos.create'))->post(route('pedidos.store'), [
            'customer_id' => $this->cliente->id,
            'product_id' => $this->produto->id,
            'quantity' => 11,
            'status' => 'pending',
        ])->assertRedirect(route('pedidos.create'))
            ->assertSessionHasErrors(['quantity' => 'Estoque insuficiente para este produto.']);

        $this->assertDatabaseCount('orders', 0);
        $this->assertSame(10, $this->produto->fresh()->stock);
    }
}
