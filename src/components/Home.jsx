import { Client, Databases, ID } from "appwrite";
import React, { useEffect, useState } from "react";
import client from "../appwrite";
import { useNavigate } from "react-router-dom";
import he from "he";
import { useSelector } from "react-redux";

function Home() {
  const [docs, setDocs] = useState(() => {
    const savedDocs = sessionStorage.getItem("docs");
    return savedDocs ? JSON.parse(savedDocs) : null;
  });
  const navigate = useNavigate();
  const prev = useSelector((state) => state.auth.userId);
  const databases = new Databases(client);

  async function getDocs() {
    const result = await databases.listDocuments(
      import.meta.env.VITE_DATABASE_ID, // databaseId
      import.meta.env.VITE_COLLECTION_ID // collectionId
    );
    // console.log("databse id : ", import.meta.env.VITE_DATABASE_ID);
    // console.log("collections id :", import.meta.env.VITE_COLLCTION_ID);

    setDocs(result.documents);
    sessionStorage.setItem("docs", JSON.stringify(result.documents));
    // console.log(result);
  }

  useEffect(() => {
    // console.log("-------------*---------", prev);

    if (!docs) {
      getDocs();
    }
  }, [prev]);

  const handleReadMore = (doc) => {
    navigate("/details", { state: doc });
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 w-screen min-h-screen overflow-hidden">
      <nav className="bg-transparent">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex justify-center w-full">
            <h1
              className="text-5xl font-bold font-pacifico text-white 
  [text-shadow:8px_8px_8px_rgba(0,0,0,0.7)]"
            >
              Bloggie
            </h1>
          </div>

          <div className="absolute right-4">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
      <div className="grid mt-8 mx-10 md:mx-20 py-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs &&
          docs.map((doc) => (
            <div
              key={doc.$id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105"
            >
              {doc.imageURL ? (
                <img
                  src={doc.imageURL}
                  alt={doc.title}
                  className="rounded-t-md w-full h-48 object-cover mb-4"
                />
              ) : null}

              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {doc.title}
              </h3>

              {!doc.imageURL && doc.body && (
                <p className="text-sm text-gray-600 mb-4">
                  {he.decode(doc.body.replace(/<[^>]+>/g, "").slice(0, 60))}...
                </p>
              )}

              <button
                onClick={() => handleReadMore(doc)}
                className="self-start mt-auto px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Read More
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
