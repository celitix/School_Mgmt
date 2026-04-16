import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import DataTable from "../../components/common/DataTable";
import {
  allTeachersList,
  deleteTeacherDetail,
  singleTeacher,
  updateTeacher,
} from "../../apis/teachers/teachers";
import { MdOutlinePayments } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import UniversalButton from "../../components/common/UniversalButton";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import InputField from "../../components/common/InputField";
import UniversalDatePicker from "../../components/common/UniversalDatePicker";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaIdBadge,
  FaGraduationCap,
} from "react-icons/fa";
import { FaClock, FaHistory } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { getProcessMonthlySalary } from "../../apis/salary/salary";
const AllTeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTeacherData, setDeleteTeacherData] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [viewTeacherData, setViewTeacherData] = useState(null);
  console.log(viewTeacherData);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    enrollmentNo: "",
    qualification: "",
    exoperience: "",
    joiningDate: null,
  });

  const handleSearch = async () => {
    try {
      setSearchLoading(true);

      // Example API call
      await fetchTeachers();
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await allTeachersList({
        page: currentPage,
        limit: pageSize,
      });

      if (res?.data?.teachers) {
        setTeachers(res.data.teachers);
        setTotalRecords(res.data.meta.total);
      }
    } catch (error) {
      console.error("Fetch Teachers Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, pageSize]);

  const handleView = async (row) => {
    try {
      setViewVisible(true);
      setLoading(true);

      const res = await singleTeacher(row.id);
      const payload = res?.data?.isTeacherExist;

      setViewTeacherData(payload);
    } catch (error) {
      console.error("Error fetching teacher:", error);
      toast.error(error.message || "Teacher not found");
      setViewVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const DetailCard = ({ icon, label, value }) => {
    return (
      <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="text-indigo-600 text-lg mt-1">{icon}</div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-gray-800 font-medium mt-1">{value || "-"}</p>
        </div>
      </div>
    );
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        joiningDate: formData.joiningDate
          ? moment(formData.joiningDate).toISOString()
          : null,
      };

      const res = await updateTeacher(selectedTeacher.id, payload);

      if (res?.isSuccess) {
        toast.success("Teacher updated successfully");
        setEditVisible(false);
        fetchTeachers();
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

  const handleEdit = async (row) => {
    try {
      setLoading(true);

      // OPTIONAL (recommended): always fetch latest single teacher before edit
      const res = await singleTeacher(row.id);
      const teacher = res?.data?.isTeacherExist || row;

      setSelectedTeacher(teacher);
      setViewTeacherData(teacher);

      setFormData({
        name: teacher?.user?.name || "",
        phone: teacher?.user?.account?.phone || "",
        altPhone1: teacher?.altPhone1 || "",
        altPhone2: teacher?.altPhone2 || "",
        email: teacher?.user?.email || "",
        address: teacher?.user?.address || "",
        enrollmentNo: teacher?.enrollmentNo || "",
        qualification: teacher?.qualification || "",
        exoperience: teacher?.exoperience || teacher?.experience || "",
        joiningDate: teacher?.joiningDate
          ? moment(teacher.joiningDate).toDate()
          : null,
      });

      setEditVisible(true);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to load teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (row) => {
    setDeleteTeacherData(row);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      const res = await deleteTeacherDetail(deleteTeacherData?.id);
      console.log(res);
      if (res?.isSuccess) {
        toast.success("Teacher deleted successfully");
        setDeleteTeacherData(null);
        fetchTeachers();
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

  const columns = [
    {
      Header: "S.no",
      accessor: "srno",
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
      Header: "Enrollment No",
      accessor: "enrollmentNo",
    },
    {
      Header: "Joining Date",
      accessor: "joiningDate",
    },
    {
      Header: "Experience",
      accessor: "experience",
    },
    {
      Header: "Action",
      accessor: "action",
      align: "center",
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center gap-3">
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

  const teachersList = teachers?.map((index, e) => {
    return {
      ...index,
      srno: e + 1,
      _id: index.id,
      name: index.user.name,
      email: index.user.email,
      phone: index.user.account.phone,
      enrollmentNo: index.enrollmentNo,
      joiningDate: index.joiningDate
        ? moment(index.joiningDate).format("DD-MM-YYYY")
        : null,
      experience: index.exoperience,
      address: index.user.address,
      createdAt: index.createdAt,
      updatedAt: index.updatedAt,
    };
  });

  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-center md:justify-between w-full mb-4">
        {/* Left Title */}
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Teacher Details
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
            label="Add Teacher"
            onClick={() => navigate("/createteacter")}
          />
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={teachersList}
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
        header="Edit Teacher"
        visible={editVisible}
        className="w-full md:w-250"
        onHide={() => setEditVisible(false)}
        modal
        draggable={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <InputField
            label="Phone"
            type="tel"
            value={formData.phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
              if (value.length <= 10) {
                handleChange("phone", value);
              }
            }}
          />

          {formData.altPhone1 && (
            <InputField
              label="Alternate Phone 1"
              value={formData.altPhone1}
              onChange={(e) => handleChange("altPhone1", e.target.value)}
            />
          )}

          {formData.altPhone2 && (
            <InputField
              label="Alternate Phone 2"
              value={formData.altPhone2}
              onChange={(e) => handleChange("altPhone2", e.target.value)}
            />
          )}

          <InputField
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <InputField
            label="Enrollment No"
            value={formData.enrollmentNo}
            onChange={(e) => handleChange("enrollmentNo", e.target.value)}
          />

          <InputField
            label="Qualification"
            value={formData.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
          />

          <InputField
            label="Experience"
            value={formData.exoperience}
            onChange={(e) => handleChange("exoperience", e.target.value)}
          />

          <InputField
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <UniversalDatePicker
            label="Joining Date"
            value={formData.joiningDate}
            onChange={(date) => handleChange("joiningDate", date)}
          />
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <UniversalButton
            label={loading ? "Updating..." : "Update Teacher"}
            onClick={handleUpdate}
            disabled={loading}
          />
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
            Delete Teacher
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {deleteTeacherData?.name}{" "}
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
        header={null}
        visible={viewVisible}
        style={{ width: "650px" }}
        onHide={() => setViewVisible(false)}
        modal
        draggable={false}
        className="rounded-2xl"
      >
        <div className="rounded-2xl">
          {/* Top Profile Section */}
          <div className="flex flex-wrap items-center gap-4 border-b pb-5 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-md">
              {viewTeacherData?.user?.name?.slice(0, 1)}
            </div>

            {/* Name & Email */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {viewTeacherData?.user?.name}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <FaEnvelope /> {viewTeacherData?.user?.email}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <FaPhoneAlt /> {viewTeacherData?.user?.account?.phone}
              </p>
            </div>

            {/* Optional Status Badge */}
            <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full font-medium">
              Active
            </span>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {(viewTeacherData?.altPhone1 || viewTeacherData?.altPhone2) && (
              <DetailCard
                icon={<FaPhoneAlt />}
                label="Phone"
                value={[viewTeacherData?.altPhone1, viewTeacherData?.altPhone2]
                  .filter(Boolean)
                  .join(", ")}
              />
            )}

            <DetailCard
              icon={<FaIdBadge />}
              label="Enrollment No"
              value={viewTeacherData?.enrollmentNo}
            />

            <DetailCard
              icon={<FaGraduationCap />}
              label="Qualification"
              value={viewTeacherData?.qualification}
            />

            <DetailCard
              icon={<FaBriefcase />}
              label="Experience"
              value={viewTeacherData?.exoperience}
            />

            <DetailCard
              icon={<FaClock />}
              label="Created At"
              value={
                viewTeacherData?.createdAt
                  ? moment(viewTeacherData.createdAt).format(
                      "DD-MM-YYYY hh:mm A",
                    )
                  : "-"
              }
            />

            <DetailCard
              icon={<FaHistory />}
              label="Updated At"
              value={
                viewTeacherData?.updatedAt
                  ? moment(viewTeacherData.updatedAt).format(
                      "DD-MM-YYYY hh:mm A",
                    )
                  : "-"
              }
            />

            <DetailCard
              icon={<FaCalendarAlt />}
              label="Joining Date"
              value={
                viewTeacherData?.joiningDate
                  ? moment(viewTeacherData.joiningDate).format("DD-MM-YYYY")
                  : "-"
              }
            />

            {/* Full Width Address */}
            <div className="md:col-span-2">
              <DetailCard
                icon={<FaMapMarkerAlt />}
                label="Address"
                value={viewTeacherData?.user?.address}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AllTeachersList;
