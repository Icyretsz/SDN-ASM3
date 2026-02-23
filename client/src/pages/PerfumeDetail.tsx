import { useParams, useNavigate } from 'react-router';
import { usePerfumeQuery } from '../hooks/usePerfumes';

const PerfumeDetail = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">Perfume not found</div>
            </div>
        );
    }

    const navigate = useNavigate();
    const { data: perfume, isLoading, error } = usePerfumeQuery(id);

    console.log(perfume)
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading perfume details...</div>
            </div>
        );
    }

    if (error || !perfume) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">Perfume not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={() => navigate('/')}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
                ← Back to Collection
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
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

                <div>
                    <h1 className="text-4xl font-bold mb-4">{perfume.perfumeName}</h1>
                    <p className="text-2xl text-gray-700 mb-2">{perfume.brand.brandName}</p>
                    <p className="text-xl text-green-600 font-semibold mb-4">${perfume.price}</p>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Target Audience</h2>
                            <p className="text-gray-700 capitalize">{perfume.targetAudience}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-1">Concentration</h2>
                            <p className="text-gray-700">{perfume.concentration}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-1">Volume</h2>
                            <p className="text-gray-700">{perfume.volume} ml</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-1">Description</h2>
                            <p className="text-gray-700">{perfume.description}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-1">Ingredients</h2>
                            <p className="text-gray-700">{perfume.ingredients}</p>
                        </div>

                        {perfume.comments && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Comments</h2>
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center mb-2">
                                        <span className="font-semibold">{perfume.comments.author.name}</span>
                                        <span className="ml-2 text-yellow-500">★ {perfume.comments.rating}/5</span>
                                    </div>
                                    <p className="text-gray-700">{perfume.comments.content}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfumeDetail;
