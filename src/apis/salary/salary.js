import { fetchWithAuth } from "../apiClient";

// Create Salary Structure
export const createSalaryStructure = async (data) => {
  return await fetchWithAuth(`/salary`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Get salary process-monthly-salary {userId}
export const getProcessMonthlySalary = async (userId) => {
  return await fetchWithAuth(`/salary/process-monthly-salary/${userId}`, {
    method: "GET",
  });
};
// Get salary monthly-salary {userId}
export const getMonthlySalary = async (userId, data) => {
  return await fetchWithAuth(
    `/salary/getMonthlySalary/${userId}?month=${data.month}&year=${data.year}`,
    {
      method: "GET",
    },
  );
};

// single User Salary Structure Details
export const getSingleUserSalaryStructure = async (userId) => {
  return await fetchWithAuth(`/salary/${userId}`, {
    method: "GET",
  });
};

// create salary pay 
export const createSalaryPay = async (id) => {
  return await fetchWithAuth(`/salary/pay/${id}`, {
    method: "POST",

  });
};

// create salary adjustment
export const createSalaryAdjustment = async (data) => {
  return await fetchWithAuth(`/salary/addSalaryAdjustment`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// create salary adjustment Bulk
export const createSalaryAdjustmentBulk = async (data) => {
  return await fetchWithAuth(`/salary/addSalaryAdjustmentBulk`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// update salary
export const updateSalary = async (id, data) => {
  return await fetchWithAuth(`/salary/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// delete salary
export const deleteSalary = async (id) => {
  return await fetchWithAuth(`/salary/${id}`, {
    method: "DELETE",
  });
};
