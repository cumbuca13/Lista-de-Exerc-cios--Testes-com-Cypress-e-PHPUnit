<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/** Exercício 23 — Rotas dos módulos. */
class RotasModulosTest extends TestCase
{
    use RefreshDatabase;

    public static function listagens(): array
    {
        return [
            'produtos' => ['produtos.index', '/produtos'],
            'clientes' => ['clientes.index', '/clientes'],
            'pedidos' => ['pedidos.index', '/pedidos'],
            'fretes' => ['entregas.index', '/entregas'],
        ];
    }

    #[DataProvider('listagens')]
    public function test_listagem_responde_200(string $rota, string $url): void
    {
        $this->assertSame(url($url), route($rota));

        $this->get(route($rota))->assertStatus(200);
    }

    public function test_paginas_de_criacao_respondem_200(): void
    {
        foreach (['produtos.create', 'clientes.create', 'pedidos.create', 'entregas.create'] as $rota) {
            $this->get(route($rota))->assertOk();
        }
    }
}
