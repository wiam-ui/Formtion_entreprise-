import api from "@/lib/api";
import type { Employee } from "@/types";

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get("/employees");
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await api.post("/employees", employee);
    return response.data;
  },

  update: async (id: number, employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
