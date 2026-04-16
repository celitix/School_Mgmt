import { fetchWithAuth } from "../apiClient";

// create subjects 
export const createSubjects = async (data) => {
  return await fetchWithAuth(`/subjects`, {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// get subjects 
export const getSubjects = async () => {
  return await fetchWithAuth(`/subjects`, {
    method: "GET"
  });
};

// get subjects of a class
export const getSubjectsClass = async (classId) => {
  return await fetchWithAuth(`/subjects/class/${classId}`, {
    method: "GET"
  });
};

// update subject
export const updateSubject = async (id, data) => {
  return await fetchWithAuth(`/subjects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
};

// delete subjects
export const deleteSubject = async (id) => {
  return await fetchWithAuth(`/subjects/${id}`, {
    method: "DELETE"
  });
};


// delete subjects
export const assignSubjectToClass = async (subjectid, classId) => {
  return await fetchWithAuth(`/subjects/${subjectid}/class/${classId}`, {
    method: "POST"
  });
};
