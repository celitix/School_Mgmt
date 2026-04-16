import React, { useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import UniversalDatePicker from "../../components/common/UniversalDatePicker";
import UniversalButton from "../../components/common/UniversalButton";
import { addStudent } from "../../apis/student/student";
import toast from "react-hot-toast";
import DropdownWithSearch from "../../components/common/DropdownWithSearch";
import { getAllClasses, getParticularClassSection } from "../../apis/classAndsections/classAndsections";
import { getAllAcademicYear } from "../../apis/academicYear/academicYear";
import { useNavigate } from "react-router-dom";
const CreateStudent = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
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
    academicYearId: null,
    admissionDate: null,
    photo: "",
  });

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

  const handleChange = async (field, value) => {
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
        sectionId: "", // reset section
      }));

      await fetchSections(value);
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

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    // if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    // else if (!/^\d{10}$/.test(formData.phone))
    //   newErrors.phone = "Phone must be 10 digits";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.age) newErrors.age = "Age is required";
    if (formData.dob) {
      const today = new Date();
      const selectedDate = new Date(formData.dob);

      if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.admissionNo)
      newErrors.admissionNo = "Admission No is required";
    if (!formData.rollNo) newErrors.rollNo = "Roll No is required";
    if (!formData.sectionId) newErrors.sectionId = "Section is required";
    if (!formData.academicYearId)
      newErrors.academicYearId = "Academic year is required";
    if (!formData.admissionDate)
      newErrors.admissionDate = "Admission date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      delete formData.classId;
      const payload = {
        ...formData,
        age: Number(formData.age),
        rollNo: Number(formData.rollNo),
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        admissionDate: formData.admissionDate
          ? new Date(formData.admissionDate).toISOString()
          : null,
      };

      const res = await addStudent(payload);

      if (res?.isSuccess) {
        toast.success("Student created successfully!");
        setFormData({
          name: "",
          email: "",
          address: "",
          age: "",
          dob: null,
          gender: "",
          bloodGroup: "",
          admissionNo: "",
          rollNo: "",
          sectionId: "",
          academicYearId: "",
          admissionDate: null,
          photo: "",
        });
        navigate("/studentsdetails");
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create student");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="bg-gradient-to-br from-blue-50 to-white p-0 md:p-6 flex justify-center items-center h-full">
        <div className="max-w-7xl mx-auto w-full bg-white shadow-xl rounded-2xl p-2 md:p-8 border border-gray-200">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Student
            </h2>
            <p className="text-gray-500 text-sm">
              Fill the details below to create a student profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            <InputField
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              placeholder="Enter full name"
            />

            {/* <InputField
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="Enter phone number"
            /> */}

            <InputField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              placeholder="Enter email"
            />

            <InputField
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              placeholder="Enter address"
            />

            <InputField
              label="Age"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              error={errors.age}
              placeholder="Enter age"
            />

            <UniversalDatePicker
              label="Date of Birth"
              value={formData.dob}
              onChange={(date) => handleChange("dob", date)}
              error={errors.dob}
            />

            {/* Gender Select */}

            <DropdownWithSearch
              label="Gender"
              name="gender"
              options={genderOptions}
              value={formData.gender}
              onChange={(selectedValue) =>
                handleChange("gender", selectedValue)
              }
            />

            {/* Blood Group */}
            <DropdownWithSearch
              label="Blood Group"
              name="bloodGroup"
              options={bloodGroupOptions}
              value={formData.bloodGroup}
              onChange={(selectedValue) =>
                handleChange("bloodGroup", selectedValue)
              }
            />

            <InputField
              label="Admission No"
              value={formData.admissionNo}
              onChange={(e) => handleChange("admissionNo", e.target.value)}
              error={errors.admissionNo}
              placeholder="Enter Admission No"
            />

            <InputField
              label="Roll No"
              value={formData.rollNo}
              onChange={(e) => handleChange("rollNo", e.target.value)}
              error={errors.rollNo}
              placeholder="Enter Roll No"
            />

            <DropdownWithSearch
              label="Class"
              options={classOptions}
              value={formData.classId}
              placeholder="Select Class"
              onChange={(value) => handleChange("classId", value)}
              error={errors.classId}
            />

            <DropdownWithSearch
              label="Section"
              value={formData.sectionId}
              options={sectionOptions}
              placeholder="Select Section"
              onChange={(value) => handleChange("sectionId", value)}
              error={errors.sectionId}
              disabled={!formData.classId}
            />

            <DropdownWithSearch
              label="Academic Year"
              options={academicYearOptions}
              value={formData.academicYearId}
              placeholder="Select Academic Year"
              onChange={(value) => handleChange("academicYearId", value)}
              error={errors.academicYearId}
            />

            <UniversalDatePicker
              label="Admission Date"
              value={formData.admissionDate}
              onChange={(date) => handleChange("admissionDate", date)}
              error={errors.admissionDate}
            />

            <InputField
              label="Photo URL"
              value={formData.photo}
              onChange={(e) => handleChange("photo", e.target.value)}
              error={errors.photo}
              placeholder="Enter photo URL"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <UniversalButton
              label={loading ? "Creating..." : "Create student"}
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
