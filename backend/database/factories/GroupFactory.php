<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Grade;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroupFactory extends Factory
{
    protected $model = Group::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'grade_id' => Grade::inRandomOrder()->first()->id,
            'school_id' => School::inRandomOrder()->first()->id,
        ];
    }
}
