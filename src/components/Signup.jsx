import React, { useState } from "react";
import client from "../appwrite";
import { databases } from "../appwrite";
import { Account, ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function Signup() {
  const account = new Account(client);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [id, setId] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState("");

  const createUserAndDocument = async () => {
    setError("");
    setLoadingState(true);
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID, // Replace with your Appwrite database ID
        import.meta.env.VITE_USERS_COLLECTIONS, // Replace with your Users Collection ID
        [Query.equal("email", email)] // Find user by email
      );
      // console.log("RESPONSE", response);

      if (response.documents.length > 0) {
        setError("Already Registered Email Id. Try another.");
        setLoadingState(false);
        return;
      }
      // const userResponse = await account.create(ID.unique(), email, passwd);
      // console.log("User created:", userResponse);

      // Extract user ID from response
      const userId = ID.unique();
      // console.log("User ID:", userId);

      // Create a document with user information
      const documentResponse = await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID, // Replace with your database ID
        import.meta.env.VITE_USERS_COLLECTIONS, // Replace with your collection ID
        userId, // Unique document ID. Use 'unique()' for automatic generation
        {
          userId: userId,
          name: name,
          email: email,
          password: passwd,
        }
      );
      // console.log("Document created:", documentResponse);
    } catch (error) {
      // console.error("Error:", error);
    }
    setLoadingState(false);
    setEmail("");
    setPasswd("");
    setName("");
    navigate("/login");
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-400 via-white to-blue-600 flex items-center justify-center">
      {loadingState && <Spinner />}
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl transform transition-all ">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Sign up
        </h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form className="space-y-2">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              id="name"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
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
              type="text"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
              name="password"
              id="password"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
              placeholder="Password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-lg font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="text"
              name="confirm_password"
              id="confirm_password"
              className="mt-2 w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none "
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              createUserAndDocument();
            }}
            className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500"
          >
            Create Account
          </button>

          <p className="text-sm font-light text-gray-500 mt-4 text-center">
            By signing up, you agree to the{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>

        <div className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
