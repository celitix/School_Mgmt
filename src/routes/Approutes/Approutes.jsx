import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

// MainLayout
import Mainlayout from "@/mainlayout/Mainlayout";

// Dashboard
import Dashboard from "@/dashboard/Dashboard";
import AllTeachersList from "@/teachersManagement/allTeachersList/AllTeachersList";
import CreateTeacter from "@/teachersManagement/createTeacher/CreateTeacter";
import AllStudentsList from "@/studentsManagement/allStudentsList/AllStudentsList";
import CreateStudent from "@/studentsManagement/createStudent/createStudent";
import CreateSalary from "@/salaryManagement/createSalary/CreateSalary";
import Salary from "@/salaryManagement/salary/Salary";
import SubjectManagement from "@/subjectManagement/SubjectManagement";
import TimeTableManagement from "@/timetableManagement/TimeTableManagement";
import ClassManagement from "@/classManagement/ClassManagement";
import StudentsAttendenceManagement from "@/attendenceManagement/studentsAttendenceManagement";
import AcademicYearManagement from "../../academicYearManagement/AcademicYearManagement";
import Rough from "../../rough";

const Approutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/teachersdetails" element={<AllTeachersList />} />
        <Route path="/createteacter" element={<CreateTeacter />} />
        <Route path="/studentsdetails" element={<AllStudentsList />} />
        <Route path="/createStudent" element={<CreateStudent />} />
        <Route path="/createsalary" element={<CreateSalary />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/manageclasses" element={<ClassManagement />} />
        <Route path="/manageclasssubject" element={<SubjectManagement />} />
        <Route path="/managetimetable" element={<TimeTableManagement />} />
        <Route
          path="/manageacademicyear"
          element={<AcademicYearManagement />}
        />
        <Route
          path="/studentsAttendenceManagement"
          element={<StudentsAttendenceManagement />}
        />
        <Route
          path="/rough"
          element={<Rough/>}
        />
      </Route>
    </Routes>
  );
};

export default Approutes;
