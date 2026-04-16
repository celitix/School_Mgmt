import { fetchWithAuth } from "../apiClient";


// create academic year 
export const createAcademicYear = async (data) => {
  return await fetchWithAuth(`/academic-year`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// get all academic year 
export const getAllAcademicYear = async () => {
  return await fetchWithAuth(`/academic-year`, {
    method: "GET",
  });
};

// update academic year 
export const updateAcademicYear = async (data, id) => {
  return await fetchWithAuth(`/academic-year/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
};


// delete academic year 
export const deleteAcademicYear = async (id) => {
  return await fetchWithAuth(`/academic-year/${id}`, {
    method: "DELETE"
  });
};