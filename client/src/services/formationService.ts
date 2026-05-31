import api from "@/lib/api";
import type { Formation, UpdateFormationRequest } from "@/types";

export const formationService = {
  getAll: async (): Promise<Formation[]> => {
    const response = await api.get("/formations");
    return response.data;
  },

  getById: async (id: number): Promise<Formation> => {
    const response = await api.get(`/formations/${id}`);
    return response.data;
  },

  create: async (formation: Omit<Formation, 'id'>): Promise<Formation> => {
    const response = await api.post("/formations", formation);
    return response.data;
  },

  update: async (id: number, formation: UpdateFormationRequest): Promise<Formation> => {
    const response = await api.put(`/formations/${id}`, formation);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/formations/${id}`);
  },
};
