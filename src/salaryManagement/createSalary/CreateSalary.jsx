import React, { useEffect, useState } from "react";
import UniversalDatePicker from "@/components/common/UniversalDatePicker";
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import toast from "react-hot-toast";
import { createSalaryStructure } from "@/apis/salary/salary";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import { allTeachersList } from "@/apis/teachers/teachers";
import { useNavigate } from "react-router-dom";
const CreateSalary = () => {
  const navigate = useNavigate();
  const [userOptions, setUserOptions] = useState([]);
  const [salaryData, setSalaryData] = useState({
    effectiveFrom: null,
    effectiveTo: null,
    basicSalary: "",
    hra: "",
    allowance: "",
    pf: "",
    esi: "",
    professionalTax: "",
    userId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setSalaryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const payload = {
        page: 1,
        limit: 1000,
      };
      const response = await allTeachersList(payload);

      const formattedOptions = response?.data?.teachers?.map((item) => ({
        label: item?.user?.name,
        value: item?.user?.id,
      }));

      setUserOptions(formattedOptions);
    } catch (error) {
      console.error(error, "Failed to fetch teachers");
    }
  };

  const handleSubmit = async () => {
    if (!salaryData.userId) {
      toast.error("User ID is required");
      return;
    }

    if (!salaryData.effectiveFrom) {
      toast.error("Effective From date is required");
      return;
    }

    if (!salaryData.basicSalary) {
      toast.error("Basic Salary is required");
      return;
    }

    try {
      const payload = {
        ...salaryData,
        effectiveFrom: salaryData.effectiveFrom?.toISOString(),
        effectiveTo: salaryData.effectiveTo
          ? salaryData.effectiveTo.toISOString()
          : null,
        basicSalary: parseFloat(salaryData.basicSalary),
        hra: parseFloat(salaryData.hra),
        allowance: parseFloat(salaryData.allowance),
        pf: parseFloat(salaryData.pf),
        esi: parseFloat(salaryData.esi),
        professionalTax: parseFloat(salaryData.professionalTax),
      };

      await createSalaryStructure(payload);

      toast.success("Salary structure created successfully");
       setSalaryData({
      effectiveFrom: null,
      effectiveTo: null,
      basicSalary: "",
      hra: "",
      allowance: "",
      pf: "",
      esi: "",
      professionalTax: "",
      userId: "",
    });

    navigate("/salary");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-5xl bg-gay-100 rounded-xl shadow-md p-1 md:p-8">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Salary Structure
          </h2>
          <p className="text-sm text-gray-500">
            Fill the details below to define salary configuration.
          </p>
        </div>

        {/* Effective Dates */}
        <div className="mb-8">
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            Effective Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UniversalDatePicker
              label="Effective From"
              value={salaryData.effectiveFrom}
              onChange={(value) => handleDateChange("effectiveFrom", value)}
            />
            <UniversalDatePicker
              label="Effective To"
              value={salaryData.effectiveTo}
              onChange={(value) => handleDateChange("effectiveTo", value)}
            />
          </div>
        </div>

        {/* Salary Components */}
        <div className="mb-8">
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            Salary Components
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputField
              label="Basic Salary"
              name="basicSalary"
              value={salaryData.basicSalary}
              onChange={handleChange}
              placeholder="Enter basic salary"
            />
            <InputField
              label="HRA"
              name="hra"
              value={salaryData.hra}
              onChange={handleChange}
              placeholder="Enter hra"
            />
            <InputField
              label="Allowance"
              name="allowance"
              value={salaryData.allowance}
              onChange={handleChange}
              placeholder="Enter allowance"
            />
            <InputField
              label="PF"
              name="pf"
              value={salaryData.pf}
              onChange={handleChange}
              placeholder="Enter pf"
            />
            <InputField
              label="ESI"
              name="esi"
              value={salaryData.esi}
              onChange={handleChange}
              placeholder="Enter esi"
            />
            <InputField
              label="Professional Tax"
              name="professionalTax"
              value={salaryData.professionalTax}
              onChange={handleChange}
              placeholder="Enter professional tax"
            />
          </div>
        </div>

        {/* Employee Link */}
        <div className="mb-8">
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            Employee Reference
          </h3>

          <DropdownWithSearch
            label="Teachers"
            options={userOptions}
            value={salaryData.userId}
            placeholder="Select Teacher"
            onChange={(value) =>
              setSalaryData((prev) => ({
                ...prev,
                userId: value,
              }))
            }
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center py-4 border-t">
          <UniversalButton label="Save Salary" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateSalary;
