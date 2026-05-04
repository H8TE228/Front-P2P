import { api } from "./api";
import type {
  PaginatedTransactionList,
  Transaction,
  TransactionsListParams,
  TransactionsPendingListParams,
} from "./schema";

export const transactionsQueries = {
  getItemTransactions: async (itemId: number | string) => {
    const res = await api.get<Transaction[]>(
      `/listings/${itemId}/transactions/`,
    );
    return res.data;
  },
  createItemTransaction: async (itemId: string) => {
    const res = await api.post<Transaction>(
      `/listings/${itemId}/transactions/`,
      {},
    );
    return res.data;
  },
  getTransactions: async (params?: TransactionsListParams) => {
    const res = await api.get<PaginatedTransactionList>("/transactions/", {
      params,
    });
    return res.data;
  },
  getTransaction: async (id: number | string) => {
    const res = await api.get<Transaction>(`/transactions/${id}/`);
    return res.data;
  },
  approveTransaction: async (id: number | string) => {
    const res = await api.post(`/transactions/${id}/approve/`);
    return res.data;
  },
  rejectTransaction: async (id: number | string) => {
    const res = await api.post(`/transactions/${id}/reject/`);
    return res.data;
  },
  returnTransaction: async (id: number | string) => {
    const res = await api.post(`/transactions/${id}/return/`);
    return res.data;
  },
  getPendingTransactions: async (params?: TransactionsPendingListParams) => {
    const res = await api.get<PaginatedTransactionList>(
      "/transactions/pending/",
      {
        params,
      },
    );
    return res.data;
  },
};
