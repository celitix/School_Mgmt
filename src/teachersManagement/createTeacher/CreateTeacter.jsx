import React, { useState } from "react";
import UniversalDatePicker from "../../components/common/UniversalDatePicker";
import UniversalButton from "../../components/common/UniversalButton";
import InputField from "../../components/common/InputField";
import toast from "react-hot-toast";
import { addTeacher } from "../../apis/teachers/teachers";
import { useNavigate } from "react-router-dom";

const CreateTeacher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    altPhone1: "",
    altPhone2: "",
    email: "",
    address: "",
    enrollmentNo: "",
    qualification: "",
    exoperience: "",
    joiningDate: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // ✅ Validation Function
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.altPhone1.trim()) newErrors.altPhone1 = "Alternate phone is required";
    if (!/^\d{10}$/.test(formData.altPhone1))
      newErrors.altPhone1 = "Alternate phone must be 10 digits";

    if (!formData.altPhone2.trim()) newErrors.altPhone2 = "Alternate phone is required";
    if (!/^\d{10}$/.test(formData.altPhone2))
      newErrors.altPhone2 = "Alternate phone must be 10 digits";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.enrollmentNo.trim())
      newErrors.enrollmentNo = "Enrollment number is required";

    if (!formData.qualification.trim())
      newErrors.qualification = "Qualification is required";

    if (!formData.exoperience.trim())
      newErrors.exoperience = "Experience is required";

    if (!formData.address) newErrors.address = "Address is required";

    if (!formData.joiningDate)
      newErrors.joiningDate = "Joining date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        joiningDate: formData.joiningDate
          ? new Date(formData.joiningDate).toISOString()
          : null,
      };

      const res = await addTeacher(payload);

      if (res?.isSuccess) {
        toast.success("Teacher created successfully!");
        setFormData({
          name: "",
          phone: "",
          altPhone1: "",
          altPhone2: "",
          email: "",
          address: "",
          enrollmentNo: "",
          qualification: "",
          exoperience: "",
          joiningDate: null,
        });
        navigate("/teachersdetails");
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

    <div className="bg-gradient-to-br from-blue-50 to-white p-0 md:p-6 flex justify-center items-center h-full">
      <div className="max-w-7xl mx-auto w-full bg-white shadow-xl rounded-2xl p-4 md:p-8 border border-gray-200 mb-2">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Teacher</h2>
          <p className="text-gray-500 text-sm">
            Fill the details below to create a teacher profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="Enter Name"
            errorText={errors.name}
          />

          <InputField
            label="Phone"
            value={formData.phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
              if (value.length <= 10) {
                handleChange("phone", value);
              }
            }}
            error={errors.phone}
            placeholder="Enter phone number"
            errorText={errors.phone}
          />

          
          <InputField
            label="Alternate Phone 1"
            value={formData.altPhone1}
            error={errors.altPhone1}
            placeholder="Enter Alternate Phone number"
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
              if (value.length <= 10) {
                handleChange("altPhone1", value);
              }
            }}
            errorText={errors.phone}
          />
          <InputField
            label="Alternate Phone 2"
            value={formData.altPhone2}
            error={errors.altPhone2}
            placeholder="Enter Alternate Phone number"
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
              if (value.length <= 10) {
                handleChange("altPhone2", value);
              }
            }}
            errorText={errors.altPhone1}
          />

          <InputField
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            placeholder="Enter Email Id"
            errorText={errors.email}
          />

          <InputField
            label="Enrollment No"
            value={formData.enrollmentNo}
            onChange={(e) => handleChange("enrollmentNo", e.target.value)}
            error={errors.enrollmentNo}
            placeholder="Enter enrollment number"
            errorText={errors.enrollmentNo}
          />

          <InputField
            label="Qualification"
            value={formData.qualification}
            onChange={(e) => handleChange("qualification", e.target.value)}
            error={errors.qualification}
            placeholder="Enter Qualification"
            errorText={errors.qualification}
          />

          <InputField
            label="Experience"
            value={formData.exoperience}
            onChange={(e) => handleChange("exoperience", e.target.value)}
            error={errors.exoperience}
            placeholder="Enter Experience"
            errorText={errors.exoperience}
          />

          <InputField
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
            placeholder="Enter Address"
            errorText={errors.address}
          />

          <UniversalDatePicker
            label="Joining Date"
            value={formData.joiningDate}
            onChange={(date) => handleChange("joiningDate", date)}
            error={errors.joiningDate}
            errorText={errors.joiningDate}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <UniversalButton
            label={loading ? "Creating..." : "Create Teacher"}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateTeacher;
