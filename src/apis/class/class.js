import { fetchWithAuth } from "../apiClient.js";

// create class
export const addProjectSite = async (data) => {
  return await fetchWithAuth(`/class/create`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
