import api from "@/lib/api";
import type { Session, CreateSessionRequest, UpdateSessionRequest } from "@/types";

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    const response = await api.get("/sessions");
    return response.data;
  },

  getById: async (id: number): Promise<Session> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  create: async (session: CreateSessionRequest): Promise<Session> => {
    const response = await api.post("/sessions", session);
    return response.data;
  },

  update: async (id: number, session: UpdateSessionRequest): Promise<Session> => {
    const response = await api.put(`/sessions/${id}`, session);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
};
