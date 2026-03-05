import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { Perfume } from '../types/api';
import { useBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation } from '../hooks/useBrands';
import { 
  usePerfumesQuery, 
  useCreatePerfumeMutation, 
  useUpdatePerfumeMutation, 
  useDeletePerfumeMutation 
} from '../hooks/usePerfumes';

const AdminManager: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'brands' | 'perfumes'>('brands');
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showPerfumeForm, setShowPerfumeForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);

  // Brand form state
  const [brandName, setBrandName] = useState('');

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

  // Queries
  const { data: brands = [], isLoading: brandsLoading } = useBrandsQuery();
  const { data: perfumes = [], isLoading: perfumesLoading } = usePerfumesQuery();

  // Mutations
  const createBrandMutation = useCreateBrandMutation();
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
      createBrandMutation.mutate({ brandName: brandName.trim() }, {
        onSuccess: () => {
          setBrandName('');
          setShowBrandForm(false);
        }
      });
    }
  };

  const handleCreatePerfume = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerfume) {
      updatePerfumeMutation.mutate({
        perfumeId: editingPerfume._id,
        data: perfumeForm
      }, {
        onSuccess: () => {
          resetPerfumeForm();
          setEditingPerfume(null);
          setShowPerfumeForm(false);
        }
      });
    } else {
      createPerfumeMutation.mutate(perfumeForm, {
        onSuccess: () => {
          resetPerfumeForm();
          setShowPerfumeForm(false);
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
    setShowPerfumeForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPerfume(null);
    resetPerfumeForm();
    setShowPerfumeForm(false);
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Manager</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('brands')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'brands'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Brands
        </button>
        <button
          onClick={() => setActiveTab('perfumes')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'perfumes'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Perfumes
        </button>
      </div>

      {/* Brands Tab */}
      {activeTab === 'brands' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Brand Management</h2>
            <button
              onClick={() => setShowBrandForm(!showBrandForm)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {showBrandForm ? 'Cancel' : 'Add Brand'}
            </button>
          </div>

          {/* Brand Form */}
          {showBrandForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Brand</h3>
              <form onSubmit={handleCreateBrand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={createBrandMutation.isPending}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {createBrandMutation.isPending ? 'Creating...' : 'Create Brand'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBrandForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Brands List */}
          {brandsLoading ? (
            <div className="text-center py-8">Loading brands...</div>
          ) : (
            <div className="grid gap-4">
              {brands.map((brand) => (
                <div key={brand._id} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{brand.brandName}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(brand.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBrandMutation.mutate(brand._id)}
                      disabled={deleteBrandMutation.isPending}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
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
            <h2 className="text-2xl font-semibold">Perfume Management</h2>
            <button
              onClick={() => {
                setEditingPerfume(null);
                resetPerfumeForm();
                setShowPerfumeForm(!showPerfumeForm);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {showPerfumeForm ? 'Cancel' : 'Add Perfume'}
            </button>
          </div>

          {/* Perfume Form */}
          {showPerfumeForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">
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
                      onChange={(e) => setPerfumeForm({ ...perfumeForm, perfumeName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URI
                    </label>
                    <input
                      type="url"
                      value={perfumeForm.uri}
                      onChange={(e) => setPerfumeForm({ ...perfumeForm, uri: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={perfumeForm.price}
                      onChange={(e) => setPerfumeForm({ ...perfumeForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Eau de Parfum"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bergamot, Rose, Sandalwood"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={createPerfumeMutation.isPending || updatePerfumeMutation.isPending}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {(createPerfumeMutation.isPending || updatePerfumeMutation.isPending)
                      ? (editingPerfume ? 'Updating...' : 'Creating...')
                      : (editingPerfume ? 'Update Perfume' : 'Create Perfume')
                    }
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Perfumes List */}
          {perfumesLoading ? (
            <div className="text-center py-8">Loading perfumes...</div>
          ) : (
            <div className="grid gap-6">
              {perfumes.map((perfume) => (
                <div key={perfume._id} className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-32 h-32 flex-shrink-0">
                      <img
                        src={perfume.uri}
                        alt={perfume.perfumeName}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/128x128?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{perfume.perfumeName}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPerfume(perfume)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePerfumeMutation.mutate(perfume._id)}
                            disabled={deletePerfumeMutation.isPending}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Brand:</span>
                          <p>{perfume.brand.brandName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Price:</span>
                          <p>${perfume.price}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Volume:</span>
                          <p>{perfume.volume}ml</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Target:</span>
                          <p className="capitalize">{perfume.targetAudience}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-gray-600">Concentration:</span>
                        <p className="text-sm">{perfume.concentration}</p>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-gray-600">Description:</span>
                        <p className="text-sm text-gray-700">{perfume.description}</p>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-gray-600">Ingredients:</span>
                        <p className="text-sm text-gray-700">{perfume.ingredients}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManager;