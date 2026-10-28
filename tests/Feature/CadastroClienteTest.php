<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 27 — Cadastro via POST. */
class CadastroClienteTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_valido_cria_cliente_e_redireciona(): void
    {
        $dados = [
            'name' => 'Ana Paula',
            'email' => 'ana@example.com',
            'phone' => '(41) 99999-0000',
            'address' => 'Rua XV de Novembro, 10',
            'city' => 'Curitiba',
        ];

        $response = $this->post(route('clientes.store'), $dados);

        $response->assertRedirect(route('clientes.index'));
        $response->assertSessionHas('success', 'Cliente cadastrado com sucesso.');
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('customers', $dados);
    }

    public function test_post_sem_nome_nao_cria_cliente(): void
    {
        $this->post(route('clientes.store'), ['email' => 'sem-nome@example.com'])
            ->assertSessionHasErrors('name');

        $this->assertDatabaseMissing('customers', ['email' => 'sem-nome@example.com']);
    }
}
