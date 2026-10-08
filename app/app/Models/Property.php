<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'property_type',
        'status',
        'bedrooms',
        'bathrooms',
        'area_sqft',
        'location',
        'address',
        'image_url',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'area_sqft' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}
