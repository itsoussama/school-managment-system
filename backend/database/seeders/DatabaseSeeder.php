<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
        /**
         * Seed the application's database.
         */
        public function run(): void
        {
                // User::factory(10)->create();

                $this->call(SchoolSeeder::class);
                // $this->call(UserSeeder::class);
                // $this->call(RoleSeeder::class);
                $this->call(StageSeeder::class);
                $this->call(SubjectSeeder::class);
                // $this->call(SubjectUserSeeder::class);
                $this->call(GradeSeeder::class);
                $this->call(SubjectGradeSeeder::class);
                // $this->call(StageGradesSeeder::class);
                $this->call(UserRoleSeeder::class);
                $this->call(ParentsSeeder::class);
                $this->call(ResourceSeeder::class);
                $this->call(MaintenanceRequestSeeder::class);
                $this->call(EventSeeder::class,);
                $this->call(ClassRoomSeeder::class);
                $this->call(GroupSeeder::class);
                $this->call(StudentSeeder::class);
                $this->call(TeacherSeeder::class);
                $this->call(CalendarSeeder::class);
        }
}
