import React, { useEffect, useState } from "react";
import UniversalButton from "../../components/common/UniversalButton";
import { FaSearch } from "react-icons/fa";
import DataTable from "../../components/common/DataTable";
import { Dialog } from "primereact/dialog";
import InputField from "../../components/common/InputField";
import UniversalDatePicker from "../../components/common/UniversalDatePicker";
import { MdEditNote } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { FaClock, FaHistory } from "react-icons/fa";
import moment from "moment";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaUserClock,
  FaTint,
  FaIdBadge,
  FaHashtag,
  FaCalendarAlt,
  FaLayerGroup,
  FaSchool,
  FaMapMarkerAlt,
  FaRegAddressCard,
  FaBriefcase,
} from "react-icons/fa";
import {
  addStudentGurdian,
  allStudentsList,
  deleteStudentDetail,
  singleStudent,
  updateStudent,
} from "../../apis/student/student";
import { useNavigate } from "react-router-dom";
import DropdownWithSearch from "../../components/common/DropdownWithSearch";
import UniversalTextArea from "../../components/common/UniversalTextArea";
import {
  getAllClasses,
  getParticularClassSection,
} from "../../apis/classAndsections/classAndsections";
import { getAllAcademicYear } from "../../apis/academicYear/academicYear";
const AllStudentsList = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStudentData, setDeleteStudentData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [viewStudentData, setViewStudentData] = useState(null);
  const [gurdianVisible, setGurdianVisible] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    dob: null,
    gender: "",
    bloodGroup: "",
    admissionNo: "",
    rollNo: "",
    classId: "",
    sectionId: "",
    academicYearId: "616ec590-7d79-4038-a674-9e1a422aead4",
    admissionDate: null,
    joiningDate: null,
    photo: "",
  });
  const [guardianData, setGuardianData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    type: null,
  });
  const handleSearch = async () => {
    try {
      setSearchLoading(true);

      // Example API call
      await fetchStudents();
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await allStudentsList({
        page: currentPage,
        limit: pageSize,
      });

      if (res?.data?.students) {
        setStudents(res.data.students);
        setTotalRecords(res.data.meta.total);
      }
    } catch (error) {
      console.error("Fetch Students Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize]);

  const handleStudentChange = async (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "classId") {
      setFormData((prev) => ({
        ...prev,
        classId: value,
        sectionId: prev.tempsectionId || "", // reset section
      }));

      await fetchSections(value);
    }
  };

  const fetchClassList = async () => {
    try {
      const res = await getAllClasses();

      if (res?.isSuccess) {
        const formatted = res.data.allClass.map((cls) => ({
          label: cls.name,
          value: cls.id,
        }));

        setClassOptions(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch class list", error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const res = await getParticularClassSection(classId);

      if (res?.isSuccess) {
        const formatted = res.data.sections.map((sec) => ({
          label: sec.name,
          value: sec.id,
        }));

        setSectionOptions(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const res = await getAllAcademicYear();

      if (res?.isSuccess) {
        const formatted = res.data.academicYears.map((year) => ({
          label: `${year.fromYear} - ${year.toYear}`,
          value: year.id,
        }));

        setAcademicYearOptions(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };

  useEffect(() => {
    fetchClassList();
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (!formData.classId) {
      setSectionOptions([]);
      return;
    }

    const selectedClass = classOptions.find(
      (c) => c.value === formData.classId,
    );

    if (selectedClass?.sections) {
      setSectionOptions(
        selectedClass.sections.map((sec) => ({
          label: sec.name,
          value: sec.id,
        })),
      );
    }
  }, [formData.classId, classOptions]);

  const columns = [
    {
      Header: "S.no",
      accessor: "srno",
      width: 50,
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
    },
    {
      Header: "Date of Birth",
      accessor: "dob",
    },
    {
      Header: "Gender",
      accessor: "gender",
    },
    {
      Header: "Admission No.",
      accessor: "admissionNo",
    },
    {
      Header: "Admission Date",
      accessor: "admissionDate",
    },
    {
      Header: "Action",
      accessor: "action",
      align: "center",
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center gap-3">
          {/* View */}
          <button
            onClick={() => handleGurdian(row)}
            className="text-blue-600 hover:text-blue-700 transition"
            title="View"
          >
            <FaRegAddressCard size={18} />
          </button>

          {/* View */}
          <button
            onClick={() => handleView(row)}
            className="text-green-600 hover:text-green-700 transition"
            title="View"
          >
            <IoEye size={18} />
          </button>

          {/* Edit */}
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-500 transition"
            title="Edit"
          >
            <MdEditNote size={18} />
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800 transition"
            title="Delete"
          >
            <MdOutlineDeleteForever size={18} />
          </button>
        </div>
      ),
    },
  ];

  const studentList = students?.map((index, e) => {
    return {
      ...index,
      srno: e + 1,
      id: index.id,
      name: index.user.name,
      email: index.user.email,
      phone: index?.user?.account?.phone,
      gender: index.gender,
      age: index.age,
      rollNo: index.rollNo,
      bloodGroup: index.bloodGroup,
      dob: index.dob ? moment(new Date(index.dob)).format("DD-MM-YYYY") : null,
      admissionDate: moment(index.admissionDate).format("DD-MM-YYYY"),
      sectionId: index.sectionId,
      admissionNo: index.admissionNo,
      academicYearId: index.academicYearId,
      address: index.user.address,
      createdAt: index.createdAt,
      updatedAt: index.updatedAt,
    };
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleEdit = async (row) => {
    try {
      setLoading(true);
      const res = await singleStudent(row.id);

      if (res?.data?.isStudentExist) {
        const student = res.data.isStudentExist;

        setSelectedStudent(student);

        await fetchSections(student?.section?.class?.id);

        setFormData({
          name: student?.user?.name || "",
          email: student?.user?.email || "",
          address: student?.user?.address || "",
          age: student?.age || "",
          gender: student?.gender || "",
          bloodGroup: student?.bloodGroup || "",
          rollNo: student?.rollNo || "",
          classId: student?.section?.class?.id || "",
          sectionId: student?.section?.id || "",
          academicYearId: student?.academicYear?.id || "",
          admissionNo: student?.admissionNo || "",
          dob: student?.dob ? moment(student.dob).toDate() : null,
          admissionDate: student?.admissionDate
            ? moment(student.admissionDate).toDate()
            : null,

          photo: student?.photo || "",

          tempsectionId: student?.section?.id || "",
        });

        setEditVisible(true);
      } else {
        toast.error("Failed to fetch student details");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
      };

      delete payload.classId;
      delete payload.tempsectionId;

      const res = await updateStudent(selectedStudent.id, payload);

      if (res?.isSuccess) {
        toast.success("Student updated successfully");
        setEditVisible(false);
        fetchStudents();
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (row) => {
    setDeleteStudentData(row);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      const res = await deleteStudentDetail(deleteStudentData?.id);
      if (res?.isSuccess) {
        toast.success("Student deleted successfully");
        setDeleteStudentData(null);
        fetchStudents();
        setDeleteVisible(false);
      } else {
        toast.error(res?.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="text-gray-500 mt-1">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-gray-800 font-medium">{value || "-"}</p>
      </div>
    </div>
  );

  const handleView = async (row) => {
    try {
      setLoading(true);

      const res = await singleStudent(row.id);

      if (res?.data?.isStudentExist) {
        setViewStudentData(res.data.isStudentExist);
        setViewVisible(true);
      } else {
        toast.error("Failed to fetch student details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGurdian = (row) => {
    setSelectedStudent(row);
    setGurdianVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setGuardianData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitGuardian = async () => {
    try {
      const payload = {
        studentId: selectedStudent?.id,
        ...guardianData,
      };

      await addStudentGurdian(payload);

      toast.success("Guardian added successfully");
      setGuardianData({
        type: "",
        name: "",
        phone: "",
        altPhone1: "",
        altPhone2: "",
        email: "",
        occupation: "",
        address: "",
        isPrimary: false,
      });
      setGurdianVisible(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const guardianTypeOptions = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Guardian", value: "Guardian" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  return (
    <div>
      <div className="">
        <div className="flex flex-wrap items-center justify-center md:justify-between w-full mb-4">
          {/* Left Title */}
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Student Details
          </h1>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <UniversalButton
              label={searchLoading ? "Searching..." : "Search"}
              onClick={handleSearch}
              disabled={searchLoading}
              icon={<FaSearch />}
            />

            <UniversalButton
              label="Add Student"
              onClick={() => navigate("/createStudent")}
            />
          </div>
        </div>
        <div>
          <DataTable
            columns={columns}
            data={studentList}
            // loading={loading}
            totalRecords={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

        <Dialog
          header="Edit Student"
          visible={editVisible}
          className="w-full md:w-250"
          onHide={() => setEditVisible(false)}
          modal
          draggable={false}
        >
          <div className="space-y-8">
            {/* ---------------- Personal Information ---------------- */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleStudentChange("name", e.target.value)}
                  placeholder="Enter full name"
                />

                <InputField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleStudentChange("email", e.target.value)}
                  placeholder="Enter email"
                />

                <InputField
                  label="Age"
                  min={1}
                  max={50}
                  value={formData.age}
                  placeholder="Enter age "
                  onChange={(e) => {
                    const value = e.target.value;

                    // allow empty input
                    if (value === "") {
                      handleStudentChange("age", "");
                      return;
                    }

                    const num = Number(value);

                    // allow only 1–50
                    if (num >= 1 && num <= 50) {
                      handleStudentChange("age", num);
                    }
                  }}
                />

                <UniversalDatePicker
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(date) => handleStudentChange("dob", date)}
                />

                <DropdownWithSearch
                  label="Gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => handleStudentChange("gender", value)}
                />

                <DropdownWithSearch
                  label="Blood Group"
                  options={bloodGroupOptions}
                  value={formData.bloodGroup}
                  onChange={(value) => handleStudentChange("bloodGroup", value)}
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={formData.address}
                    onChange={(e) =>
                      handleStudentChange("address", e.target.value)
                    }
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* ---------------- Academic Information ---------------- */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                Academic Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Admission No"
                  value={formData.admissionNo}
                  onChange={(e) =>
                    handleStudentChange("admissionNo", e.target.value)
                  }
                />

                <InputField
                  label="Roll No"
                  value={formData.rollNo}
                  onChange={(e) =>
                    handleStudentChange("rollNo", e.target.value)
                  }
                />

                <DropdownWithSearch
                  label="Class"
                  options={classOptions}
                  value={formData.classId}
                  placeholder="Select Class"
                  onChange={(value) => handleStudentChange("classId", value)}
                />

                <DropdownWithSearch
                  label="Section"
                  value={formData.sectionId}
                  options={sectionOptions}
                  placeholder="Select Section"
                  onChange={(value) => handleStudentChange("sectionId", value)}
                  disabled={!formData.classId}
                />

                <DropdownWithSearch
                  label="Academic Year"
                  options={academicYearOptions}
                  value={formData.academicYearId}
                  placeholder="Select Academic Year"
                  onChange={(value) =>
                    handleStudentChange("academicYearId", value)
                  }
                />

                <UniversalDatePicker
                  label="Admission Date"
                  value={formData.admissionDate}
                  onChange={(date) =>
                    handleStudentChange("admissionDate", date)
                  }
                />

                <InputField
                  label="Photo URL"
                  value={formData.photo}
                  onChange={(e) => handleStudentChange("photo", e.target.value)}
                />
              </div>
            </div>

            {/* ---------------- Buttons ---------------- */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <UniversalButton
                label="Cancel"
                variant="secondary"
                onClick={() => setEditVisible(false)}
              />

              <UniversalButton
                label={loading ? "Updating..." : "Update Student"}
                onClick={handleUpdate}
                disabled={loading}
              />
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={deleteVisible}
          style={{ width: "420px" }}
          onHide={() => setDeleteVisible(false)}
          modal
          closable={!deleteLoading}
          className="rounded-xl"
          draggable={false}
        >
          <div className="text-center px-6 py-6">
            {/* Danger Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                <MdOutlineDeleteForever className="text-red-600" size={30} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Student
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {deleteStudentData?.name}{" "}
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <UniversalButton
                label="Cancel"
                variant="secondary"
                onClick={() => setDeleteVisible(false)}
                disabled={deleteLoading}
              />

              <UniversalButton
                label={deleteLoading ? "Deleting..." : "Delete"}
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              />
            </div>
          </div>
        </Dialog>
        <Dialog
          header="Student Details"
          visible={viewVisible}
          className="w-full md:w-250"
          onHide={() => setViewVisible(false)}
          modal
          draggable={false}
        >
          <div className="p-2">
            {/* Name + Email */}
            <div className="bg-gray-50 p-4 rounded-lg border flex flex-wrap items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <img
                  src={
                    viewStudentData?.photo ||
                    `https://ui-avatars.com/api/?name=${viewStudentData?.user?.name}`
                  }
                  alt="Student"
                  className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shadow-md"
                />

                {/* Status Badge */}
                {viewStudentData?.status && (
                  <span
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full shadow-md
        ${
          viewStudentData.status === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
                  >
                    {viewStudentData.status}
                  </span>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {viewStudentData?.user?.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Class:{" "}
                  <span className="font-medium text-gray-700">
                    {viewStudentData?.section?.class?.name}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Admission No:{" "}
                  <span className="font-medium text-gray-700">
                    {viewStudentData?.admissionNo}
                  </span>
                </p>

                <div className="mt-4 grid md:grid-cols-2 grid-cols-1 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-indigo-500" />
                    <span>{viewStudentData?.user?.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-indigo-500" />
                    <span>
                      {" "}
                      {viewStudentData?.gurdians?.find((g) => g.isPrimary)
                        ?.gurdian?.user?.account?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="bg-gray-50 p-4 rounded-lg border mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm ">
                {/* Personal Info */}
                <DetailRow
                  icon={<FaVenusMars />}
                  label="Gender"
                  value={viewStudentData?.gender}
                />

                <DetailRow
                  icon={<FaBirthdayCake />}
                  label="Date of Birth"
                  value={
                    viewStudentData?.dob
                      ? moment(viewStudentData.dob).format("DD-MM-YYYY")
                      : "-"
                  }
                />

                <DetailRow
                  icon={<FaUserClock />}
                  label="Age"
                  value={viewStudentData?.age}
                />

                <DetailRow
                  icon={<FaTint />}
                  label="Blood Group"
                  value={viewStudentData?.bloodGroup}
                />

                <DetailRow
                  icon={<FaHashtag />}
                  label="Roll No"
                  value={viewStudentData?.rollNo}
                />

                <DetailRow
                  icon={<FaCalendarAlt />}
                  label="Admission Date"
                  value={
                    viewStudentData?.admissionDate
                      ? moment(viewStudentData.admissionDate).format(
                          "DD-MM-YYYY",
                        )
                      : "-"
                  }
                />

                <DetailRow
                  icon={<FaLayerGroup />}
                  label="Section"
                  value={viewStudentData?.section.name}
                />

                <DetailRow
                  icon={<FaSchool />}
                  label="Academic Year"
                  value={
                    viewStudentData?.academicYear.fromYear +
                    " - " +
                    viewStudentData?.academicYear.toYear
                  }
                />

                {/* System Info */}
                {/* <DetailRow
                  icon={<FaClock />}
                  label="Created At"
                  value={
                    viewStudentData?.createdAt
                      ? moment(viewStudentData.createdAt).format(
                          "DD-MM-YYYY hh:mm A",
                        )
                      : "-"
                  }
                /> */}

                {/* <DetailRow
                  icon={<FaHistory />}
                  label="Updated At"
                  value={
                    viewStudentData?.updatedAt
                      ? moment(viewStudentData.updatedAt).format(
                          "DD-MM-YYYY hh:mm A",
                        )
                      : "-"
                  }
                /> */}

                {/* Address Full Width */}
                <div className="md:col-span-2">
                  <DetailRow
                    icon={<FaMapMarkerAlt />}
                    label="Address"
                    value={viewStudentData?.user?.address}
                  />
                </div>
              </div>
            </div>
            <div className="pt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaRegAddressCard className="text-blue-600" />
                Guardian Details
              </h4>

              {viewStudentData?.gurdians?.length > 0 ? (
                <div className="space-y-6">
                  {viewStudentData.gurdians.map(({ gurdian }, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <DetailRow
                          icon={<FaUser />}
                          label="Name"
                          value={gurdian?.user?.name}
                        />

                        <DetailRow
                          icon={<FaIdBadge />}
                          label="Type"
                          value={gurdian?.type}
                        />

                        <DetailRow
                          icon={<FaPhoneAlt />}
                          label="Phone"
                          value={gurdian?.user?.account?.phone}
                        />

                        <DetailRow
                          icon={<FaEnvelope />}
                          label="Email"
                          value={gurdian?.user?.email}
                        />

                        <DetailRow
                          icon={<FaBriefcase />}
                          label="Occupation"
                          value={gurdian?.occupation}
                        />

                        <div className="md:col-span-2">
                          <DetailRow
                            icon={<FaMapMarkerAlt />}
                            label="Address"
                            value={gurdian?.user?.address}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No guardian added</p>
              )}
            </div>
          </div>
        </Dialog>

        <Dialog
          header="Guardian Details"
          visible={gurdianVisible}
          className="w-full md:w-200 rounded-xl"
          onHide={() => setGurdianVisible(false)}
          modal
          draggable={false}
        >
          <>
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DropdownWithSearch
                label="Guardian Type"
                options={guardianTypeOptions}
                value={guardianData.type}
                placeholder="Select Guardian Type"
                onChange={(value) =>
                  setGuardianData((prev) => ({
                    ...prev,
                    type: value,
                  }))
                }
              />
              <InputField
                label="Guardian Name"
                type="text"
                name="name"
                placeholder="Guardian Name"
                value={guardianData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Phone Number</label>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={guardianData.isPrimary}
                      onChange={(e) =>
                        setGuardianData((prev) => ({
                          ...prev,
                          isPrimary: e.target.checked,
                        }))
                      }
                      className="accent-indigo-600"
                    />
                    <span className="text-xs text-indigo-600 font-medium">
                      Primary
                    </span>
                  </div>
                </div>

                <InputField
                  type="text"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={guardianData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="Email"
                value={guardianData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <InputField
                label="Occupation"
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={guardianData.occupation}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <UniversalTextArea
                label="Address"
                name="address"
                placeholder="Address"
                value={guardianData.address}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex justify-center gap-3 pt-3">
              <UniversalButton
                label="Cancel"
                variant="secondary"
                onClick={() => setGurdianVisible(false)}
              />

              <UniversalButton label="Save" onClick={handleSubmitGuardian} />
            </div>
          </>
        </Dialog>
      </div>
    </div>
  );
};

export default AllStudentsList;
