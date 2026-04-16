import { fetchWithAuth } from "../apiClient";

// Create Teacher
export const addTeacher = async (data) => {
    return await fetchWithAuth(`/teachers`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

// All Teacher
export const allTeachersList = async (data) => {
    return await fetchWithAuth(`/teachers?page=${data.page}&limit=${data.limit}`, {
        method: "GET",
    });
};

// Single Teacher Get
export const singleTeacher = async (id, data) => {
    return await fetchWithAuth(`/teachers/${id}`, {
        method: "GET",
    });
};

// Update teacher Details
export const updateTeacher = async (id, data) => {
    return await fetchWithAuth(`/teachers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};


// Delete teacher Details 
export const deleteTeacherDetail = async (data) => {
    return await fetchWithAuth(`/teachers/${data}`, {
        method: "DELETE",
    });
};

// Teacher Assign Section  /teachers/{teacherId}/assign/{sectionId}
export const teacherAssignSection = async (data) => {
    return await fetchWithAuth(`/teachers/${data.teacherId}/assign/${data.sectionId}`, {
        method: "GET",
    });
};

