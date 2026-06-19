<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Register dynamic routes for testing middleware
        Route::middleware(['web', 'auth', 'role:buyer'])->get('/_test/buyer', function () {
            return 'buyer-ok';
        });

        Route::middleware(['web', 'auth', 'role:joki'])->get('/_test/joki', function () {
            return 'joki-ok';
        });

        Route::middleware(['web', 'auth', 'role:admin'])->get('/_test/admin', function () {
            return 'admin-ok';
        });

        Route::middleware(['web', 'auth', 'role:buyer,admin'])->get('/_test/buyer-or-admin', function () {
            return 'buyer-or-admin-ok';
        });
    }

    public function test_guest_is_unauthorized(): void
    {
        $response = $this->get('/_test/buyer');
        $response->assertRedirect('/login');
    }

    /**
     * Test buyer role route access.
     */
    public function test_buyer_access(): void
    {
        $buyer = User::factory()->buyer()->create();
        $joki = User::factory()->joki()->create();

        // Buyer accessing buyer route
        $response = $this->actingAs($buyer)->get('/_test/buyer');
        $response->assertStatus(200);
        $this->assertEquals('buyer-ok', $response->getContent());

        // Joki accessing buyer route (Forbidden)
        $response = $this->actingAs($joki)->get('/_test/buyer');
        $response->assertStatus(403);
    }

    /**
     * Test joki role route access.
     */
    public function test_joki_access(): void
    {
        $joki = User::factory()->joki()->create();
        $buyer = User::factory()->buyer()->create();

        // Joki accessing joki route
        $response = $this->actingAs($joki)->get('/_test/joki');
        $response->assertStatus(200);
        $this->assertEquals('joki-ok', $response->getContent());

        // Buyer accessing joki route (Forbidden)
        $response = $this->actingAs($buyer)->get('/_test/joki');
        $response->assertStatus(403);
    }

    /**
     * Test admin role route access.
     */
    public function test_admin_access(): void
    {
        $admin = User::factory()->admin()->create();
        $buyer = User::factory()->buyer()->create();

        // Admin accessing admin route
        $response = $this->actingAs($admin)->get('/_test/admin');
        $response->assertStatus(200);
        $this->assertEquals('admin-ok', $response->getContent());

        // Buyer accessing admin route (Forbidden)
        $response = $this->actingAs($buyer)->get('/_test/admin');
        $response->assertStatus(403);
    }

    /**
     * Test routes that accept multiple roles.
     */
    public function test_multiple_roles_access(): void
    {
        $buyer = User::factory()->buyer()->create();
        $admin = User::factory()->admin()->create();
        $joki = User::factory()->joki()->create();

        // Buyer accessing multiple roles route
        $response = $this->actingAs($buyer)->get('/_test/buyer-or-admin');
        $response->assertStatus(200);
        $this->assertEquals('buyer-or-admin-ok', $response->getContent());

        // Admin accessing multiple roles route
        $response = $this->actingAs($admin)->get('/_test/buyer-or-admin');
        $response->assertStatus(200);
        $this->assertEquals('buyer-or-admin-ok', $response->getContent());

        // Joki accessing multiple roles route (Forbidden)
        $response = $this->actingAs($joki)->get('/_test/buyer-or-admin');
        $response->assertStatus(403);
    }
}
