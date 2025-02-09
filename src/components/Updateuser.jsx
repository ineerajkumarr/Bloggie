import React, { useState } from "react";
import { databases, storage } from "../appwrite";
import { ID } from "appwrite";
import { useNavigate, useLocation } from "react-router-dom";

function Updateuser() {
  const location = useLocation();
  const item = location.state || {};
  const [Name, setName] = useState(item.name);
  const [Email, setemail] = useState(item.email);
  const [Password, setPassword] = useState(item.password);
  const [Bio, setBio] = useState(item.bio);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    console.log(image);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      const response = await storage.createFile(
        "6686f34a0009af2c7c2f",
        ID.unique(), // Replace with your bucket ID
        image // Permissions, you can set it according to your requirements
      );
      console.log("File uploaded successfully", response);

      const fileId = response.$id;
      const previewUrl = storage
        .getFilePreview("6686f34a0009af2c7c2f", fileId)
        .toString();

      setImageUrl(previewUrl);
    } catch (error) {
      console.error("Failed to upload file", error);
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center justify-center p-8 bg-gray-100">
        <div className="flex-1 relative rounded-full w-32 h-32 overflow-hidden">
          <img
            src={imageUrl}
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-none flex flex-col">
          {/* <button
          onClick={}
           className="px-3 py-1 bg-blue-500 text-white rounded-lg focus:outline-none">
            Change Picture
          </button> */}
          <input
            accept="image/*"
            onChange={(e) => {
              handleImageChange(e);
            }}
            className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
          ></input>
          <button
            onClick={handleImageUpload}
            className="px-3 py-1 bg-red-500 text-white rounded-lg focus:outline-none"
          >
            Save Picture
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={Name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Your Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={Email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="text"
            value={Password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={Bio}
            onChange={(e) => {
              setBio(e.target.value);
            }}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Tell us about yourself"
          ></textarea>
        </div>

        <div className="mt-6">
          <button
            onClick={async (e) => {
              e.preventDefault();
              const result = await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID, // databaseId
                "6686e3dc002407d4cf23", // collectionId
                item.userId, // documentId
                {
                  name: Name,
                  email: Email,
                  password: Password,
                  bio: Bio,
                } // data (optional)
                // permissions (optional)
              );
              console.log(result);
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Updateuser;
