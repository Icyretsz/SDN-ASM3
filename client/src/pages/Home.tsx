import { usePerfumesQuery } from '../hooks/usePerfumes';
import { useNavigate } from 'react-router';
import { useState, useMemo } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const { data: perfumes, isLoading, error } = usePerfumesQuery();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPerfumes = useMemo(() => {
        if (!perfumes) return [];
        if (!searchQuery.trim()) return perfumes;

        const query = searchQuery.toLowerCase();
        return perfumes.filter(perfume => 
            perfume.perfumeName.toLowerCase().includes(query) ||
            perfume.brand.brandName.toLowerCase().includes(query)
        );
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

            {filteredPerfumes.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No perfumes found matching "{searchQuery}"
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPerfumes.map((perfume) => (
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
            )}
        </div>
    );
};

export default Home;
