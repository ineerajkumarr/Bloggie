import React, { useEffect, useState } from "react";
import { databases } from "../appwrite";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Page() {
  const location = useLocation();
  const [author, setAuthor] = useState(null);
  const item = location.state || {};
  const navigate = useNavigate();
  const prev = useSelector((state) => state.auth.userId);
  useEffect(() => {
    console.log("-------------*---------", prev);
    async function fetchAuthor() {
      try {
        const result = await databases.getDocument(
          import.meta.env.VITE_DATABASE_ID, // databaseId
          import.meta.env.VITE_USERS_COLLECTIONS, // collectionId
          item.author
        );
        setAuthor(result.name);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    }
    fetchAuthor();
  }, [item.author]);

  return (
    <>
      <div className="text-center p-4 ">
        <h1
          onClick={() => navigate(`/`)}
          className="cursor-pointer text-5xl font-bold font-pacifico text-red-500 
  [text-shadow:8px_8px_8px_rgba(255,100,100,0.7)]"
        >
          Bloggie
        </h1>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-10 border border-gray-200">
          {/* Social Media Links */}
          {/*  */}

          {/* Blog Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-4">
            {item.title}
          </h1>

          {/* Author & Date */}
          <div className="text-gray-600 text-lg mt-2">
            {author ? `~ ${author}` : "Loading author..."} • {item.date}
          </div>

          {/* Blog Cover Image */}
          {item.imageURL && (
            <div className="my-6">
              <img
                src={item.imageURL}
                alt="Cover"
                className="w-full rounded-lg object-cover shadow-md"
                loading="lazy"
              />
            </div>
          )}

          {/* Blog Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: item.body }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default Page;
