<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToModel, WithHeadingRow
{

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (empty(Arr::get($row, 'name')) && empty(Arr::get($row, 'email'))) {
            return null;
        };
            $validator = Validator::make($row, [
                'name' => 'required|string',
            ]);

            if ($validator->fails()) {
                // Handle the validation failure
                // You can log the error or throw an exception
                throw new ValidationException($validator);
            }


            return new User([
                'name' => $row['name'],
                'email' => $row['email'],
            ]);

    }
}
