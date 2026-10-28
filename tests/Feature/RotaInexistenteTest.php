<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/** Exercício 25 — Rota inexistente. */
class RotaInexistenteTest extends TestCase
{
    use RefreshDatabase;

    public function test_rota_inexistente_retorna_404(): void
    {
        $this->get('/rota-que-nao-existe')->assertNotFound();
    }

    public function test_produto_inexistente_retorna_404(): void
    {
        $this->get('/produtos/999999/edit')->assertStatus(404);
    }
}
