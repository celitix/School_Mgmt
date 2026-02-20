import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";


// ICONS 
import { FaPhoneAlt, FaLock } from "react-icons/fa";

// APIS 
import { login, verifyOTP } from "@/apis/login/login";

// CUSTOM COMPONENTS
import InputField from "@/components/common/InputField";
import UniversalButton from "@/components/common/UniversalButton";
import { useRoleContext } from "@/context/RoleContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login");
  const [otpDetails, setOtpDetails] = useState({
    otpId: null,
    otp: "",
  });

  const { role, setRole } = useRoleContext();

  const [inputDetails, setInputDetails] = useState({
    userName: "",
    phoneNo: "",
  });

  const navigate = useNavigate();

  // Handle login
  async function handleLogin() {
    if (!inputDetails.phoneNo?.trim()) {
      return toast.error("Please enter phone number.");
    }

    setLoading(true);
    try {
      const payload = { phone: inputDetails.phoneNo };
      const res = await login(payload);
      if (res.isSuccess) {
        toast.success(res.message || "OTP Sent Successfully!");
        setOtpDetails({ otpId: res.data.otpId, otp: "" });
        setStep("otp");
      } else {
        toast.error(res.message || "Login failed!");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Handle OTP verification
  async function handleVerifyOtp() {
    if (!otpDetails.otp || otpDetails.otp.length !== 5) {
      return toast.error("Please enter a valid 5-digit OTP.");
    }

    setLoading(true);
    try {
      const payload = {
        otpId: otpDetails.otpId,
        otp: otpDetails.otp,
        phone: inputDetails.phoneNo,
      };

      const res = await verifyOTP(payload);

      if (res.isSuccess) {
        toast.success("OTP Verified Successfully!");

        // const { token, role } = res.data;
        const { token } = res.data;

        if (token) sessionStorage.setItem("token", token);
        // if (role) setRole(role);

        navigate("/");
      } else {
        toast.error(res.message || "OTP verification failed!");
      }
    } catch (err) {
      toast.error("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (otpDetails.otp.length === 5) {
      handleVerifyOtp()
    }
  }, [otpDetails.otp])


  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only single digit

    const otpArray = otpDetails.otp.split("");
    otpArray[index] = value;
    const otpString = otpArray.join("");
    setOtpDetails({ ...otpDetails, otp: otpString });

    // Move focus to next field if a digit is entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otpDetails.otp[index]) {
        const otpArray = otpDetails.otp.split("");
        otpArray[index] = "";
        setOtpDetails({ ...otpDetails, otp: otpArray.join("") });
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-blue-100/40 backdrop-blur-md"></div>
      {/* <div className="absolute top-8 left-8 flex items-center space-x-2 z-10">
        <img
          src="https://img.staticmb.com/mbimages/photo_dir/developer/original_images/60811/Manglam-Build-Developers-Ltd.-1564035303519-Manglam-Build.png"
          alt="Manglam Log"
          className="w-40 h-20"
        />
      </div> */}

      {/* Login Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-200/40 rounded-3xl p-10 w-full max-w-md sm:max-w-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-800 tracking-tight"
          >
            {step === "login" ? (
              <>Welcome Back 👋</>
            ) : (
              <div className="flex gap-2">
                Verify Your OTP <FaLock className="text-blue-600" />
              </div>
            )}
          </motion.h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {step === "login"
              ? "Log in to access your real estate dashboard"
              : "Enter the 5-digit OTP sent to your phone number"}
          </p>
        </div>

        {step === "login" ? (
          <>
            <motion.form
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <InputField
                icon={<FaPhoneAlt className="text-gray-400" />}
                label="Phone Number"
                placeholder="Enter your phone number"
                type="tel"
                value={inputDetails.phoneNo}
                onChange={(e) =>
                  setInputDetails({
                    ...inputDetails,
                    phoneNo: e.target.value.replace(/\D/g, ""),
                  })
                }
                maxLength={10}
              />

              <UniversalButton
                type="submit"
                label="Login"
                onClick={handleLogin}
                isLoading={loading}
                disabled={loading}
                variant="primary"
                className="w-full"
              />
            </motion.form>
          </>
        ) : (
          <motion.div
            className="flex flex-col space-y-6 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center space-x-3">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={otpDetails.otp[i] || ""}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputMode="numeric"
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none
                 transition-all duration-150 shadow-sm"
                />
              ))}
            </div>

            <UniversalButton
              label="Verify OTP"
              onClick={handleVerifyOtp}
              isLoading={loading}
              disabled={loading}
              variant="primary"
              className="w-full"
              icon={<FaLock />}
            />

            <button
              className="text-sm text-gray-600 hover:text-blue-600 underline"
              onClick={() => setStep("login")}
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Footer Credit */}
      <div className="absolute bottom-4 text-gray-500 text-xs">
        © {new Date().getFullYear()} Manglam Developers. All rights reserved.
      </div>
    </div>
  );
};

export default Login;