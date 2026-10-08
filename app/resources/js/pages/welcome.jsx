import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Search,
    MapPin,
    Bed,
    Bath,
    Maximize2,
    Sparkles,
    Send,
    CheckCircle2,
    ChevronRight,
    Phone,
    Mail,
    Code2,
    Play,
    Terminal,
    ArrowUpRight,
    Filter,
    X,
    ShieldCheck,
    TrendingUp,
    Compass
} from 'lucide-react';

export default function Welcome({ initialProperties = [], initialFeatured = [], propertyTypes = [] }) {
    const { auth } = usePage().props;

    // State for property listings and filters
    const [properties, setProperties] = useState(initialProperties);
    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [inquiryTargetProperty, setInquiryTargetProperty] = useState(null);

    // Inquiry Form state
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        property_id: null,
    });
    const [inquiryStatus, setInquiryStatus] = useState({ loading: false, success: false, error: null });

    // Interactive API Explorer state
    const [apiEndpoint, setApiEndpoint] = useState('/api/properties');
    const [apiMethod, setApiMethod] = useState('GET');
    const [apiResponse, setApiResponse] = useState(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiStatusCode, setApiStatusCode] = useState(null);

    // Filter properties locally or refetch
    const filteredProperties = properties.filter((prop) => {
        const matchesType = filterType === 'all' || prop.property_type === filterType;
        const matchesSearch =
            searchQuery === '' ||
            prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (prop.description && prop.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesType && matchesSearch;
    });

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Open inquiry modal for specific property
    const handleOpenInquiry = (property = null) => {
        setInquiryTargetProperty(property);
        setInquiryForm({
            name: '',
            email: '',
            phone: '',
            message: property ? `Hi, I am interested in "${property.title}" in ${property.location}. Please share full details and pricing schedule.` : 'Hi, I would like to consult with an Axis Real Estate advisor regarding luxury investment opportunities.',
            property_id: property ? property.id : null,
        });
        setInquiryStatus({ loading: false, success: false, error: null });
        setIsInquiryModalOpen(true);
    };

    // Handle Inquiry Submit using the API
    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setInquiryStatus({ loading: true, success: false, error: null });

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(inquiryForm),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setInquiryStatus({ loading: false, success: true, error: null });
                setTimeout(() => {
                    setIsInquiryModalOpen(false);
                    setInquiryStatus({ loading: false, success: false, error: null });
                }, 2200);
            } else {
                setInquiryStatus({
                    loading: false,
                    success: false,
                    error: data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Failed to submit inquiry'),
                });
            }
        } catch (err) {
            setInquiryStatus({
                loading: false,
                success: false,
                error: 'Network error submitting inquiry: ' + err.message,
            });
        }
    };

    // Test API Handler
    const runApiTest = async (endpoint, method = 'GET', body = null) => {
        setApiLoading(true);
        setApiEndpoint(endpoint);
        setApiMethod(method);
        setApiResponse(null);
        setApiStatusCode(null);

        const startTime = performance.now();
        try {
            const options = {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            if (body && method === 'POST') {
                options.body = JSON.stringify(body);
            }

            const res = await fetch(endpoint, options);
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            const json = await res.json();
            setApiStatusCode(res.status);
            setApiResponse({
                status: res.status,
                duration: `${duration}ms`,
                data: json,
            });
        } catch (err) {
            setApiStatusCode(500);
            setApiResponse({
                status: 500,
                error: err.message,
            });
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
            <Head title="Axis Real Estate - Luxury Properties & Prime Investments" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0d1117]/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
                            <Building2 className="h-6 w-6 text-slate-950" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                                AXIS <span className="text-amber-400 font-light tracking-widest text-sm uppercase">Real Estate</span>
                            </span>
                            <p className="text-[11px] text-slate-400 tracking-wider uppercase">Prime Luxury Residences</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <a href="#properties" className="transition hover:text-amber-400">Properties</a>
                        <a href="#featured" className="transition hover:text-amber-400">Featured</a>
                        <a href="#api-tester" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition">
                            <Code2 className="h-4 w-4" />
                            API Playground
                        </a>
                        <a href="#contact" className="transition hover:text-amber-400">Contact</a>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white border border-slate-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-300 transition hover:text-white"
                                >
                                    Log In
                                </Link>
                                <button
                                    onClick={() => handleOpenInquiry()}
                                    className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-500"
                                >
                                    Book Consultation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#131922] via-[#0d1117] to-[#0d1117] py-20 lg:py-28">
                {/* Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 mb-6">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        Exclusive Portfolio • 2026 Premier Collection
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                        Redefining Luxury Living with <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Axis Real Estate</span>
                    </h1>

                    <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
                        Explore distinguished waterfront villas, high-altitude sky penthouses, and bespoke architectural residences in the world's most coveted destinations.
                    </p>

                    {/* Quick Search Bar */}
                    <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by location, keyword, penthouse, villa..."
                                    className="w-full rounded-xl bg-slate-800/80 border border-slate-700/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            <div className="relative sm:w-48">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full rounded-xl bg-slate-800/80 border border-slate-700/70 py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                                >
                                    <option value="all">All Types</option>
                                    <option value="Penthouse">Penthouse</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>

                            <a
                                href="#properties"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 shadow-md shadow-amber-500/25"
                            >
                                <Search className="h-4 w-4" />
                                Search
                            </a>
                        </div>
                    </div>

                    {/* Stats Highlights */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-800/80 pt-8 text-center">
                        <div>
                            <p className="text-2xl lg:text-3xl font-extrabold text-white">$150M+</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Portfolio Value</p>
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-extrabold text-amber-400">100%</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Prime Locations</p>
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-extrabold text-white">4 REST APIs</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Ready for Test</p>
                        </div>
                        <div>
                            <p className="text-2xl lg:text-3xl font-extrabold text-amber-400">24 / 7</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Private Client Desk</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Properties Showcase Section */}
            <section id="properties" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                            <Compass className="h-4 w-4" />
                            Curated Residences
                        </div>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Available Luxury Properties
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Showing {filteredProperties.length} handpicked architectural properties
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {['all', 'Penthouse', 'Villa', 'Apartment', 'Commercial'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                                    filterType === type
                                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                                }`}
                            >
                                {type === 'all' ? 'All Properties' : type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Grid */}
                {filteredProperties.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                        <Building2 className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                        <h3 className="text-lg font-medium text-slate-300">No properties match your filter</h3>
                        <p className="text-sm text-slate-500 mt-1">Try clearing your search query or selecting "All Properties".</p>
                        <button
                            onClick={() => {
                                setFilterType('all');
                                setSearchQuery('');
                            }}
                            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-slate-700"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((prop) => (
                            <div
                                key={prop.id}
                                className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5"
                            >
                                {/* Image Container */}
                                <div className="relative h-60 w-full overflow-hidden bg-slate-800">
                                    <img
                                        src={prop.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                                        alt={prop.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {prop.is_featured && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 uppercase tracking-wider shadow">
                                                <Sparkles className="h-3 w-3" />
                                                Featured
                                            </span>
                                        )}
                                        <span className="rounded-md bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-slate-700">
                                            {prop.property_type}
                                        </span>
                                    </div>

                                    {/* Price tag */}
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-xl font-extrabold text-white drop-shadow-md">
                                            {formatCurrency(prop.price)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                                        {prop.title}
                                    </h3>

                                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                        <span className="truncate">{prop.location}</span>
                                    </div>

                                    <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                        {prop.description}
                                    </p>

                                    {/* Meta specs */}
                                    <div className="mt-5 grid grid-cols-3 border-t border-b border-slate-800/80 py-2.5 text-xs text-slate-300">
                                        <div className="flex items-center gap-1.5 justify-center border-r border-slate-800/80">
                                            <Bed className="h-3.5 w-3.5 text-amber-400" />
                                            <span>{prop.bedrooms} Beds</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 justify-center border-r border-slate-800/80">
                                            <Bath className="h-3.5 w-3.5 text-amber-400" />
                                            <span>{prop.bathrooms} Baths</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 justify-center">
                                            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                                            <span>{prop.area_sqft} sqft</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => setSelectedProperty(prop)}
                                            className="flex-1 rounded-xl bg-slate-800/90 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition hover:bg-slate-700 hover:text-white"
                                        >
                                            Quick View
                                        </button>
                                        <button
                                            onClick={() => handleOpenInquiry(prop)}
                                            className="rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-semibold text-amber-400 border border-amber-500/30 transition hover:bg-amber-500 hover:text-slate-950"
                                        >
                                            Inquire
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Interactive API Playground & Testing Section */}
            <section id="api-tester" className="border-t border-slate-800 bg-[#090d13] py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-3">
                            <Terminal className="h-3.5 w-3.5" />
                            Backend API Testing Suite
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">
                            Test the 3+ REST APIs Live
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Click below to execute test requests directly against our Laravel API backend and inspect real-time JSON responses and status codes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* API Action Buttons */}
                        <div className="lg:col-span-5 space-y-3.5">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                                    Available Test APIs
                                </h3>

                                <div className="space-y-2.5">
                                    {/* API 1 */}
                                    <button
                                        onClick={() => runApiTest('/api/properties')}
                                        className="w-full flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/50 p-3 text-left transition hover:border-amber-500/60 hover:bg-slate-800"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">GET</span>
                                                <span className="font-mono text-xs text-white">/api/properties</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1">Fetches all properties with details & count</p>
                                        </div>
                                        <Play className="h-4 w-4 text-amber-400 shrink-0" />
                                    </button>

                                    {/* API 2 */}
                                    <button
                                        onClick={() => runApiTest('/api/properties/1')}
                                        className="w-full flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/50 p-3 text-left transition hover:border-amber-500/60 hover:bg-slate-800"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">GET</span>
                                                <span className="font-mono text-xs text-white">/api/properties/1</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1">Fetches a specific property by ID or slug</p>
                                        </div>
                                        <Play className="h-4 w-4 text-amber-400 shrink-0" />
                                    </button>

                                    {/* API 3 */}
                                    <button
                                        onClick={() => runApiTest('/api/inquiries', 'POST', {
                                            name: 'Test Client',
                                            email: 'client@example.com',
                                            phone: '+971 50 123 4567',
                                            message: 'Automated test inquiry for Axis Real Estate Penthouse.',
                                            property_id: 1,
                                        })}
                                        className="w-full flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/50 p-3 text-left transition hover:border-amber-500/60 hover:bg-slate-800"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">POST</span>
                                                <span className="font-mono text-xs text-white">/api/inquiries</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1">Creates a new real estate inquiry & saves to DB</p>
                                        </div>
                                        <Play className="h-4 w-4 text-amber-400 shrink-0" />
                                    </button>

                                    {/* API 4 - Stats */}
                                    <button
                                        onClick={() => runApiTest('/api/stats')}
                                        className="w-full flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-800/50 p-3 text-left transition hover:border-amber-500/60 hover:bg-slate-800"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">GET</span>
                                                <span className="font-mono text-xs text-white">/api/stats</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1">Fetches system stats, inventory counts & types</p>
                                        </div>
                                        <Play className="h-4 w-4 text-amber-400 shrink-0" />
                                    </button>
                                </div>
                            </div>

                            {/* cURL Quick Reference */}
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs font-mono text-slate-400">
                                <span className="text-slate-300 font-semibold block mb-2 font-sans">cURL Example:</span>
                                <code className="block text-[11px] text-amber-300/90 break-all select-all">
                                    curl -X GET http://localhost:8000/api/properties
                                </code>
                            </div>
                        </div>

                        {/* Live JSON Response Terminal */}
                        <div className="lg:col-span-7">
                            <div className="rounded-2xl border border-slate-800 bg-[#0d1117] overflow-hidden shadow-2xl">
                                {/* Terminal Bar */}
                                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                        <span className="ml-2 font-mono text-xs text-slate-400">
                                            {apiMethod} {apiEndpoint}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {apiStatusCode && (
                                            <span
                                                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                                                    apiStatusCode >= 200 && apiStatusCode < 300
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : 'bg-rose-500/20 text-rose-400'
                                                }`}
                                            >
                                                {apiStatusCode} {apiStatusCode === 201 ? 'Created' : apiStatusCode === 200 ? 'OK' : 'Response'}
                                            </span>
                                        )}
                                        {apiResponse?.duration && (
                                            <span className="text-[10px] font-mono text-slate-500">
                                                {apiResponse.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 max-h-[380px] overflow-auto font-mono text-xs">
                                    {apiLoading ? (
                                        <div className="flex items-center justify-center py-16 text-amber-400">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent mr-3" />
                                            <span>Sending request to {apiEndpoint}...</span>
                                        </div>
                                    ) : apiResponse ? (
                                        <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                                            {JSON.stringify(apiResponse.data, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="py-16 text-center text-slate-500">
                                            <Terminal className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                                            <p>Click any test API on the left to inspect live response</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            {selectedProperty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl overflow-hidden">
                        <button
                            onClick={() => setSelectedProperty(null)}
                            className="absolute top-4 right-4 rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <img
                                src={selectedProperty.image_url}
                                alt={selectedProperty.title}
                                className="h-56 sm:w-1/2 rounded-xl object-cover"
                            />

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase">
                                            {selectedProperty.property_type}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-amber-500" />
                                            {selectedProperty.location}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mt-2">
                                        {selectedProperty.title}
                                    </h3>

                                    <p className="text-2xl font-extrabold text-amber-400 mt-2">
                                        {formatCurrency(selectedProperty.price)}
                                    </p>

                                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                                        {selectedProperty.description}
                                    </p>

                                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-center text-xs text-slate-300">
                                        <div>
                                            <span className="font-semibold text-white block">{selectedProperty.bedrooms}</span>
                                            <span className="text-[10px] text-slate-500">Bedrooms</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white block">{selectedProperty.bathrooms}</span>
                                            <span className="text-[10px] text-slate-500">Bathrooms</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white block">{selectedProperty.area_sqft}</span>
                                            <span className="text-[10px] text-slate-500">Sq Ft</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => {
                                            const prop = selectedProperty;
                                            setSelectedProperty(null);
                                            handleOpenInquiry(prop);
                                        }}
                                        className="flex-1 rounded-xl bg-amber-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400"
                                    >
                                        Book Viewing
                                    </button>
                                    <button
                                        onClick={() => setSelectedProperty(null)}
                                        className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inquiry / Consultation Modal */}
            {isInquiryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                        <button
                            onClick={() => setIsInquiryModalOpen(false)}
                            className="absolute top-4 right-4 rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-5 w-5 text-amber-400" />
                            <h3 className="text-lg font-bold text-white">
                                {inquiryTargetProperty ? `Inquire: ${inquiryTargetProperty.title}` : 'Private Client Consultation'}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-5">
                            Connect with our licensed private wealth advisors at Axis Real Estate.
                        </p>

                        {inquiryStatus.success ? (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-2" />
                                <h4 className="text-sm font-semibold text-emerald-300">Inquiry Received</h4>
                                <p className="text-xs text-slate-300 mt-1">
                                    Thank you! Your inquiry has been sent to our desk via our API.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                {inquiryStatus.error && (
                                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                                        {inquiryStatus.error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        placeholder="e.g. Sahil Katyal"
                                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={inquiryForm.email}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                            placeholder="client@axis.com"
                                            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={inquiryForm.phone}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                            placeholder="+971 50 000 0000"
                                            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Inquiry / Requirements</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsInquiryModalOpen(false)}
                                        className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inquiryStatus.loading}
                                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                                    >
                                        {inquiryStatus.loading ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                <Send className="h-3.5 w-3.5" />
                                                Submit Inquiry
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer id="contact" className="border-t border-slate-800 bg-[#070a0e] py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="font-bold text-white tracking-tight">AXIS REAL ESTATE</span>
                                <p className="text-xs text-slate-400">Luxury Developments & Advisory</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-amber-500" /> +971 4 000 0000
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-amber-500" /> concierge@axisrealestate.com
                            </span>
                        </div>

                        <p className="text-xs text-slate-400">
                            © {new Date().getFullYear()} Axis Real Estate. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
