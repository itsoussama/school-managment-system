<?php

namespace Database\Seeders;

use App\Models\MaintenanceRequest;
use App\Models\resource;
use App\Models\School;
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
        $schools = School::all();
        foreach ($schools as $school) {
            MaintenanceRequest::factory(6)->create([
                'school_id' => $school->id,
            ])->each(function ($mr) {
                $userIds = User::pluck('id')->toArray();

                $resource_ids = resource::pluck('id')->toArray();
                $mr->resource_id = $resource_ids[rand(0, count($resource_ids))] ? $resource_ids[rand(0, count($resource_ids))] : null;
                $mr->save();
                $mr->users()->attach($userIds[rand(0, count($userIds))]);
            });
        }



        // foreach ($maintenanceRequests as $maintenanceRequest) {
        //     $maintenanceRequest->users()->attach(array_rand($userIds, rand(0, count($userIds))));
        // }
    }
}
