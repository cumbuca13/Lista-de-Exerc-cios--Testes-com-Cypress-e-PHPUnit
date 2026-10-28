<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/** Exercício 28 — Validação de dados. */
class ValidacaoProdutoTest extends TestCase
{
    use RefreshDatabase;

    private function dadosValidos(array $sobrescrever = []): array
    {
        return array_merge([
            'name' => 'Quindim',
            'category' => 'Doces',
            'price' => 5,
            'stock' => 20,
            'minimum_stock' => 5,
        ], $sobrescrever);
    }

    public function test_produto_sem_nome_retorna_erro(): void
    {
        $dados = $this->dadosValidos();
        unset($dados['name']);

        $this->from(route('produtos.create'))
            ->post(route('produtos.store'), $dados)
            ->assertRedirect(route('produtos.create'))
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('products', 0);
    }

    public static function precosInvalidos(): array
    {
        return [
            'negativo' => [-10],
            'texto' => ['abc'],
            'vazio' => [''],
        ];
    }

    #[DataProvider('precosInvalidos')]
    public function test_preco_invalido_retorna_erro(mixed $preco): void
    {
        $this->post(route('produtos.store'), $this->dadosValidos(['price' => $preco]))
            ->assertSessionHasErrors('price');

        $this->assertDatabaseCount('products', 0);
    }

    public function test_categoria_fora_da_lista_retorna_erro(): void
    {
        $this->post(route('produtos.store'), $this->dadosValidos(['category' => 'Pizzas']))
            ->assertSessionHasErrors('category');
    }

    public function test_estoque_negativo_retorna_erro(): void
    {
        $this->post(route('produtos.store'), $this->dadosValidos(['stock' => -1]))
            ->assertSessionHasErrors('stock');
    }

    public function test_dados_validos_nao_geram_erro(): void
    {
        $this->post(route('produtos.store'), $this->dadosValidos())
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('produtos.index'));

        $this->assertDatabaseHas('products', ['name' => 'Quindim']);
    }
}
