import { useParams, useNavigate } from 'react-router';
import { usePerfumeQuery, useAddCommentMutation } from '../hooks/usePerfumes.ts';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';

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
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <p className="text-xl text-red-600 font-semibold">Perfume not found</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-rose-500 mb-4"></div>
                    <p className="text-xl text-gray-600">Loading perfume details...</p>
                </div>
            </div>
        );
    }

    if (error || !perfume) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <p className="text-xl text-red-600 font-semibold">Perfume not found</p>
                </div>
            </div>
        );
    }

    const userHasCommented = user && perfume.comments.some(comment => comment.author._id === user._id);
    const isExtrait = perfume.concentration.toLowerCase() === 'extrait';

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <div className={`min-h-screen ${isExtrait ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black' : 'bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className={`cursor-pointer mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 font-medium text-sm sm:text-base ${
                        isExtrait 
                            ? 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20' 
                            : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="hidden sm:inline">Back to Collection</span>
                    <span className="sm:hidden">Back</span>
                </button>

                {isExtrait && (
                    <div className="mb-6 sm:mb-8 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full shadow-2xl animate-pulse">
                            <span className="text-2xl">✨</span>
                            <span className="text-lg font-bold text-gray-900 uppercase tracking-wider">Premium Extrait Collection</span>
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>
                )}

                {/* Product Details */}
                <div className={`rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-8 sm:mb-12 ${
                    isExtrait 
                        ? 'bg-gradient-to-br from-purple-800/40 via-indigo-800/40 to-purple-900/40 backdrop-blur-xl border-2 border-amber-400/30' 
                        : 'bg-white'
                }`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
                        {/* Image */}
                        <div className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden relative ${
                            isExtrait 
                                ? 'bg-gradient-to-br from-purple-900 to-indigo-900 ring-4 ring-amber-400/50' 
                                : 'bg-gradient-to-br from-gray-100 to-gray-200'
                        }`}>
                            {perfume.uri ? (
                                <img
                                    src={perfume.uri}
                                    alt={perfume.perfumeName}
                                    className={`w-full h-full object-cover ${isExtrait ? 'opacity-90' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className={`w-24 h-24 sm:w-32 sm:h-32 ${isExtrait ? 'text-amber-400/50' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {isExtrait && (
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent pointer-events-none" />
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-4 sm:mb-6">
                                <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2 ${
                                    isExtrait ? 'text-amber-400' : 'text-rose-600'
                                }`}>
                                    {perfume.brand.brandName}
                                </p>
                                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 ${
                                    isExtrait ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200' : 'text-gray-800'
                                }`}>
                                    {perfume.perfumeName}
                                </h1>
                                <p className={`text-2xl sm:text-3xl font-bold ${
                                    isExtrait ? 'text-amber-400' : 'text-rose-600'
                                }`}>
                                    ${perfume.price}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className={`p-3 sm:p-4 rounded-xl ${
                                    isExtrait 
                                        ? 'bg-gradient-to-br from-purple-700/50 to-indigo-700/50 backdrop-blur-sm border border-amber-400/20' 
                                        : 'bg-gradient-to-br from-rose-50 to-pink-50'
                                }`}>
                                    <p className={`text-xs font-semibold uppercase mb-1 ${
                                        isExtrait ? 'text-amber-300' : 'text-gray-600'
                                    }`}>Target</p>
                                    <p className={`text-base sm:text-lg font-bold capitalize ${
                                        isExtrait ? 'text-white' : 'text-gray-800'
                                    }`}>{perfume.targetAudience}</p>
                                </div>
                                <div className={`p-3 sm:p-4 rounded-xl ${
                                    isExtrait 
                                        ? 'bg-gradient-to-br from-purple-700/50 to-indigo-700/50 backdrop-blur-sm border border-amber-400/20' 
                                        : 'bg-gradient-to-br from-purple-50 to-pink-50'
                                }`}>
                                    <p className={`text-xs font-semibold uppercase mb-1 ${
                                        isExtrait ? 'text-amber-300' : 'text-gray-600'
                                    }`}>Volume</p>
                                    <p className={`text-base sm:text-lg font-bold ${
                                        isExtrait ? 'text-white' : 'text-gray-800'
                                    }`}>{perfume.volume} ml</p>
                                </div>
                                <div className={`p-3 sm:p-4 rounded-xl col-span-2 ${
                                    isExtrait 
                                        ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 backdrop-blur-sm border-2 border-amber-400/40' 
                                        : 'bg-gradient-to-br from-pink-50 to-rose-50'
                                }`}>
                                    <p className={`text-xs font-semibold uppercase mb-1 ${
                                        isExtrait ? 'text-amber-300' : 'text-gray-600'
                                    }`}>Concentration</p>
                                    <p className={`text-base sm:text-lg font-bold ${
                                        isExtrait ? 'text-amber-400' : 'text-gray-800'
                                    }`}>{perfume.concentration}</p>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <h2 className={`text-xs sm:text-sm font-bold uppercase mb-2 ${
                                        isExtrait ? 'text-amber-300' : 'text-gray-600'
                                    }`}>Description</h2>
                                    <p className={`text-sm sm:text-base leading-relaxed ${
                                        isExtrait ? 'text-gray-200' : 'text-gray-700'
                                    }`}>{perfume.description}</p>
                                </div>

                                <div>
                                    <h2 className={`text-xs sm:text-sm font-bold uppercase mb-2 ${
                                        isExtrait ? 'text-amber-300' : 'text-gray-600'
                                    }`}>Notes</h2>
                                    <p className={`text-sm sm:text-base leading-relaxed ${
                                        isExtrait ? 'text-gray-200' : 'text-gray-700'
                                    }`}>{perfume.ingredients}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Reviews ({perfume.comments.length})
                        </h2>
                        {user && !userHasCommented && !showCommentForm && !user.isAdmin && (
                            <button
                                onClick={() => setShowCommentForm(true)}
                                className="cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md transition-all text-sm sm:text-base"
                            >
                                Write a Review
                            </button>
                        )}
                        {!user && (
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md transition-all text-sm sm:text-base"
                            >
                                Login to Review
                            </button>
                        )}
                        {userHasCommented && (
                            <span className="text-sm sm:text-base text-gray-600 bg-gray-100 px-3 sm:px-4 py-2 rounded-xl">
                                ✓ You've reviewed this perfume
                            </span>
                        )}
                        {user?.isAdmin && (
                            <span className="text-sm sm:text-base text-gray-600 bg-gray-100 px-3 sm:px-4 py-2 rounded-xl">
                                Admins cannot leave reviews
                            </span>
                        )}
                    </div>

                    {/* Comment Form */}
                    {showCommentForm && (
                        <div className="mb-8 bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl border border-rose-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Experience</h3>
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-3">
                                        Rating: {commentData.rating}/3
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setCommentData({ ...commentData, rating: star })}
                                                className="text-4xl transition-all"
                                            >
                                                {star <= commentData.rating ? '⭐' : '☆'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        id="content"
                                        required
                                        value={commentData.content}
                                        onChange={(e) => setCommentData({ ...commentData, content: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                        placeholder="Share your thoughts about this perfume..."
                                    />
                                </div>

                                {addCommentMutation.isError && (
                                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                                        Failed to add review. Please try again.
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={addCommentMutation.isPending}
                                        className="cursor-pointer px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50"
                                    >
                                        {addCommentMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCommentForm(false);
                                            setCommentData({ rating: 3, content: '' });
                                        }}
                                        className="cursor-pointer px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {perfume.comments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                            </div>
                        ) : (
                            perfume.comments.map((comment) => (
                                <div key={comment._id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {comment.author.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{comment.author.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                                            <span className="text-amber-500 text-lg">⭐</span>
                                            <span className="font-bold text-amber-700">{comment.rating}/3</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfumeDetail;
