<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Exercício 21 — Primeiro teste.
 *
 * O primeiro método sempre passa. O segundo é a versão com assertFalse(true),
 * que FALHA de propósito. Ele fica pulado por padrão para não quebrar a suíte;
 * para ver a falha, rode:
 *
 *   MOSTRAR_FALHA=1 php artisan test --filter=PrimeiroTesteTest
 */
class PrimeiroTesteTest extends TestCase
{
    public function test_assert_true_passa(): void
    {
        $this->assertTrue(true);
    }

    public function test_assert_false_com_true_falha(): void
    {
        if (! getenv('MOSTRAR_FALHA')) {
            $this->markTestSkipped('Falha proposital desativada. Use MOSTRAR_FALHA=1 para observar a falha.');
        }

        $this->assertFalse(true);
    }
}
