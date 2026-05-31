import api from "@/lib/api";
import { getCookie } from "@/lib/cookieUtils";
import { type Inscription, InscriptionStatut, type CreateInscriptionRequest } from "@/types";

const requireAuthToken = () => {
  const token = getCookie("token");
  if (!token) {
    throw new Error("User is not authenticated. JWT is missing from cookies.");
  }
  return token;
};

export const inscriptionService = {
  inscrire: async (request: CreateInscriptionRequest): Promise<Inscription> => {
    requireAuthToken();
    const response = await api.post("/inscriptions", request);
    return response.data;
  },

  getAll: async (): Promise<Inscription[]> => {
    requireAuthToken();
    const response = await api.get("/inscriptions");
    return response.data;
  },

  getById: async (id: number): Promise<Inscription> => {
    requireAuthToken();
    const response = await api.get(`/inscriptions/${id}`);
    return response.data;
  },

  getByEmployee: async (employeeId: number): Promise<Inscription[]> => {
    requireAuthToken();
    const response = await api.get(`/inscriptions/employee/${employeeId}`);
    return response.data;
  },

  updateProgression: async (id: number, statut: InscriptionStatut): Promise<Inscription> => {
    requireAuthToken();
    const response = await api.put(`/inscriptions/${id}/progression`, null, {
      params: { statut },
    });
    return response.data;
  },

  annuler: async (id: number): Promise<void> => {
    requireAuthToken();
    await api.delete(`/inscriptions/${id}`);
  },
};
