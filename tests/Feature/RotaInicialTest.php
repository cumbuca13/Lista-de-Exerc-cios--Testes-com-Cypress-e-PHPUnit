<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 22 — Rota inicial. */
class RotaInicialTest extends TestCase
{
    use RefreshDatabase;

    public function test_pagina_inicial_responde_200(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('Doce Gestão');
    }
}
