<?php

use App\Models\Property;

beforeEach(function () {
    Property::create([
        'title' => 'Test Penthouse',
        'slug' => 'test-penthouse',
        'description' => 'Luxury living',
        'price' => 2500000,
        'property_type' => 'Penthouse',
        'status' => 'available',
        'bedrooms' => 3,
        'bathrooms' => 3,
        'area_sqft' => 2500,
        'location' => 'Downtown Dubai',
        'address' => 'Downtown',
        'image_url' => 'https://example.com/image.jpg',
        'is_featured' => true,
    ]);
});

test('api can fetch list of properties', function () {
    $response = $this->getJson('/api/properties');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'count',
            'data' => [
                '*' => ['id', 'title', 'price', 'location', 'property_type'],
            ],
        ]);
});

test('api can fetch single property by id and slug', function () {
    $property = Property::first();

    $response = $this->getJson("/api/properties/{$property->id}");
    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'data' => [
                'id' => $property->id,
                'title' => $property->title,
            ],
        ]);

    $responseBySlug = $this->getJson("/api/properties/{$property->slug}");
    $responseBySlug->assertStatus(200)
        ->assertJson([
            'success' => true,
            'data' => [
                'slug' => $property->slug,
            ],
        ]);
});

test('api returns 404 for non-existent property', function () {
    $response = $this->getJson('/api/properties/999999');
    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
        ]);
});

test('api can submit an inquiry', function () {
    $property = Property::first();

    $response = $this->postJson('/api/inquiries', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '+971501234567',
        'message' => 'I would like to schedule a private viewing for this property.',
        'property_id' => $property->id,
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'data' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'property_id' => $property->id,
            ],
        ]);

    $this->assertDatabaseHas('inquiries', [
        'email' => 'john@example.com',
        'name' => 'John Doe',
    ]);
});

test('api returns stats', function () {
    $response = $this->getJson('/api/stats');
    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'status',
            'data' => [
                'total_properties',
                'featured_properties',
                'total_inquiries',
            ],
        ]);
});
