import { usePerfumesQuery } from '../hooks/usePerfumes.ts';
import { useNavigate } from 'react-router';
import { useState, useMemo } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const { data: perfumes, isLoading, error } = usePerfumesQuery();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPerfumes = useMemo(() => {
        if (!perfumes) return { extrait: [], regular: [] };
        if (!searchQuery.trim()) {
            return {
                extrait: perfumes.filter(p => p.concentration === 'Extrait'),
                regular: perfumes.filter(p => p.concentration !== 'Extrait')
            };
        }

        const query = searchQuery.toLowerCase();
        const filtered = perfumes.filter(perfume => 
            perfume.perfumeName.toLowerCase().includes(query) ||
            perfume.brand.brandName.toLowerCase().includes(query)
        );
        
        return {
            extrait: filtered.filter(p => p.concentration === 'Extrait'),
            regular: filtered.filter(p => p.concentration !== 'Extrait')
        };
    }, [perfumes, searchQuery]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading perfumes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">Error loading perfumes</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Perfumes Collection</h1>
            
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search by perfume name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {filteredPerfumes.extrait.length === 0 && filteredPerfumes.regular.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No perfumes found matching "{searchQuery}"
                </div>
            ) : (
                <>
                    {filteredPerfumes.extrait.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">👑</span>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                                    Premium Extrait Collection
                                </h2>
                                <span className="text-3xl">👑</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredPerfumes.extrait.map((perfume) => (
                                    <div 
                                        key={perfume._id} 
                                        onClick={() => navigate(`/perfumes/${perfume._id}`)}
                                        className="border-4 border-transparent bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all cursor-pointer hover:scale-[1.02] transform relative"
                                    >
                                        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                            <span className="text-lg">👑</span>
                                            <span>EXTRAIT</span>
                                        </div>
                                        <div className="bg-white rounded-lg overflow-hidden">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="aspect-square bg-gray-200">
                                                    {perfume.uri ? (
                                                        <img 
                                                            src={perfume.uri} 
                                                            alt={perfume.perfumeName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6 bg-gradient-to-b from-amber-50 to-white flex flex-col justify-center">
                                                    <h2 className="text-3xl font-bold mb-3 text-amber-900">
                                                        {perfume.perfumeName}
                                                    </h2>
                                                    <p className="text-xl text-amber-800 font-semibold mb-2">
                                                        {perfume.brand.brandName}
                                                    </p>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="text-sm text-gray-600 capitalize bg-amber-100 px-3 py-1 rounded-full">
                                                            {perfume.targetAudience}
                                                        </span>
                                                        <span className="text-sm text-amber-700 font-semibold bg-amber-100 px-3 py-1 rounded-full">
                                                            {perfume.volume} ml
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                                        {perfume.description}
                                                    </p>
                                                    <p className="text-2xl text-amber-600 font-bold">
                                                        ${perfume.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredPerfumes.regular.length > 0 && (
                        <div>
                            {filteredPerfumes.extrait.length > 0 && (
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                    All Perfumes
                                </h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPerfumes.regular.map((perfume) => (
                                    <div 
                                        key={perfume._id} 
                                        onClick={() => navigate(`/perfumes/${perfume._id}`)}
                                        className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                    >
                                        <div className="aspect-square bg-gray-200">
                                            {perfume.uri ? (
                                                <img 
                                                    src={perfume.uri} 
                                                    alt={perfume.perfumeName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h2 className="text-xl font-semibold mb-2">{perfume.perfumeName}</h2>
                                            <p className="text-gray-600 mb-1">{perfume.brand.brandName}</p>
                                            <p className="text-sm text-gray-500">{perfume.targetAudience}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
