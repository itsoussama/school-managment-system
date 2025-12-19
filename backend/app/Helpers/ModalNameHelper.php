<?php

namespace App\Helpers;

class ModalNameHelper
{
    /**
     * get the modal name first letter
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @return void
     */
    public static function getModelFirstLetter($model)
    {
        return strtoupper(substr(class_basename($model), 0, 1));  // Example: 'U' for User
    }
}
