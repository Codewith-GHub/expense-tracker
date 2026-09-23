import axiosInstance from './axiosInstance';

export const getTransactions = (params = {}) =>
  axiosInstance.get('/transactions', { params }).then((res) => res.data);

export const createTransaction = (payload) =>
  axiosInstance.post('/transactions', payload).then((res) => res.data.data);

export const updateTransaction = (id, payload) =>
  axiosInstance.put(`/transactions/${id}`, payload).then((res) => res.data.data);

export const deleteTransaction = (id) =>
  axiosInstance.delete(`/transactions/${id}`).then((res) => res.data);

export const getSummary = () =>
  axiosInstance.get('/transactions/summary').then((res) => res.data.data);