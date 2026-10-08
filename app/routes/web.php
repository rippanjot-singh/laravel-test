<?php

use App\Models\Property;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $properties = Property::latest()->get();
    $featured = Property::where('is_featured', true)->latest()->get();
    $types = Property::distinct()->pluck('property_type');

    return Inertia::render('welcome', [
        'initialProperties' => $properties,
        'initialFeatured' => $featured,
        'propertyTypes' => $types,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
