<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 29 — Atualização e exclusão. */
class AtualizacaoExclusaoTest extends TestCase
{
    use RefreshDatabase;

    public function test_atualiza_preco_do_produto_com_put(): void
    {
        $produto = Product::factory()->create(['name' => 'Bolo de fubá', 'category' => 'Bolos', 'price' => 30]);

        $this->put(route('produtos.update', $produto), [
            'name' => 'Bolo de fubá',
            'category' => 'Bolos',
            'price' => 35.5,
            'stock' => $produto->stock,
            'minimum_stock' => $produto->minimum_stock,
            'active' => 1,
        ])->assertRedirect(route('produtos.index'))->assertSessionHasNoErrors();

        $this->assertDatabaseHas('products', ['id' => $produto->id, 'price' => 35.5]);
        $this->assertDatabaseMissing('products', ['id' => $produto->id, 'price' => 30]);
    }

    public function test_exclui_cliente_com_delete(): void
    {
        $cliente = Customer::factory()->create(['name' => 'Cliente Temporário']);

        $this->delete(route('clientes.destroy', $cliente))
            ->assertRedirect(route('clientes.index'))
            ->assertSessionHas('success', 'Cliente removido.');

        $this->assertDatabaseMissing('customers', ['id' => $cliente->id]);
    }
}
