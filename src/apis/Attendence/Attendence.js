import { fetchWithAuth } from "../apiClient";

// Create Salary Structure
export const markAttendance = async (data) => {
  return await fetchWithAuth(`/attendence`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Get Attendence List
export const getAttendenceList = async (data) => {
  return await fetchWithAuth(
    `/attendence/?startDate=${data.startDate}&endDate=${data.endDate}&classId=${data.classId}&sectionId=${data.sectionId}${data?.studentId ? `&studentId=${data.studentId}` : ""}`,
    {
      method: "GET",
    },
  );
};

// &studentId=${data.studentId}
