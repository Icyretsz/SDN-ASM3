import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { Perfume, Brand } from '../types/api';
import { useBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } from '../hooks/useBrands';
import { 
  usePerfumesQuery, 
  useCreatePerfumeMutation, 
  useUpdatePerfumeMutation, 
  useDeletePerfumeMutation 
} from '../hooks/usePerfumes';
import { useUsersQuery } from '../hooks/useUsers';

const AdminManager: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'brands' | 'perfumes' | 'users'>('brands');
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showPerfumeForm, setShowPerfumeForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'brand' | 'perfume';
    id: string;
    name: string;
    cascadeInfo?: string;
  } | null>(null);

  // Brand form state
  const [brandName, setBrandName] = useState('');
  const [brandNameError, setBrandNameError] = useState('');

  // Perfume form state
  const [perfumeForm, setPerfumeForm] = useState({
    perfumeName: '',
    uri: '',
    price: 0,
    concentration: '',
    description: '',
    ingredients: '',
    volume: 0,
    targetAudience: 'unisex' as 'male' | 'female' | 'unisex',
    brand: ''
  });
  const [perfumeNameError, setPerfumeNameError] = useState('');

  // Queries
  const { data: brands = [], isLoading: brandsLoading } = useBrandsQuery();
  const { data: perfumes = [], isLoading: perfumesLoading } = usePerfumesQuery();
  const { data: users = [], isLoading: usersLoading } = useUsersQuery();

  // Mutations
  const createBrandMutation = useCreateBrandMutation();
  const updateBrandMutation = useUpdateBrandMutation();
  const deleteBrandMutation = useDeleteBrandMutation();
  const createPerfumeMutation = useCreatePerfumeMutation();
  const updatePerfumeMutation = useUpdatePerfumeMutation();
  const deletePerfumeMutation = useDeletePerfumeMutation();

  const resetPerfumeForm = () => {
    setPerfumeForm({
      perfumeName: '',
      uri: '',
      price: 0,
      concentration: '',
      description: '',
      ingredients: '',
      volume: 0,
      targetAudience: 'unisex',
      brand: ''
    });
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandName.trim()) {
      // Check for duplicate brand name (case-insensitive)
      const isDuplicate = brands.some(brand => 
        brand.brandName.toLowerCase() === brandName.trim().toLowerCase() && 
        brand._id !== editingBrand?._id
      );
      
      if (isDuplicate) {
        setBrandNameError('A brand with this name already exists');
        return;
      }
      
      setBrandNameError('');
      
      if (editingBrand) {
        updateBrandMutation.mutate({
          brandId: editingBrand._id,
          data: { brandName: brandName.trim() }
        }, {
          onSuccess: () => {
            setBrandName('');
            setEditingBrand(null);
            setShowBrandForm(false);
          },
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error && 'response' in error 
              ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
              : 'Failed to update brand';
            setBrandNameError(errorMessage || 'Failed to update brand');
          }
        });
      } else {
        createBrandMutation.mutate({ brandName: brandName.trim() }, {
          onSuccess: () => {
            setBrandName('');
            setShowBrandForm(false);
          },
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error && 'response' in error 
              ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
              : 'Failed to create brand';
            setBrandNameError(errorMessage || 'Failed to create brand');
          }
        });
      }
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.brandName);
    setBrandNameError('');
    setShowBrandForm(true);
  };

  const handleCancelBrandEdit = () => {
    setEditingBrand(null);
    setBrandName('');
    setBrandNameError('');
    setShowBrandForm(false);
  };

  const handleCreatePerfume = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate perfume name (case-insensitive)
    const isDuplicate = perfumes.some(perfume => 
      perfume.perfumeName.toLowerCase() === perfumeForm.perfumeName.trim().toLowerCase() && 
      perfume._id !== editingPerfume?._id
    );
    
    if (isDuplicate) {
      setPerfumeNameError('A perfume with this name already exists');
      return;
    }
    
    setPerfumeNameError('');
    
    if (editingPerfume) {
      updatePerfumeMutation.mutate({
        perfumeId: editingPerfume._id,
        data: perfumeForm
      }, {
        onSuccess: () => {
          resetPerfumeForm();
          setEditingPerfume(null);
          setShowPerfumeForm(false);
        },
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error && 'response' in error 
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
            : 'Failed to update perfume';
          setPerfumeNameError(errorMessage || 'Failed to update perfume');
        }
      });
    } else {
      createPerfumeMutation.mutate(perfumeForm, {
        onSuccess: () => {
          resetPerfumeForm();
          setShowPerfumeForm(false);
        },
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error && 'response' in error 
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
            : 'Failed to create perfume';
          setPerfumeNameError(errorMessage || 'Failed to create perfume');
        }
      });
    }
  };

  const handleEditPerfume = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setPerfumeForm({
      perfumeName: perfume.perfumeName,
      uri: perfume.uri,
      price: perfume.price,
      concentration: perfume.concentration,
      description: perfume.description,
      ingredients: perfume.ingredients,
      volume: perfume.volume,
      targetAudience: perfume.targetAudience,
      brand: perfume.brand._id
    });
    setPerfumeNameError('');
    setShowPerfumeForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPerfume(null);
    resetPerfumeForm();
    setPerfumeNameError('');
    setShowPerfumeForm(false);
  };

  const handleDeleteBrand = (brandId: string, brandName: string) => {
    const brandPerfumes = perfumes.filter(p => p.brand._id === brandId);
    const totalComments = brandPerfumes.reduce((sum, p) => sum + p.comments.length, 0);
    
    setDeleteConfirmation({
      type: 'brand',
      id: brandId,
      name: brandName,
      cascadeInfo: `This will also delete ${brandPerfumes.length} perfume(s) and ${totalComments} comment(s).`
    });
  };

  const handleDeletePerfume = (perfumeId: string, perfumeName: string) => {
    const perfume = perfumes.find(p => p._id === perfumeId);
    const commentCount = perfume?.comments.length || 0;
    
    setDeleteConfirmation({
      type: 'perfume',
      id: perfumeId,
      name: perfumeName,
      cascadeInfo: commentCount > 0 ? `This will also delete ${commentCount} comment(s).` : undefined
    });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;

    switch (deleteConfirmation.type) {
      case 'brand':
        deleteBrandMutation.mutate(deleteConfirmation.id);
        break;
      case 'perfume':
        deletePerfumeMutation.mutate(deleteConfirmation.id);
        break;
    }
    setDeleteConfirmation(null);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your perfume collection, brands, and users</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'brands'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Brands
            </span>
          </button>
          <button
            onClick={() => setActiveTab('perfumes')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'perfumes'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Perfumes
            </span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </span>
          </button>
        </div>

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Brand Management</h2>
              <button
                onClick={() => {
                  setEditingBrand(null);
                  setBrandName('');
                  setShowBrandForm(!showBrandForm);
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md ${
                  showBrandForm
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                {showBrandForm ? '✕ Cancel' : '+ Add Brand'}
              </button>
            </div>

            {/* Brand Form */}
            {showBrandForm && (
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {editingBrand ? 'Edit Brand' : 'Create New Brand'}
                </h3>
                <form onSubmit={handleCreateBrand} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => {
                        setBrandName(e.target.value);
                        setBrandNameError('');
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        brandNameError 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-rose-500 focus:border-transparent'
                      }`}
                      placeholder="Enter brand name"
                      required
                    />
                    {brandNameError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {brandNameError}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-md font-medium"
                    >
                      {(createBrandMutation.isPending || updateBrandMutation.isPending)
                        ? (editingBrand ? 'Updating...' : 'Creating...')
                        : (editingBrand ? 'Update Brand' : 'Create Brand')
                      }
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelBrandEdit}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Brands List */}
            {brandsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-rose-500"></div>
                <p className="mt-4 text-gray-600">Loading brands...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {brands.map((brand) => (
                  <div key={brand._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{brand.brandName}</h3>
                        {brand.createdAt && <p className="text-sm text-gray-500 mt-1">
                          Created: {new Date(brand.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>}
                        {brand.updatedAt && <p className="text-sm text-gray-500 mt-1">
                          Updated: {new Date(brand.updatedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand._id, brand.brandName)}
                          disabled={deleteBrandMutation.isPending}
                          className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all shadow-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Perfumes Tab */}
        {activeTab === 'perfumes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Perfume Management</h2>
              <button
                onClick={() => {
                  setEditingPerfume(null);
                  resetPerfumeForm();
                  setShowPerfumeForm(!showPerfumeForm);
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md ${
                  showPerfumeForm
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                {showPerfumeForm ? '✕ Cancel' : '+ Add Perfume'}
              </button>
            </div>

            {/* Perfume Form */}
            {showPerfumeForm && (
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {editingPerfume ? 'Edit Perfume' : 'Create New Perfume'}
                </h3>
                <form onSubmit={handleCreatePerfume} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Perfume Name
                      </label>
                      <input
                        type="text"
                        value={perfumeForm.perfumeName}
                        onChange={(e) => {
                          setPerfumeForm({ ...perfumeForm, perfumeName: e.target.value });
                          setPerfumeNameError('');
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          perfumeNameError 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:ring-rose-500 focus:border-transparent'
                        }`}
                        placeholder="e.g., Chanel No. 5"
                        required
                      />
                      {perfumeNameError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {perfumeNameError}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={perfumeForm.uri}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, uri: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={perfumeForm.price}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="99.99"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume (ml)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={perfumeForm.volume}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, volume: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concentration
                      </label>
                      <input
                        type="text"
                        value={perfumeForm.concentration}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, concentration: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Eau de Parfum"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select
                        value={perfumeForm.targetAudience}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, targetAudience: e.target.value as 'male' | 'female' | 'unisex' })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="unisex">Unisex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <select
                        value={perfumeForm.brand}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, brand: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select a brand</option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand._id}>
                            {brand.brandName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={perfumeForm.description}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="A captivating fragrance that..."
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingredients
                      </label>
                      <textarea
                        value={perfumeForm.ingredients}
                        onChange={(e) => setPerfumeForm({ ...perfumeForm, ingredients: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        placeholder="Bergamot, Rose, Sandalwood"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={createPerfumeMutation.isPending || updatePerfumeMutation.isPending}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-md font-medium"
                    >
                      {(createPerfumeMutation.isPending || updatePerfumeMutation.isPending)
                        ? (editingPerfume ? 'Updating...' : 'Creating...')
                        : (editingPerfume ? 'Update Perfume' : 'Create Perfume')
                      }
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Perfumes List */}
            {perfumesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-rose-500"></div>
                <p className="mt-4 text-gray-600">Loading perfumes...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {perfumes.map((perfume) => (
                  <div key={perfume._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-40 h-40 flex-shrink-0">
                        <img
                          src={perfume.uri}
                          alt={perfume.perfumeName}
                          className="w-full h-full object-cover rounded-xl shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/160x160?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-800">{perfume.perfumeName}</h3>
                            <p className="text-rose-600 font-medium text-lg mt-1">${perfume.price}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPerfume(perfume)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePerfume(perfume._id, perfume.perfumeName)}
                              disabled={deletePerfumeMutation.isPending}
                              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all shadow-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="bg-gray-50 p-3 rounded-xl">
                            <span className="text-xs font-medium text-gray-500 uppercase">Brand</span>
                            <p className="text-sm font-semibold text-gray-800 mt-1">{perfume.brand.brandName}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl">
                            <span className="text-xs font-medium text-gray-500 uppercase">Volume</span>
                            <p className="text-sm font-semibold text-gray-800 mt-1">{perfume.volume}ml</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl">
                            <span className="text-xs font-medium text-gray-500 uppercase">Type</span>
                            <p className="text-sm font-semibold text-gray-800 mt-1">{perfume.concentration}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl">
                            <span className="text-xs font-medium text-gray-500 uppercase">For</span>
                            <p className="text-sm font-semibold text-gray-800 mt-1 capitalize">{perfume.targetAudience}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Description</span>
                            <p className="text-sm text-gray-700 mt-1">{perfume.description}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Notes</span>
                            <p className="text-sm text-gray-700 mt-1">{perfume.ingredients}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab - Read Only */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">User Directory</h2>
              <p className="text-gray-600">View all registered users</p>
            </div>

            {/* Users List */}
            {usersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-rose-500"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((userItem) => (
                  <div key={userItem._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {userItem.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-semibold text-gray-800">{userItem.name}</h3>
                          <p className="text-sm text-gray-500">{userItem.email}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase block">Year of Birth</span>
                          <p className="text-sm font-medium text-gray-800 mt-1">{userItem.yob}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase block">Gender</span>
                          <p className="text-sm font-medium text-gray-800 mt-1 capitalize">{userItem.gender}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase block">Role</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                            userItem.isAdmin 
                              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                          }`}>
                            {userItem.isAdmin ? '👑 Admin' : '👤 User'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-gray-700 text-center mb-4">
                Are you sure you want to delete <strong className="text-gray-900">{deleteConfirmation.name}</strong>?
              </p>
              {deleteConfirmation.cascadeInfo && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-xl">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-800 text-sm">
                      <strong>Warning:</strong> {deleteConfirmation.cascadeInfo}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteBrandMutation.isPending || deletePerfumeMutation.isPending}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all shadow-md font-medium"
                >
                  {(deleteBrandMutation.isPending || deletePerfumeMutation.isPending)
                    ? 'Deleting...' 
                    : 'Yes, Delete'
                  }
                </button>
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManager;