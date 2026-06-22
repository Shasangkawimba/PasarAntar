<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\EnsureUserIsActive::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        // Pengecualian CSRF untuk automasi testing (TestSprite) di environment local/testing
        $appEnv = env('APP_ENV', 'production');
        if ($appEnv === 'local' || $appEnv === 'testing') {
            $middleware->validateCsrfTokens(except: [
                '*'
            ]);
        }
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (\App\Exceptions\InvalidStatusTransitionException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
            return back()->withErrors(['status' => $e->getMessage()]);
        });

        $exceptions->render(function (\App\Exceptions\UnauthorizedAssignmentException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
            return abort(403, $e->getMessage());
        });

        $exceptions->render(function (\App\Exceptions\SettlementValidationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
            return back()->withErrors(['status' => $e->getMessage()]);
        });

        $exceptions->render(function (\App\Exceptions\AggregationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
            return back()->withErrors(['status' => $e->getMessage()]);
        });
    })->create();
