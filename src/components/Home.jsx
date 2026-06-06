import { Client, Databases, ID } from "appwrite";
import React, { useEffect, useState } from "react";
import client from "../appwrite";
import { useNavigate } from "react-router-dom";
import { listGlobalDocs } from "../store/authSlice";
import he from "he";
import { useSelector, useDispatch } from "react-redux";

function Home() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prev = useSelector((state) => state.auth.user);

  const docsFromStore = useSelector((state) => state.auth.globalDocs);

  async function fetchDocs() {
    const response = await fetch(
      import.meta.env.VITE_BLOG_URL_WITHOUT_TOKEN + "/all",
    );
    const respData = await response.json();
    const docs = respData.data;
    dispatch(listGlobalDocs(docs));
    return docs;
  }

  async function getDocs() {
    if (docsFromStore && docsFromStore.length > 0) {
      console.log("from store setting global docs");
      setDocs(docsFromStore);
    }

    const docs = await fetchDocs();
    console.log("setting globalDocs from api");
    setDocs(docs);
  }

  useEffect(() => {
    // console.log("-------------*---------", prev);

    // if (!docs) {
    getDocs();
    // }
  }, [prev]);

  const handleReadMore = (doc) => {
    navigate(`/details/${doc.blogPid}`);
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
            {prev ? (
              <div className="flex justify-center items-center h-12 mb-4 hover:scale-110 transition-transform cursor-pointer">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/profile/${prev.pid}`);
                  }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100"
                >
                  <span className="text-2xl">👤</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-14 mb-4">
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
            )}
          </div>
        </div>
      </nav>
      <div className="grid mt-8 mx-10 md:mx-20 py-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs &&
          docs.map((doc) => (
            <div
              key={doc.blogPid}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105"
            >
              {doc.image ? (
                <img
                  src={doc.image}
                  alt={doc.title}
                  className="rounded-t-md w-full h-48 object-cover mb-4"
                />
              ) : null}

              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {doc.title}
              </h3>

              {!doc.image && doc.content && (
                <p className="text-sm text-gray-600 mb-4">
                  {he.decode(doc.content.replace(/<[^>]+>/g, "").slice(0, 60))}
                  ...
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
