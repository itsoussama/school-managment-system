<?php

namespace App\Helpers;

use Carbon\Carbon;

class ReferenceIDHelper
{
    /**
     * Generate a reference ID based on the model's school.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param \App\Models\School $school
     * @param string $type
     * @return string
     * @throws \Exception
     */
    public static function generateReferenceID($model, $relationModel = null, $school, $type)
    {
        // Ensure the school exists
        if (!$school) {
            throw new \Exception("School not found for model.");
        }

        // Determine relation name if applicable
        $relationName = $relationModel ? lcfirst(class_basename($relationModel)) : null;

        // Count existing records based on relationship
        // $countModel = $relationModel
        //     ? $model::whereHas($relationName, fn($query) => $query->where('school_id', $school->id))->count() + 1
        //     : $model::where('school_id', $school->id)->count() + 1;

        // Generate the unique number for the school and model type
        $uniqueNum = strtoupper(substr(md5(microtime()), 0, 4));
        // str_pad($countModel, 5, '0', STR_PAD_LEFT);

        // Ensure required values exist before formatting reference
        if (empty($school->ref) || empty($type)) {
            throw new \Exception("Missing required reference components.");
        }
        // Return the formatted reference ID
        return "{$school->ref}-{$type}{$uniqueNum}";
    }

    /**
     * Set the reference ID for a model before saving.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @return void
     */
    public static function setReferenceID($model, $relationship = null)
    {

        $school = ($relationship ?? $model)->school;

        $type = ModalNameHelper::getModelFirstLetter($model);  // Example: 'U' for User
        $model->ref = self::generateReferenceID($model, $relationship, $school, $type);
    }
}
