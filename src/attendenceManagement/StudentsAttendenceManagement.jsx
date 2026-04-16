import React, { useState, useMemo, useEffect } from "react";
import DropdownWithSearch from "../components/common/DropdownWithSearch";
import {
  getAllClasses,
  getParticularClassSection,
  getClassSubjectsWiseStudents,
} from "../apis/classAndsections/classAndsections";
import {
  markAttendance,
  getAttendenceList,
} from "../apis/Attendence/Attendence";

const StudentsAttendanceManagement = () => {
  // ================= MONTH & YEAR OPTIONS =================
  const months = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];

  const years = [
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
  ];

  // ================= STATE =================
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [attendance, setAttendance] = useState({});

  // ================= FETCH CLASSES =================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllClasses();
        const classList = response?.data?.allClass || [];

        const formattedClasses = classList.map((item) => ({
          label: item.name,
          value: item.id,
        }));

        setClassOptions(formattedClasses);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // ================= FETCH SECTIONS =================
  useEffect(() => {
    if (!selectedClass) {
      setSectionOptions([]);
      setSelectedSection(null);
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchSections = async () => {
      try {
        const response = await getParticularClassSection(selectedClass);

        const sectionList = response?.data?.sections || [];

        const formattedSections = sectionList.map((item) => ({
          label: item.name,
          value: item.id,
        }));

        setSectionOptions(formattedSections);
        setSelectedSection(null);
        setStudents([]);
        setAttendance({});
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };

    fetchSections();
  }, [selectedClass]);

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    if (!selectedSection) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await getClassSubjectsWiseStudents(selectedSection);

        const studentList = response?.data?.students || [];

        const formattedStudents = studentList.map((item) => ({
          id: item.id,
          name: item.user.name,
        }));

        setStudents(formattedStudents);
        setAttendance({});
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, [selectedSection]);

  // useEffect(() => {
  //   if (!selectedClass || !selectedSection) return;

  //   const fetchAttendance = async () => {
  //     try {
  //       const res = await getMonthlyAttendance({
  //         classId: selectedClass,
  //         sectionId: selectedSection,
  //         month: selectedMonth + 1,
  //         year: selectedYear,
  //       });

  //       const attendanceList = res?.data?.attendence || [];

  //       const formatted = buildAttendanceState(students, attendanceList);
  //       setAttendance(formatted);
  //     } catch (err) {
  //       console.error("Attendance fetch failed", err);
  //     }
  //   };

  //   fetchAttendance();
  // }, [selectedClass, selectedSection, selectedMonth, selectedYear, students]);

  const getMonthRange = () => {
    const start = new Date(Date.UTC(selectedYear, selectedMonth, 1));
    const end = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0));
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };
  useEffect(() => {
    if (!selectedClass || !selectedSection || students.length === 0) return;

    const fetchAttendance = async () => {
      try {
        const { startDate, endDate } = getMonthRange();

        const res = await getAttendenceList({
          classId: selectedClass,
          sectionId: selectedSection,
          startDate,
          endDate,
        });

        const list = res?.data?.attendence || [];
        const filtered = list.filter((a) => {
          const d = new Date(a.date);
          return (
            d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
          );
        });

        const formatted = buildAttendanceState(students, filtered);
        setAttendance(formatted);
      } catch (err) {
        console.error("attendance fetch failed", err);
      }
    };

    fetchAttendance();
  }, [
    selectedClass,
    selectedSection,
    selectedMonth,
    selectedYear,
    students.length,
  ]);

  const buildAttendanceState = (students, attendanceList) => {
    const result = {};

    attendanceList.forEach((a) => {
      const d = new Date(a.date);

      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();

      if (!result[year]) result[year] = {};
      if (!result[year][month]) result[year][month] = {};
      if (!result[year][month][a.studentId])
        result[year][month][a.studentId] = {};

      let status = "";
      if (a.status === "PRESENT") status = "P";
      if (a.status === "ABSENT") status = "A";
      if (a.status === "LEAVE") status = "L";

      result[year][month][a.studentId][day] = status;
    });

    return result;
  };

  // ================= DAYS CALCULATION =================
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ================= HANDLE ATTENDANCE =================
  const handleAttendanceChange = async (studentId, date, value) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedYear]: {
        ...prev[selectedYear],
        [selectedMonth]: {
          ...prev[selectedYear]?.[selectedMonth],
          [studentId]: {
            ...prev[selectedYear]?.[selectedMonth]?.[studentId],
            [date]: value,
          },
        },
      },
    }));

    const statusMap = {
      P: "PRESENT",
      A: "ABSENT",
      L: "LEAVE",
    };

    const isoDate = new Date(
      Date.UTC(selectedYear, selectedMonth, date),
    ).toISOString();

    const payload = {
      studentId: studentId,
      classId: selectedClass,
      sectionId: selectedSection,
      date: isoDate,
      status: statusMap[value],
      remarks: "",
    };

    try {
      await markAttendance(payload);
    } catch (error) {
      console.error("Attendance API failed", error);
    }
  };

  return (
    <div className="p-0 md:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-2 md:p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          📘 Students Attendance Register
        </h2>

        {/* ================= FILTERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <DropdownWithSearch
            options={classOptions}
            placeholder="Select Class"
            value={selectedClass}
            onChange={setSelectedClass}
          />

          <DropdownWithSearch
            options={sectionOptions}
            placeholder="Select Section"
            value={selectedSection}
            onChange={setSelectedSection}
            isDisabled={!selectedClass}
          />

          <DropdownWithSearch
            options={months}
            placeholder="Select Month"
            value={selectedMonth}
            onChange={(value) => {
              setSelectedMonth(value);
            }}
          />

          <DropdownWithSearch
            options={years}
            placeholder="Select Year"
            value={selectedYear}
            onChange={(value) => {
              setSelectedYear(value);
            }}
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-max border-collapse w-full">
            <thead className="bg-blue-600 text-white sticky top-0 z-30">
              <tr>
                <th className="p-1 md:p-3 text-center sticky left-0 z-40 bg-blue-600 w-7 md:w-14">
                  #
                </th>

                <th className="p-3 min-w-[150px] text-left sticky left-6 md:left-14 z-40 bg-blue-600">
                  Student Name
                </th>

                {datesArray.map((date) => (
                  <th key={date} className="p-2 min-w-[48px]">
                    {date}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b">
                  <td className="p-1 md:p-3 font-semibold text-center sticky left-0 bg-white z-20 w-7 md:w-14">
                    {index + 1}
                  </td>

                  <td className="p-3 text-left min-w-[120px] md:min-w-[150px] font-medium bg-gray-50 sticky left-6 md:left-14 z-20">
                    {student?.name}
                  </td>

                  {datesArray.map((date) => {
                    const value =
                      attendance?.[selectedYear]?.[selectedMonth]?.[
                        student.id
                      ]?.[date] || "";

                    return (
                      <td key={date} className="p-1">
                        <select
                          value={value}
                          onChange={(e) =>
                            handleAttendanceChange(
                              student.id,
                              date,
                              e.target.value,
                            )
                          }
                          className={`w-12 h-8 border rounded text-center font-semibold
      ${
        value === "P"
          ? "bg-green-100 text-green-700 border-green-400"
          : value === "A"
            ? "bg-red-100 text-red-700 border-red-400"
            : value === "L"
              ? "bg-blue-100 text-blue-700 border-blue-400"
              : "bg-white text-gray-700"
      }
    `}
                        >
                          <option value="">-</option>
                          <option value="P">P</option>
                          <option value="A">A</option>
                          <option value="L">L</option>
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsAttendanceManagement;
