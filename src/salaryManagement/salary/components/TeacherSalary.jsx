import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import DataTable from "@/components/common/DataTable";
import { allTeachersList, singleTeacher } from "@/apis/teachers/teachers";
import { MdOutlinePayments } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import UniversalButton from "@/components/common/UniversalButton";
import moment from "moment/moment";
import InputField from "@/components/common/InputField";
import DropdownWithSearch from "@/components/common/DropdownWithSearch";
import UniversalDatePicker from "@/components/common/UniversalDatePicker";
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
import { TbCreditCardPay } from "react-icons/tb";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoInformationCircleSharp } from "react-icons/io5";
import {
  getProcessMonthlySalary,
  getMonthlySalary,
} from "@/apis/salary/salary";
import {
  createSalaryAdjustmentBulk,
  createSalaryPay,
  deleteSalary,
  getSingleUserSalaryStructure,
  updateSalary,
} from "../../../apis/salary/salary";

const TeacherSalary = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewVisible, setViewVisible] = useState(false);
  const [viewTeacherData, setViewTeacherData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [salaryVisible, setSalaryVisible] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const today = new Date();
  const [viewMonthwise, setViewMonthwise] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [savingAdjustments, setSavingAdjustments] = useState(false);
  const [adjustmentDialogVisible, setAdjustmentDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [updatingSalary, setUpdatingSalary] = useState(false);
  const [deletingSalary, setDeletingSalary] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSalaryData, setDeleteSalaryData] = useState(null);
  const [processedIds, setProcessedIds] = useState([]);
  const [extraEntries, setExtraEntries] = useState([
    {
      salaryId: "",
      title: "",
      type: null,
      amount: "",
    },
  ]);
  const handleExtraChange = (index, field, value) => {
    const updated = [...extraEntries];
    updated[index][field] = value;
    setExtraEntries(updated);
  };

  const handleSubmitExtras = async () => {
    try {
      if (!salaryDetails?.id) {
        toast.error("Salary ID not found");
        return;
      }

      // Validation
      const invalid = extraEntries.some(
        (entry) =>
          !entry.title ||
          !entry.type ||
          !entry.amount ||
          Number(entry.amount) <= 0,
      );

      if (invalid) {
        toast.error("Please fill all fields properly");
        return;
      }

      const payload = {
        data: extraEntries.map((entry) => ({
          salaryId: salaryDetails.id,
          title: entry.title,
          type: entry.type,
          amount: Number(entry.amount),
        })),
      };

      console.log("Submitting Payload:", payload);

      const res = await createSalaryAdjustmentBulk(payload);

      if (res?.isSuccess) {
        toast.success("Salary adjustment added successfully");
        fetchMonthlySalary();
        handlemonthlySalary({ user: { id: selectedTeacherId } });

        setExtraEntries([
          {
            salaryId: "",
            title: "",
            type: "ALLOWANCE",
            amount: "",
          },
        ]);
      } else {
        toast.error(res?.error?.message || "Failed to add adjustment");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  const addExtraRow = () => {
    setExtraEntries([
      ...extraEntries,
      {
        salaryId: "",
        title: "",
        type: "ALLOWANCE",
        amount: "",
      },
    ]);
  };

  const removeExtraRow = (index) => {
    const updated = extraEntries.filter((_, i) => i !== index);
    setExtraEntries(updated);
  };

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
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
      setLoading(true);

      const teacherId = row?.user?.id;

      if (!teacherId) {
        toast.error("Teacher ID not found");
        return;
      }

      setSelectedTeacherId(teacherId);

      // Fetch Teacher Details
      const teacherRes = await singleTeacher(row.id);
      const teacherPayload = teacherRes?.data?.isTeacherExist;
      setViewTeacherData(teacherPayload);

      // Fetch Salary Structure
      const salaryRes = await getSingleUserSalaryStructure(teacherId);

      if (salaryRes?.isSuccess) {
        setSalaryStructure(salaryRes?.data?.data?.[0] || null);
      } else {
        setSalaryStructure(null);
      }

      setViewVisible(true);
    } catch (error) {
      console.error("Error fetching teacher:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // const handlemonthlySalary = async (row) => {
  //   try {
  //     const teacherId = row?.user?.id;

  //     if (!teacherId) {
  //       toast.error("Teacher ID not found");
  //       return;
  //     }

  //     setSelectedTeacherId(teacherId);
  //     setViewMonthwise(true); // Open dialog

  //     setLoading(true);

  //     const res = await getMonthlySalary(teacherId, {
  //       month: selectedMonth,
  //       year: selectedYear,
  //     });

  //     if (res?.isSuccess) {
  //       setSalaryDetails(res.data.data);
  //     } else {
  //       setSalaryDetails(null);
  //       toast.error(res?.error?.message || "Salary not found");
  //     }
  //   } catch (error) {
  //     setSalaryDetails(null);
  //     toast.error(
  //       error?.response?.data?.error?.message || "Something went wrong",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlemonthlySalary = (row) => {
    const teacherId = row?.user?.id;

    if (!teacherId) {
      toast.error("Teacher ID not found");
      return;
    }

    const today = new Date();

    // ✅ Reset to current month & year
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());

    setSelectedTeacherId(teacherId);
    setViewMonthwise(true);
  };

  useEffect(() => {
    if (viewMonthwise && selectedTeacherId) {
      fetchMonthlySalary();
    }
  }, [viewMonthwise, selectedMonth, selectedYear]);

  const fetchMonthlySalary = async () => {
    if (!selectedTeacherId) return;

    try {
      setLoading(true);

      const res = await getMonthlySalary(selectedTeacherId, {
        month: selectedMonth,
        year: selectedYear,
      });

      if (res?.isSuccess) {
        setSalaryDetails(res.data.data);
      } else {
        setSalaryDetails(null);
      }
    } catch (error) {
      setSalaryDetails(null);
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

  const handleProcessSalary = async (row) => {
    const teacherId = row?.user?.id;

    if (!teacherId) {
      toast.error("Teacher ID not found");
      return;
    }

    try {
      setProcessingId(teacherId);

      const res = await getProcessMonthlySalary(teacherId);

      if (res?.isSuccess) {
        toast.success("Salary processed successfully");
        fetchTeachers();
      } else {
        toast.error(res?.message?.message || "Salary processing failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const columns = [
    {
      Header: "S.no",
      accessor: "srno",
      width: 50,
    },
    {
      Header: "Name",
      accessor: "name",
      width: 200,
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
        <div className="flex items-center justify-start gap-3">
          {/* View */}
          <button
            onClick={() => handleView(row)}
            className="text-green-600 hover:text-green-700 transition"
            title="View"
          >
            <IoEye size={18} />
          </button>

          {/* Process Salary */}
          {row.isCurrentMonthSalaryExist && !row?.isMonthlySalaryProcessed && (
            <button
              onClick={() => handleProcessSalary(row)}
              disabled={processingId === row?.user?.id}
              className={`${
                processingId === row?.user?.id
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-500"
              } transition`}
              title="Process Salary"
            >
              <MdOutlinePayments size={18} />
            </button>
          )}

          {/* monthly salary */}
          <button
            onClick={() => handlemonthlySalary(row)}
            className="text-green-600 hover:text-green-700 transition"
            title="Monthly salary and Pay"
          >
            <TbCreditCardPay size={18} />
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
      isMonthlySalaryProcessed: index.isMonthlySalaryProcessed,
      isCurrentMonthSalaryExist: index.isCurrentMonthSalaryExist,
    };
  });

  const handlePaySalary = async () => {
    try {
      if (!salaryDetails?.id) {
        toast.error("Salary ID not found");
        return;
      }

      setSavingAdjustments(true);

      try {
        const res = await handleSubmitExtras();
      } catch (error) {
        console.error("Pay Salary Error:", error);
        toast.error(
          error?.response?.data?.error?.message ||
            error?.message ||
            "Something went wrong",
        );
      }

      const res = await createSalaryPay(salaryDetails.id);

      if (res?.isSuccess) {
        toast.success("Salary paid successfully");

        // Refresh salary details
        handlemonthlySalary({ user: { id: selectedTeacherId } });
      } else {
        toast.error(res?.error?.message || "Payment failed");
      }
    } catch (error) {
      console.error("Pay Salary Error:", error);
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setSavingAdjustments(false);
    }
  };

  const handleEdit = (salaryStructure) => {
    if (!salaryStructure) {
      toast.error("Salary structure not found");
      return;
    }

    setEditingSalary({
      id: salaryStructure.id,
      basicSalary: salaryStructure.basicSalary,
      hra: salaryStructure.hra,
      allowance: salaryStructure.allowance,
      pf: salaryStructure.pf,
      esi: salaryStructure.esi,
      professionalTax: salaryStructure.professionalTax,
      effectiveFrom: salaryStructure.effectiveFrom,
      effectiveTo: salaryStructure.effectiveTo,
    });

    setEditDialogVisible(true);
  };

  const handleEditChange = (field, value) => {
    setEditingSalary((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateSalary = async () => {
    try {
      if (!editingSalary?.id) {
        toast.error("Salary ID missing");
        return;
      }

      setUpdatingSalary(true);

      const payload = {
        basicSalary: Number(editingSalary.basicSalary),
        hra: Number(editingSalary.hra),
        allowance: Number(editingSalary.allowance),
        pf: Number(editingSalary.pf),
        esi: Number(editingSalary.esi),
        professionalTax: Number(editingSalary.professionalTax),
        effectiveFrom: editingSalary.effectiveFrom,
        effectiveTo: editingSalary.effectiveTo,
      };

      const res = await updateSalary(editingSalary.id, payload);

      if (res?.isSuccess) {
        toast.success("Salary updated successfully");

        setEditDialogVisible(false);
        const salaryRes = await getSingleUserSalaryStructure(selectedTeacherId);

        if (salaryRes?.isSuccess) {
          setSalaryStructure(salaryRes?.data?.data?.[0] || null);
        }
      } else {
        toast.error(res?.error?.message || "Update failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setUpdatingSalary(false);
    }
  };

  const handleDelete = (salaryStructure) => {
    if (!salaryStructure?.id) {
      toast.error("Salary structure not found");
      return;
    }
    setDeleteSalaryData(salaryStructure);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteSalaryData?.id) return;

    try {
      setDeleteLoading(true);

      const res = await deleteSalary(deleteSalaryData.id);

      if (res?.isSuccess) {
        toast.success("Salary structure deleted successfully");

        setSalaryStructure(null);
        setDeleteVisible(false);
        setDeleteSalaryData(null);

        // Refresh salary structure
        const salaryRes = await getSingleUserSalaryStructure(selectedTeacherId);

        if (salaryRes?.isSuccess) {
          setSalaryStructure(salaryRes?.data?.data?.[0] || null);
        }
      } else {
        toast.error(res?.error?.message || "Delete failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-between w-full mb-4">
        {/* Left Title */}
        <h1 className="text-xl font-semibold text-gray-800">Teacher Details</h1>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <UniversalButton
            label={searchLoading ? "Searching..." : "Search"}
            onClick={handleSearch}
            disabled={searchLoading}
            icon={<FaSearch />}
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
        header={null}
        visible={viewVisible}
        onHide={() => setViewVisible(false)}
        modal
        draggable={false}
        className="rounded-2xl w-full lg:w-1/2"
      >
        <div className="rounded-2xl">
          {/* Top Profile Section */}
          <div className="flex flex-wrap items-center gap-4 border-b pb-3 mb-4">
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
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Basic Information
          </h3>
          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
            <DetailCard
              icon={<FaPhoneAlt />}
              label="Phone"
              value={[viewTeacherData?.altPhone1, viewTeacherData?.altPhone2]
                .filter(Boolean)
                .join(", ")}
            />

            <DetailCard
              icon={<FaGraduationCap />}
              label="Qualification"
              value={viewTeacherData?.qualification}
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

          {/* Salary Structure Section */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-md font-semibold text-gray-800">
                Salary Structure
              </h3>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleEdit(salaryStructure)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                  title="Edit"
                >
                  <MdEditNote size={18} />
                </button>

                <button
                  onClick={() => handleDelete(salaryStructure)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                  title="Delete"
                >
                  <MdOutlineDeleteForever size={18} />
                </button>
              </div>
            </div>

            {!salaryStructure ? (
              <p className="text-sm text-gray-500 w-full text-center">
                No salary structure found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <DetailCard
                  icon={<FaMoneyBillWave />}
                  label="Basic Salary"
                  value={`₹ ${salaryStructure.basicSalary}`}
                />

                <DetailCard
                  icon={<FaMoneyBillWave />}
                  label="HRA"
                  value={`₹ ${salaryStructure.hra}`}
                />

                <DetailCard
                  icon={<FaMoneyBillWave />}
                  label="Allowance"
                  value={`₹ ${salaryStructure.allowance}`}
                />

                <DetailCard
                  icon={<FaMoneyBillWave />}
                  label="PF"
                  value={`₹ ${salaryStructure.pf}`}
                />

                <DetailCard
                  icon={<FaMoneyBillWave />}
                  label="ESI"
                  value={`₹ ${salaryStructure.esi}`}
                />

                <DetailCard
                  icon={<FaMoneyBillWave />}
                  label="Professional Tax"
                  value={`₹ ${salaryStructure.professionalTax}`}
                />

                <DetailCard
                  icon={<FaCalendarAlt />}
                  label="Effective From"
                  value={moment(salaryStructure.effectiveFrom).format(
                    "DD-MM-YYYY",
                  )}
                />

                <DetailCard
                  icon={<FaCalendarAlt />}
                  label="Effective To"
                  value={moment(salaryStructure.effectiveTo).format(
                    "DD-MM-YYYY",
                  )}
                />
              </div>
            )}
          </div>
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
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                  <MdOutlineDeleteForever className="text-red-600" size={30} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Salary Structure
              </h3>

              {/* Message */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Are you sure you want to delete this salary structure?
                <br />
                <span className="font-semibold text-red-600">
                  Basic: ₹ {deleteSalaryData?.basicSalary}
                </span>
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
            header="Edit Salary Structure"
            visible={editDialogVisible}
            onHide={() => setEditDialogVisible(false)}
            modal
            draggable={false}
            className="rounded-2xl w-full lg:w-1/2"
          >
            {editingSalary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Basic Salary"
                  value={editingSalary.basicSalary}
                  onChange={(e) =>
                    handleEditChange("basicSalary", e.target.value)
                  }
                />

                <InputField
                  label="HRA"
                  value={editingSalary.hra}
                  onChange={(e) => handleEditChange("hra", e.target.value)}
                />

                <InputField
                  label="Allowance"
                  value={editingSalary.allowance}
                  onChange={(e) =>
                    handleEditChange("allowance", e.target.value)
                  }
                />

                <InputField
                  label="PF"
                  value={editingSalary.pf}
                  onChange={(e) => handleEditChange("pf", e.target.value)}
                />

                <InputField
                  label="ESI"
                  value={editingSalary.esi}
                  onChange={(e) => handleEditChange("esi", e.target.value)}
                />

                <InputField
                  label="Professional Tax"
                  value={editingSalary.professionalTax}
                  onChange={(e) =>
                    handleEditChange("professionalTax", e.target.value)
                  }
                />

                <UniversalDatePicker
                  label="Effective From"
                  value={editingSalary.effectiveFrom}
                  onChange={(date) => handleEditChange("effectiveFrom", date)}
                />

                <UniversalDatePicker
                  label="Effective To"
                  value={editingSalary.effectiveTo}
                  onChange={(date) => handleEditChange("effectiveTo", date)}
                />

                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <UniversalButton
                    label={updatingSalary ? "Updating..." : "Update Salary"}
                    onClick={handleUpdateSalary}
                    disabled={updatingSalary}
                  />
                </div>
              </div>
            )}
          </Dialog>
        </div>
      </Dialog>
      <Dialog
        header="Salary Details"
        visible={viewMonthwise}
        onHide={() => {
          setViewMonthwise(false);
          const today = new Date();
          setSelectedMonth(today.getMonth() + 1);
          setSelectedYear(today.getFullYear());
        }}
        modal
        draggable={false}
        className="rounded-2xl w-full lg:w-1/2"
      >
        <div>
          <div className="flex flex-wrap items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 mb-4 space-y-1">
            {/* Left Label */}
            <div>
              <div className="flex items-center justify-between gap-5">
                <p className="text-lg font-semibold text-gray-800">
                  Salary Details
                </p>
                {/* <p className="text-sm font-semibold text-gray-800">
                  {new Date(0, selectedMonth - 1).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {selectedYear}
                </p> */}
              </div>
              <div className="flex  items-center gap-3">
                <p className="text-sm font-semibold text-gray-600">
                  Salary Status
                </p>
                <div
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    salaryDetails?.status === "SUCCESS"
                      ? "bg-green-100 text-green-600"
                      : salaryDetails?.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : salaryDetails?.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {salaryDetails?.status || "N/A"}
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Month Dropdown */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="appearance-none border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {[2024, 2025, 2026, 2027].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!salaryDetails ? (
            <div className="text-center py-6 text-gray-500">
              No salary found for selected month.
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                <div className="flex justify-between">
                  <span>Basic</span>
                  <span>₹ {salaryDetails.basic}</span>
                </div>

                <div className="flex justify-between">
                  <span>HRA</span>
                  <span>₹ {salaryDetails.hra}</span>
                </div>

                <div className="flex justify-between">
                  <span>Allowance</span>
                  <span>₹ {salaryDetails.allowance}</span>
                </div>

                <div className="flex justify-between text-red-600">
                  <span>Fixed Deductions</span>
                  <span>- ₹ {salaryDetails.fixedDeductions}</span>
                </div>

                <div className="flex justify-between text-red-600">
                  <span className="flex items-center gap-2">
                    Variable Deductions
                    <IoInformationCircleSharp
                      className="info-icon text-gray-400 hover:text-indigo-600 cursor-pointer"
                      size={18}
                      onClick={() => setAdjustmentDialogVisible(true)}
                    />
                  </span>
                  <span>- ₹ {salaryDetails.variableDeductions}</span>
                </div>

                <div className="flex justify-between">
                  <span>Bonus</span>
                  <span>₹ {salaryDetails.bonus}</span>
                </div>

                <hr />

                <div className="flex justify-between font-semibold">
                  <span>Gross Salary</span>
                  <span>₹ {salaryDetails.grossSalary}</span>
                </div>

                <div className="flex justify-between font-bold text-green-600 text-lg">
                  <span>Net Salary</span>
                  <span>₹ {salaryDetails.netSalary}</span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      salaryDetails.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {salaryDetails.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Extra Allowance / Deduction Section */}
        {salaryDetails?.status === "PENDING" && (
          <div>
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-3">
                  Add Allowance
                </h3>
                <button
                  onClick={addExtraRow}
                  className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm"
                >
                  + Add More
                </button>
              </div>

              {extraEntries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end"
                >
                  {/* Title */}
                  <InputField
                    label="Title"
                    value={entry.title}
                    onChange={(e) =>
                      handleExtraChange(index, "title", e.target.value)
                    }
                    placeholder="Enter title"
                  />

                  {/* Type Dropdown */}
                  <DropdownWithSearch
                    label="Type"
                    options={[
                      { label: "Allowance", value: "ALLOWANCE" },
                      { label: "Deduction", value: "DEDUCTION" },
                    ]}
                    value={entry.type}
                    onChange={(value) =>
                      handleExtraChange(index, "type", value)
                    }
                  />

                  {/* Amount */}
                  <InputField
                    label="Amount"
                    value={entry.amount}
                    onChange={(e) =>
                      handleExtraChange(index, "amount", e.target.value)
                    }
                    placeholder="Enter amount"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeExtraRow(index)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 mt-5">
              <UniversalButton
                label={savingAdjustments ? "Saving..." : "Save Adjustments"}
                onClick={handleSubmitExtras}
                disabled={savingAdjustments}
              />
              <UniversalButton
                label={savingAdjustments ? "Paying..." : "Pay Salary"}
                onClick={handlePaySalary}
                disabled={savingAdjustments}
              />
            </div>
          </div>
        )}

        <Dialog
          header="Salary Adjustments"
          visible={adjustmentDialogVisible}
          onHide={() => setAdjustmentDialogVisible(false)}
          modal
          draggable={false}
          className="rounded-2xl w-full lg:w-100"
        >
          {!salaryDetails?.adjustments?.length ? (
            <div className="text-center py-6 text-gray-500">
              No adjustments found.
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {salaryDetails?.adjustments?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border rounded-lg p-3 bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {moment(item.createdAt).format("DD-MM-YYYY hh:mm A")}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.type === "ALLOWANCE"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.type}
                    </span>

                    <p
                      className={`mt-1 font-semibold ${
                        item.type === "ALLOWANCE"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.type === "ALLOWANCE" ? "+" : "-"} ₹ {item.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Dialog>
      </Dialog>
    </div>
  );
};

export default TeacherSalary;
