<?php

use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

/*
|--------------------------------------------------------------------------
| API Routes for Axis Real Estate
|--------------------------------------------------------------------------
|
| Here are test and production APIs for Axis Real Estate.
|
*/

// 1. List Properties (with optional search & filters)
Route::get('/properties', function (Request $request) {
    $query = Property::query();

    if ($request->filled('search')) {
        $search = $request->input('search');
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    if ($request->filled('type') && $request->input('type') !== 'all') {
        $query->where('property_type', $request->input('type'));
    }

    if ($request->has('featured')) {
        $isFeatured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
        $query->where('is_featured', $isFeatured);
    }

    // Sorting
    $sort = $request->input('sort', 'latest');
    if ($sort === 'price_asc') {
        $query->orderBy('price', 'asc');
    } elseif ($sort === 'price_desc') {
        $query->orderBy('price', 'desc');
    } else {
        $query->latest();
    }

    $properties = $query->get();

    return response()->json([
        'success' => true,
        'message' => 'Properties fetched successfully',
        'count' => $properties->count(),
        'data' => $properties,
    ]);
});

// 2. Get Single Property by ID or Slug
Route::get('/properties/{id}', function (string $id) {
    $property = is_numeric($id)
        ? Property::with('inquiries')->find($id)
        : Property::with('inquiries')->where('slug', $id)->first();

    if (! $property) {
        return response()->json([
            'success' => false,
            'message' => "Property not found with ID/Slug: {$id}",
        ], 404);
    }

    return response()->json([
        'success' => true,
        'message' => 'Property details retrieved successfully',
        'data' => $property,
    ]);
});

// 3. Submit Property Inquiry / Lead
Route::post('/inquiries', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:50',
        'message' => 'required|string|max:2000',
        'property_id' => 'nullable|exists:properties,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $inquiry = Inquiry::create([
        'name' => $request->input('name'),
        'email' => $request->input('email'),
        'phone' => $request->input('phone'),
        'message' => $request->input('message'),
        'property_id' => $request->input('property_id'),
        'status' => 'new',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Inquiry submitted successfully! A representative from Axis Real Estate will contact you shortly.',
        'data' => $inquiry->load('property'),
    ], 201);
});

// 4. Quick API Status & Real Estate Stats for Testing
Route::get('/stats', function () {
    $totalProperties = Property::count();
    $featuredProperties = Property::where('is_featured', true)->count();
    $totalInquiries = Inquiry::count();
    $types = Property::distinct()->pluck('property_type');

    return response()->json([
        'success' => true,
        'status' => 'operational',
        'timestamp' => now()->toIso8601String(),
        'app' => 'Axis Real Estate API',
        'data' => [
            'total_properties' => $totalProperties,
            'featured_properties' => $featuredProperties,
            'total_inquiries' => $totalInquiries,
            'property_types' => $types,
        ],
    ]);
});
