import api from "@/lib/api";

export const certificatService = {
  download: async (inscriptionId: number, employeeName: string): Promise<void> => {
    const response = await api.get(`/certificats/inscription/${inscriptionId}`, {
      responseType: "blob",
    });

    // Create a link element to trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const fileName = `Certificat_${employeeName.replace(/\s+/g, "_")}.pdf`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
