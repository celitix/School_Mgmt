import { fetchWithAuth } from "../apiClient";

// Create Student 
export const addStudent = async (data) => {
    return await fetchWithAuth(`/student`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

// All Student 
export const allStudentsList = async (data) => {
    return await fetchWithAuth(`/student?page=${data.page}&limit=${data.limit}`, {
        method: "GET",
    });
};

// Single Student 
export const singleStudent = async (id, data) => {
    return await fetchWithAuth(`/student/${id}`, {
        method: "GET",
    });
};

// Update Student 
export const updateStudent = async (id, data) => {
    return await fetchWithAuth(`/student/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

// Delete Student 
export const deleteStudentDetail = async (data) => {
    return await fetchWithAuth(`/student/${data}`, {
        method: "DELETE",
    });
};

// Add Student Gurdian
export const addStudentGurdian = async (data) => {
    return await fetchWithAuth(`/student/gurdian`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};