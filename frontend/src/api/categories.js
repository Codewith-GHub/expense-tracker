import axiosInstance from './axiosInstance';

export const getCategories = (type) =>
  axiosInstance.get('/categories', { params: type ? { type } : {} }).then((res) => res.data.data);

export const createCategory = (payload) =>
  axiosInstance.post('/categories', payload).then((res) => res.data.data);

export const updateCategory = (id, payload) =>
  axiosInstance.put(`/categories/${id}`, payload).then((res) => res.data.data);

export const deleteCategory = (id) =>
  axiosInstance.delete(`/categories/${id}`).then((res) => res.data);