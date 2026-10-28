<?php

namespace Database\Factories;

use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Delivery>
 */
class DeliveryFactory extends Factory
{
    protected $model = Delivery::class;

    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'fee' => 15,
            'scheduled_at' => now()->addDays(2)->toDateString(),
            'status' => 'scheduled',
            'tracking_code' => strtoupper(fake()->bothify('BR#########')),
        ];
    }
}
