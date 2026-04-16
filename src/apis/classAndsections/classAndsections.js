import { fetchWithAuth } from "../apiClient";


// create classes 
export const createClass = async (data) => {
  return await fetchWithAuth(`/class/create`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};


// create section 
export const createSection = async (data) => {
  return await fetchWithAuth(`/class/create-section`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};


// get all classes 
export const getAllClasses = async () => {
  return await fetchWithAuth(`/class`, {
    method: "GET",
  });
};


// get particular class section 
export const getParticularClassSection = async (classId) => {
  return await fetchWithAuth(`/class/section/${classId}`, {
    method: "GET",
  });
};


// toggle subject assignment 
export const toggleSubjectAssignment = async (data) => {
  return await fetchWithAuth(`/class/toggleSubjectAssignment`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// get class subjects 
export const getClassSubjects = async (id) => {
  return await fetchWithAuth(`/class/subject/${id}`, {
    method: "GET"
  });
};


export const assignTeacherToClassSection = async(data) => {
  return await fetchWithAuth(`/class/${data.teacherId}/section/${data.sectionId}/assign`, {
    method: "GET"
  });
}


// get class subjects 
export const getClassSubjectsWiseStudents = async (sectionId) => {
  return await fetchWithAuth(`/class/section/${sectionId}/student`, {
    method: "GET"
  });
};



// ********************************************************************************************
// get All teachers 
export const getAllTeachers = async () => {
  return await fetchWithAuth(`/teachers?page=${1}&limit=${10}`, {
    method: "GET"
  });
};