<?php

namespace App\Traits;

use Carbon\Carbon;
use DateTimeInterface;

trait SerializesLocalDates
{
    protected function serializeDate(DateTimeInterface $date): string
    {
        return Carbon::instance($date)->setTimezone(config('app.timezone'))->format('Y-m-d\TH:i:sP');
    }
}
