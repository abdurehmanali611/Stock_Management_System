<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\BusinessMan;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Business>
 */
class BusinessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => BusinessMan::factory(),
            'business_name' => $this->faker->company(),
            'business_type' => $this->faker->randomElement(['Retail', 'Manufacturing', 'Importer', 'Distribter', 'Exporter', 'Service Provider']),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'ETB', 'AUD', 'CAD']),
            'admin_name' => $this->faker->name(),
        ];
    }
}
