<?php
use craft\helpers\App;

return [
    'useDevServer' => (bool) App::env('VITE_SERVER_ACTIVE'),
    'manifestPath' => '@webroot/dist/.vite/manifest.json',
    'devServerPublic' => (App::env('VITE_DDEV_URL') ?? App::env('PRIMARY_SITE_URL')) . ':3000',
    'serverPublic' => App::env('PRIMARY_SITE_URL') . '/dist/',
    'errorEntry' => '',
    'cacheKeySuffix' => '',
    'devServerInternal' => 'http://localhost:3000',
    'checkDevServer' => true,
    'includeReactRefreshShim' => false,
    'includeModulePreloadShim' => true,
    'criticalPath' => '@webroot/.vite/dist/criticalcss',
    'criticalSuffix' => '_critical.min.css',
];