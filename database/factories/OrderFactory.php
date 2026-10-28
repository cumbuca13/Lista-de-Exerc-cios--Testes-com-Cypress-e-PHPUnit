<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'product_id' => Product::factory(),
            'quantity' => 1,
            'unit_price' => 10,
            'status' => 'pending',
        ];
    }
}
