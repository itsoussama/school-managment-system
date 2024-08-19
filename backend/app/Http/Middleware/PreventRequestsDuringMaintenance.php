<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    // Handle requests during maintenance mode
}
