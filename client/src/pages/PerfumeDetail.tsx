import { useParams, useNavigate } from 'react-router';
import { usePerfumeQuery, useAddCommentMutation } from '../hooks/usePerfumes.ts';
import { useAuthStore } from '../stores/authStore';
import {useState} from 'react';

const PerfumeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { data: perfume, isLoading, error } = usePerfumeQuery(id || '');
    const addCommentMutation = useAddCommentMutation();

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentData, setCommentData] = useState({
        rating: 3,
        content: '',
    });

    if (!id) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">Perfume not found</div>
            </div>
        );
    }

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

    const userHasCommented = user && perfume.comments.some(comment => comment.author._id === user._id);
    const isExtrait = perfume.concentration === 'Extrait';

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await addCommentMutation.mutateAsync({
                perfumeId: id,
                data: {
                    rating: commentData.rating,
                    content: commentData.content,
                    author: user,
                },
            });
            setCommentData({ rating: 3, content: '' });
            setShowCommentForm(false);
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className={`container mx-auto px-4 py-8 ${isExtrait ? 'bg-gradient-to-b from-amber-50/30 to-transparent' : ''}`}>
            <button
                onClick={() => navigate('/')}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
                ← Back to Collection
            </button>

            {isExtrait && (
                <div className="mb-6 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-center gap-3">
                    <span className="text-3xl">👑</span>
                    <div>
                        <h3 className="text-xl font-bold">Premium Extrait Collection</h3>
                        <p className="text-sm opacity-90">The highest concentration of perfume essence</p>
                    </div>
                    <span className="text-3xl">👑</span>
                </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isExtrait ? 'border-4 border-transparent bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-1 rounded-lg' : ''}`}>
                <div className={`${isExtrait ? 'bg-white rounded-lg p-2' : ''}`}>
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
                </div>

                <div className={`${isExtrait ? 'bg-gradient-to-b from-amber-50 to-white rounded-lg p-6' : ''}`}>
                    <h1 className={`text-4xl font-bold mb-4 ${isExtrait ? 'text-amber-900' : ''}`}>
                        {perfume.perfumeName}
                    </h1>
                    <p className={`text-2xl mb-2 ${isExtrait ? 'text-amber-800 font-semibold' : 'text-gray-700'}`}>
                        {perfume.brand.brandName}
                    </p>
                    <p className={`text-xl font-semibold mb-4 ${isExtrait ? 'text-amber-600' : 'text-green-600'}`}>
                        ${perfume.price}
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Target Audience</h2>
                            <p className="text-gray-700 capitalize">{perfume.targetAudience}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-1">Concentration</h2>
                            <p className={`font-semibold ${isExtrait ? 'text-amber-700 text-xl' : 'text-gray-700'}`}>
                                {perfume.concentration}
                                {isExtrait && ' ✨'}
                            </p>
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
                    </div>
                </div>
            </div>

            <div className="mt-12 mx-auto w-[80%]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Comments ({perfume.comments.length})</h2>
                    {user && !userHasCommented && !showCommentForm && (
                        <button
                            onClick={() => setShowCommentForm(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            Leave a Comment
                        </button>
                    )}
                    {!user && (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            Login to Comment
                        </button>
                    )}
                    {userHasCommented && (
                        <span className="text-gray-600">You have already commented on this perfume</span>
                    )}
                </div>

                {showCommentForm && (
                    <div className="mb-6 bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-xl font-semibold mb-4">Add Your Comment</h3>
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating: {commentData.rating}/3
                                </label>
                                <input
                                    id="rating"
                                    type="range"
                                    min="1"
                                    max="3"
                                    value={commentData.rating}
                                    onChange={(e) => setCommentData({ ...commentData, rating: Number(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Comment
                                </label>
                                <textarea
                                    id="content"
                                    required
                                    value={commentData.content}
                                    onChange={(e) => setCommentData({ ...commentData, content: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Share your thoughts about this perfume..."
                                />
                            </div>

                            {addCommentMutation.isError && (
                                <div className="text-red-600 text-sm">
                                    Failed to add comment. Please try again.
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={addCommentMutation.isPending}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                                >
                                    {addCommentMutation.isPending ? 'Submitting...' : 'Submit Comment'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCommentForm(false);
                                        setCommentData({ rating: 3, content: '' });
                                    }}
                                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {perfume.comments.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                    ) : (
                        perfume.comments.map((comment) => (
                            <div key={comment._id} className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-800">{comment.author.name}</span>
                                        <span className="ml-3 text-yellow-500 font-medium">★ {comment.rating}/3</span>
                                    </div>
                                    <p>{new Date(comment.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <p className="text-gray-700">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerfumeDetail;
