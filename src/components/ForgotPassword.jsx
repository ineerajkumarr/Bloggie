import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpValidated, setOtpValidated] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const navigate = useNavigate();

  // SEND OTP
  const handleSendOtp = async () => {
    setLoadingState(true);

    try {
      if (!email) {
        alert("Please enter your email");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_USERS_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      alert("OTP sent successfully!");
      setStep("otp");
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoadingState(false);
    }
  };

  // VERIFY OTP
  const handleValidateOtp = async () => {
    setLoadingState(true);

    try {
      if (!enteredOtp) {
        alert("Please enter OTP");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_USERS_URL}/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: enteredOtp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      setOtpValidated(true);
      setStep("reset");

      alert("OTP verified successfully!");
    } catch (error) {
      alert(error.message || "OTP verification failed");
    } finally {
      setLoadingState(false);
    }
  };

  // RESET PASSWORD
  const handlePasswordReset = async () => {
    setLoadingState(true);

    try {
      if (!newPassword) {
        alert("Please enter new password");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_USERS_URL}/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      alert("Password updated successfully!");

      setEmail("");
      setEnteredOtp("");
      setNewPassword("");
      setOtpValidated(false);
      setStep("email");

      navigate("/login");
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-400 via-white to-blue-600 flex items-center justify-center">
      {loadingState && <Spinner />}

      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl transform transition-all">
        {/* EMAIL STEP */}
        {step === "email" && (
          <div className="email-step">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Forgot Password
            </h2>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none"
            />

            <button
              onClick={handleSendOtp}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none text-lg"
            >
              Send OTP
            </button>

            <a
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-indigo-600 inline-block mt-2 cursor-pointer"
            >
              Go back to Login
            </a>
          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="otp-step">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Verify OTP
            </h2>

            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter OTP"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none"
            />

            <button
              onClick={handleValidateOtp}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none text-lg"
            >
              Validate OTP
            </button>

            <button
              onClick={handleSendOtp}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none text-lg"
            >
              Resend OTP
            </button>

            <a
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-indigo-600 hover:underline inline-block mt-2 cursor-pointer"
            >
              Go back to Login
            </a>
          </div>
        )}

        {/* RESET PASSWORD STEP */}
        {step === "reset" && otpValidated && (
          <div className="password-reset-step">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Reset Password
            </h2>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none"
            />

            <button
              onClick={handlePasswordReset}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none text-lg"
            >
              Reset Password
            </button>

            <a
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer mt-2 inline-block"
            >
              Go back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
