import api from './axiosConfig';

const API_BASE_URL = '/api/categories';

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await api.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(API_BASE_URL, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    await api.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};