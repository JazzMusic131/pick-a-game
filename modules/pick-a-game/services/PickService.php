<?php

namespace modules\pickagame\services;

use Craft;
use yii\base\Component;

use craft\elements\Entry;

/**
 * Pick Service service
 */
class PickService extends Component
{

    public static function getAGame($gamerId)
    {

        $gameQuery = Entry::find()
            ->section('games')
            ->hoursPlayed(0)
            ->wasPicked(false)
            ->orderBy('RAND()')
            ->limit(1)
        ;

        return $gameQuery->one();

    }

}
