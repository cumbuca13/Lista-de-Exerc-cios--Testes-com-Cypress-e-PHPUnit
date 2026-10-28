<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => 'Produto '.fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'category' => fake()->randomElement(['Bolos', 'Doces', 'Salgados', 'Bebidas']),
            'price' => fake()->randomFloat(2, 1, 200),
            'stock' => fake()->numberBetween(10, 50),
            'minimum_stock' => 5,
            'active' => true,
        ];
    }
}
