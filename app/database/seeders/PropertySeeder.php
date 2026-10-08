<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = [
            [
                'title' => 'The Grand Horizon Penthouse',
                'slug' => Str::slug('The Grand Horizon Penthouse'),
                'description' => 'A breath-taking sky residence offering 360-degree panoramic skyline views, private infinity pool on terrace, Italian marble finishes, and concierge services.',
                'price' => 3250000.00,
                'property_type' => 'Penthouse',
                'status' => 'available',
                'bedrooms' => 3,
                'bathrooms' => 4,
                'area_sqft' => 3400,
                'location' => 'Downtown Dubai',
                'address' => 'Floor 64, Boulevard Heights, Downtown',
                'image_url' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'Azure Coastline Waterfront Villa',
                'slug' => Str::slug('Azure Coastline Waterfront Villa'),
                'description' => 'Ultra-luxurious beachfront villa with private beach access, landscaped Zen gardens, smart home automation, and an expansive infinity pool.',
                'price' => 7800000.00,
                'property_type' => 'Villa',
                'status' => 'available',
                'bedrooms' => 5,
                'bathrooms' => 6,
                'area_sqft' => 6800,
                'location' => 'Palm Jumeirah',
                'address' => 'Frond N, Palm Jumeirah',
                'image_url' => 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'Skyline Luminary Suite',
                'slug' => Str::slug('Skyline Luminary Suite'),
                'description' => 'Architecturally designed modern residence featuring double-height glass windows, bespoke minimalist interior, and direct canal promenade access.',
                'price' => 1150000.00,
                'property_type' => 'Apartment',
                'status' => 'available',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area_sqft' => 1450,
                'location' => 'Business Bay',
                'address' => 'Marasi Drive, Business Bay',
                'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'The Sovereign Golf Estate',
                'slug' => Str::slug('The Sovereign Golf Estate'),
                'description' => 'A masterwork of timeless luxury overlooking championship golf greens. Features a private cinema room, subterranean wine cellar, and guest pavilion.',
                'price' => 12500000.00,
                'property_type' => 'Villa',
                'status' => 'available',
                'bedrooms' => 6,
                'bathrooms' => 8,
                'area_sqft' => 10200,
                'location' => 'Emirates Hills',
                'address' => 'Sector E, Emirates Hills',
                'image_url' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => true,
            ],
            [
                'title' => 'Marina Bay Waterfront Residence',
                'slug' => Str::slug('Marina Bay Waterfront Residence'),
                'description' => 'Chic waterfront living with yacht harbour views, bespoke German fitted kitchen, open-plan entertaining lounge, and private balcony.',
                'price' => 1890000.00,
                'property_type' => 'Apartment',
                'status' => 'available',
                'bedrooms' => 3,
                'bathrooms' => 3,
                'area_sqft' => 2200,
                'location' => 'Dubai Marina',
                'address' => 'Marina Walk, Dubai Marina',
                'image_url' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
            ],
            [
                'title' => 'The Onyx Financial District HQ',
                'slug' => Str::slug('The Onyx Financial District HQ'),
                'description' => 'Grade-A commercial office floor fitted out to the highest corporate standards with boardrooms, acoustically treated cabins, and executive dining.',
                'price' => 4100000.00,
                'property_type' => 'Commercial',
                'status' => 'available',
                'bedrooms' => 0,
                'bathrooms' => 4,
                'area_sqft' => 4500,
                'location' => 'DIFC',
                'address' => 'Gate District Tower 4, DIFC',
                'image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                'is_featured' => false,
            ],
        ];

        foreach ($properties as $data) {
            Property::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
