import React, { useState, useEffect } from "react";
import client from "../appwrite";
import { databases } from "../appwrite";
import { Account, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

function Login() {
  const [userId, setUserId] = useState("");
  const [passwd, setPasswd] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const account = new Account(client);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prev = useSelector((state) => state.auth.userId);

  // Redirect if a user is already logged in
  useEffect(() => {
    if (prev) {
      console.log("Can't access login page while logged in.");
      navigate(`/profile/${prev}`);
    } else {
      console.log("No active session found.");
    }
  }, [prev, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Fetch user data from Appwrite Users Collection
      const response = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID, // Replace with your Appwrite database ID
        import.meta.env.VITE_USERS_COLLECTIONS, // Replace with your Users Collection ID
        [Query.equal("email", userId)] // Find user by email
      );
      console.log("RESPONSE", response);

      if (response.documents.length === 0) {
        setError("User not found. Please check your email.");
        setLoading(false);
        return;
      }

      const user = response.documents[0];

      // Step 2: Check if password matches
      if (user.password !== passwd) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      // Step 3: Store user session in Redux & redirect
      dispatch(login(user));
      navigate(`/profile/${user.userId}`);
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const forgetPasswd = () => {
    console.log("Redirecting to forgot password page...");
    navigate("/forgotpassword");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking session...
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-400 via-white to-blue-600 flex items-center justify-center">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl transform transition-all">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Sign in to your account
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Your email
            </label>
            <input
              type="email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              name="email"
              id="email"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              name="password"
              id="password"
              placeholder="Password"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-3 focus:ring-indigo-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a
              onClick={forgetPasswd}
              href="#"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button with Spinner */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:bg-indigo-300 text-lg flex items-center justify-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin text-white text-2xl" />
            ) : (
              "Log in"
            )}
          </button>

          <p className="text-sm font-light text-gray-500 mt-4">
            Don’t have an account yet?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="font-medium text-indigo-600 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
