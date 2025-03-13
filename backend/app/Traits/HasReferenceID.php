<?php

namespace App\Traits;

use App\Models\School;

trait HasReferenceID
{
    // Automatically run when a model using this trait is being created
    protected static function bootHasReferenceID()
    {
        static::creating(function ($record) {
            $record->ref = self::generateReferenceID($record);
        });
    }

    // Generates a reference ID for any model using this trait
    protected static function generateReferenceID($record)
    {
        // Ensure the school exists by passing a callable to resolve the school
        $school = self::resolveSchool($record);
        if (!$school) {
            throw new \Exception("School not found for record.");
        }

        // Generate ref if missing
        if (!$school->ref) {
            $school->ref = School::generateURN($school->name);
            $school->save();
        }

        // Determine the record type (first letter of the model name)
        $type = strtoupper(substr(class_basename($record), 0, 1)); // Example: 'S' for Student, 'F' for Fee

        // Generate a unique number for this school and record type
        $uniqueNum = str_pad(
            self::getUnique($record, $school),
            5,
            '0',
            STR_PAD_LEFT
        );

        return "{$school->ref}-{$type}{$uniqueNum}";
    }

    // Resolves the school, allowing a custom resolver function or direct relation
    protected static function resolveSchool($record)
    {
        // If a custom resolver is provided by the model, use that
        if (method_exists($record, 'getSchoolID')) {
            return $record->getSchoolID()->school;
        }

        // Default resolution (can be overridden by the model if needed)
        return $record->school ?? null;
    }

    // Get the unique count for the school and record type
    protected static function getUnique($record, $school)
    {
        if (method_exists($record, 'getSchoolID')) {
            $relationName = lcfirst(class_basename($record->getSchoolID()));
            return Self::whereHas($relationName, function ($query) use ($school) {
                $query->where('school_id', $school->id);
            })->count() + 1;
        }
        return Self::where('school_id', $school->id)->count() + 1;
    }
}
