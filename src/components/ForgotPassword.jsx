import React, { useState } from "react";
import emailjs from "emailjs-com";
import client, { databases } from "../appwrite";
import { Account, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const account = new Account(client);

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // Tracks the current step: 'email', 'otp', 'reset'
  const [email, setEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [Id, setId] = useState("");
  const [otpValidated, setOtpValidated] = useState(false);
  const [passwd, setPasswd] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const func = async (email) => {
    const result = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_USERS_COLLECTIONS
    );
    const user = result.documents.find((obj) => obj.email === email) || null;
    if (user) {
      setId(user.$id);
      setPasswd(user.password);
      console.log(user);
    }

    return user !== null;
  };

  const handleSendOtp = async () => {
    setLoadingState(true);
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (await func(email)) {
      const generatedOtp = generateOtp();
      setOtp(generatedOtp);

      // EmailJS service configuration
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID; // Replace with your EmailJS Service ID
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; // Replace with your EmailJS Template ID
      const userID = import.meta.env.VITE_EMAILJS_USERID; // Replace with your EmailJS User ID/Public Key

      const templateParams = {
        to_email: email,
        otp: generatedOtp, // Pass the generated OTP to the email template
      };

      emailjs.send(serviceID, templateID, templateParams, userID).then(
        (response) => {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
          alert("OTP sent to your email!");
        },
        (err) => {
          console.error("Failed to send email.", err);
          alert("Failed to send email. Please try again.");
        }
      );

      setStep("otp");
    } else {
      alert("Invalid Email");
    }
    setLoadingState(false);
  };

  const handleValidateOtp = async () => {
    if (enteredOtp === otp) {
      setOtpValidated(true);

      setStep("reset"); // Move to password reset step
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  const handlePasswordReset = async () => {
    setLoadingState(true);
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    /*
    const result = await databases.updateDocument(
    '<DATABASE_ID>', // databaseId
    '<COLLECTION_ID>', // collectionId
    '<DOCUMENT_ID>', // documentId
    {}, // data (optional)
    ["read("any")"] // permissions (optional)
);
    */
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID, // Replace with your Appwrite database ID
        import.meta.env.VITE_USERS_COLLECTIONS, // Replace with your Users Collection ID
        [Query.equal("email", email)] // Find user by email
      );
      const docId = response.documents[0].$id;
      const result = await databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID, // databaseId
        import.meta.env.VITE_USERS_COLLECTIONS, // collectionId
        docId, // documentId
        { password: newPassword }
      );
      console.log(result);

      alert("Password updated successfully!");
      setStep("reset");
      // Simulate password update (integrate Appwrite's password update API here)
      console.log("Password updated successfully:", newPassword);
      alert("Password updated successfully!");
      setEmail("");
      setEnteredOtp("");
      setId("");
      setPasswd("");
      setStep("email");
      navigate("/login");
    } catch (error) {
      console.log(error);
      setStep("reset");
      setNewPassword("");
      alert("Some Error Occured. Try Again");
    }
    setLoadingState(false);
    // Optionally, redirect to login or reset state
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-400 via-white to-blue-600 flex items-center justify-center">
      {loadingState && <Spinner />}
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl transform transition-all">
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
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
            />

            <button
              onClick={handleSendOtp}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none text-lg"
            >
              Send OTP
            </button>
            <a
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-indigo-600 inline-block  mt-2 cursor-pointer"
            >
              Go back to Login
            </a>
          </div>
        )}

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
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
            />
            <button
              onClick={handleValidateOtp}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none  text-lg"
            >
              Validate OTP
            </button>
            <button
              onClick={handleSendOtp}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none  text-lg"
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
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
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
