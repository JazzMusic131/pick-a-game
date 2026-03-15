<?php

namespace modules\pickagame\controllers;

use Craft;
use craft\web\Controller;
use craft\web\Request;
use yii\web\Response;

use modules\pickagame\services\PickService;

/**
 * Pick controller
 */
class PickController extends Controller
{
    public $defaultAction = 'index';
    protected array|int|bool $allowAnonymous = self::ALLOW_ANONYMOUS_NEVER;

    public function beforeAction($action): bool
    {
        if ($action->id === 'index') {
            $this->enableCsrfValidation = false;
        }
        return parent::beforeAction($action);
    }

    /**
     * pick-a-game/pick action
     */
    public function actionIndex(Request $request): Response
    {

        $this->requirePostRequest();
        $params = $request->getBodyParams();

        if (isset($params['gamerId'])) {

            $game = PickService::getAGame($params['gamerId']);
            if ($game) {
                $response = [
                    'status' => 'success',
                    'game' => [
                        'steamId' => $game->steamId,
                        'title' => $game->title,
                        'releaseYear' => $game->releaseDate ? $game->releaseDate->format('Y') : false,
                        'steamUserScore' => $game->steamUserScore,
                        'steamUserScoreCount' => $game->userScoreCount,
                        'wilsonScore' => $game->wilsonScore,
                        'sdbRating' => $game->sdbRating,
                    ],
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => "Error retrieving a game to play. Work on it."
                ];
            }

        } else {
            $response = [
                'status' => 'error',
                'message' => "No gamer ID selected."
            ];
        }

        return $this->asJson($response);

    }
}
