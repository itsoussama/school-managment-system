<?php

namespace Database\Seeders;

use App\Models\MaintenanceRequest;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaintenanceRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MaintenanceRequest::factory(6)->create()->each(function($mr) {
            $userIds = User::pluck('id')->toArray();
            $mr->users()->attach($userIds[rand(0, count($userIds))]);
        });


        // foreach ($maintenanceRequests as $maintenanceRequest) {
        //     $maintenanceRequest->users()->attach(array_rand($userIds, rand(0, count($userIds))));
        // }
    }
}
