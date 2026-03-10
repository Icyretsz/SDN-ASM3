import { usePerfumesQuery } from '../hooks/usePerfumes.ts';
import { useBrandsQuery } from '../hooks/useBrands.ts'
import { useNavigate } from 'react-router';
import { useState, useMemo } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const { data: perfumes, isLoading: isPerfumeLoading, error: perfumeError } = usePerfumesQuery();
    const { data: brands, isLoading: isBrandsLoading, error: brandsError } = useBrandsQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [brandFilter, setBrandFilter] = useState('None')

    const filteredPerfumes = useMemo(() => {
        if (!perfumes) return [];
        if (!searchQuery.trim() && brandFilter === 'None') return perfumes;

        const query = searchQuery.toLowerCase();
        const filter = brandFilter.toLowerCase();
        let result = perfumes
        if (query) {
            result = result.filter(perfume =>
                perfume.perfumeName.toLowerCase().includes(query)
            )
        }

        if (filter !== 'none') {
            result = result.filter(perfume => perfume.brand.brandName.toLowerCase().includes(filter))
        }
        return result
    }, [perfumes, searchQuery, brandFilter]);

    const handleBrandFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBrandFilter(e.target.value)
    }

    if (isPerfumeLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-rose-500 mb-4"></div>
                    <p className="text-xl text-gray-600">Loading perfumes...</p>
                </div>
            </div>
        );
    }

    if (perfumeError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="text-xl text-red-600 font-semibold">Error loading perfumes</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
                        Discover Your Signature Scent
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">Explore our curated collection of luxury fragrances</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 sm:mb-12 max-w-2xl mx-auto flex items-center gap-10">
                    <div className="relative flex-1">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm bg-white transition-all"
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        {!isBrandsLoading ? <><label htmlFor="brands" className="block text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                            Filter by:
                        </label>
                            <select
                                id="brands"
                                name="brands"
                                value={brandFilter}
                                onChange={handleBrandFilterChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                            >
                                <option value="None">--Select brand to filter--</option>
                                {!isBrandsLoading && brands && brands.length > 0 && brands.map((brand, i) => {
                                    return <option key={i} value={brand.brandName}>{brand.brandName}</option>
                                })}
                            </select></> : brandsError ? <p>Error fetching brands</p> : <p>Loading brands</p>}
                    </div>
                </div>

                {/* Results */}
                {filteredPerfumes.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 px-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-lg sm:text-xl text-gray-500">No perfumes found{searchQuery ? ` matching "${searchQuery}"` : ''}{brandFilter !== 'None' ? ` in brand "${brandFilter}"` : ''}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredPerfumes.map((perfume) => (
                            <div
                                key={perfume._id}
                                onClick={() => navigate(`/perfumes/${perfume._id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                            >
                                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                                    {perfume.uri ? (
                                        <img
                                            src={perfume.uri}
                                            alt={perfume.perfumeName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                                            {perfume.volume}ml
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                        {perfume.perfumeName}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3 font-medium">
                                        {perfume.brand.brandName}
                                    </p>
                                    <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                                        <span className="text-xs px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-full font-medium capitalize">
                                            {perfume.targetAudience}
                                        </span>
                                        <span className="text-xs px-2 py-1 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                            {perfume.concentration}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className="text-xl sm:text-2xl font-bold text-rose-600">
                                            ${perfume.price}
                                        </span>
                                        <button className="text-xs sm:text-sm text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1">
                                            View Details
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
