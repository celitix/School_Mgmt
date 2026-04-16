import React, { useState } from "react";
import UniversalTabs from "@/components/common/UniversalTabs";
import { FaMoneyBillWave, FaHistory, FaCalculator } from "react-icons/fa";
import TeacherSalary from "./components/TeacherSalary";
import { useNavigate } from "react-router-dom";
import UniversalButton from "@/components/common/UniversalButton";
const Salary = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-center md:justify-between w-full mb-2">
        <h1 className="text-xl font-semibold mb-2 md:mb-6 text-gray-800">
          Salary Management
        </h1>
        <div className="flex items-center gap-3">
          <UniversalButton
            label="Add Teacher Salary"
            onClick={() => navigate("/createsalary")}
          />
        </div>
      </div>

      <UniversalTabs value={activeTab} onChange={setActiveTab} color="indigo">
        {/* Tab 1 */}
        <div label="Teacher Salary" icon={<FaMoneyBillWave />}>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <TeacherSalary />
          </div>
        </div>

        {/* Tab 2 */}
        <div label="Process Salary" icon={<FaCalculator />}>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            Process Monthly Salary Content Here
          </div>
        </div>

        {/* Tab 3 */}
        <div label="Salary History" icon={<FaHistory />}>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            Salary History Table Here
          </div>
        </div>
      </UniversalTabs>
    </div>
  );
};

export default Salary;
