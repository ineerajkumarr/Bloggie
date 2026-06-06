import React, { useRef, useEffect, useState, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useLocation } from "react-router-dom";
import client from "../appwrite";
import { databases, storage } from "../appwrite";
import { Account, Permission, ID, Role, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { logout, listDocs } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../store/authSlice";
import { loading, loaded } from "../store/loading";
import "./Profile.css";
import ErrorBoundary from "./ErrorBoundary";
import Modal from "./Modal";
import Spinner from "./Spinner";
import JoditEditor from "jodit-react";

function Profile() {
  // const divRef = useRef(null);
  // const editorRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  // console.log("userId", user);
  const docs = useSelector((state) => state.auth.docs);
  const titleRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(true);
  const [body, setBody] = useState("");
  const editor = useRef(null);
  const handleReadMore = (doc) => {
    console.log("id of blog", doc);
    navigate(`/details/${doc}`);
  };
  const handleScrollToTitle = () => {
    titleRef.current.scrollIntoView({ behavior: "smooth" }); // Scrolls the input into view
    titleRef.current.focus(); // Sets the cursor focus on the input
  };
  //************************** */
  useEffect(() => {
    if (!user) {
      // console.log("USER : ", user);

      console.log("returned back !!");

      navigate("/login", { replace: true }); // Prevents back navigation
    }
  }, [user, navigate]);

  async function getRefreshedBlogs() {
    const docsResponse = await fetch(import.meta.env.VITE_BLOG_URL_WITH_TOKEN, {
      method: "GET",
      headers: {
        Authorization: user.token,
      },
    });
    const docsData = await docsResponse.json();
    const docs = docsData.data;
    console.log(docs);
    dispatch(listDocs(docs));
  }
  //************************** */
  // useEffect(() => {
  //   setEditorLoaded(true);

  //   return () => {
  //     if (editorRef.current) {
  //       editorRef.current.remove();
  //       editorRef.current = null;
  //     }
  //   };
  // }, []);

  const joditConfig = useMemo(
    () => ({
      placeholder: "Type Your Text Here",
      autofocus: true,
      saveMode: "preserve",
      buttons: [
        "bold",
        "italic",
        "underline",
        "brush",
        "strikethrough",
        "link",
        "table",
        "undo",
        "redo",
        "align",
        "font",
        "fontsize",
        "hr",
        "superscript",
        "subscript",
        "ol",
        "ul",
        "indent",
        "outdent",
        "source",
      ],
    }),
    [],
  );

  async function uploadImageToCloudinary(file) {
    console.log("inside 3rd party api");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    console.log("cloudinary resp", data);
    return data.secure_url;
  }

  const logContent3 = async () => {
    let responseURL = null;
    if (image) {
      console.log("going for cloudinary api");
      responseURL = await uploadImageToCloudinary(image);
      console.log("response url,", responseURL);
      setImageUrl(responseURL);
    }
    try {
      const response = await fetch(
        import.meta.env.VITE_BLOG_URL_WITH_TOKEN + "/create",
        {
          method: "POST",
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
            image: responseURL,
          }),
        },
      );
      const respData = await response.json();
      console.log("response", respData);
      if (respData.success === true) {
        getRefreshedBlogs();
      } else {
        window.alert("Failed to create ", respData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setImage(null);
      setContent("Enter your text here");
      setTitle("");
    }
  };

  const logContent2 = async () => {
    let finalUrl = null;
    if (image) {
      console.log("going for cloudinary api");
      finalUrl = await uploadImageToCloudinary(image);
      console.log("response url,", finalUrl);
      // setImageUrl(finalUrl);
    }
    try {
      console.log("new img URL", finalUrl);
      const response = await fetch(
        import.meta.env.VITE_BLOG_URL_WITH_TOKEN + "/update",
        {
          method: "PUT",
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogPid: updateDoc.blogPid,
            title: title,
            content: content,
            image: finalUrl,
          }),
        },
      );
      const respData = await response.json();
      console.log("response", respData);
      if (respData.success === true) {
        getRefreshedBlogs();
      } else {
        window.alert("Failed to create ", respData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setImage(null);
      setImageUrl(null);
      setContent("Enter your text here");
      setTitle("");
      setFlag(false);
    }
  };

  // image upload
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (image) {
      // Perform actions with the updated image state
      // console.log("Image state has been updated:", image);
    }
  }, [image]);

  // useEffect(() => {
  //   return () => {
  //     if (editorRef.current) {
  //       editorRef.current.remove();
  //       editorRef.current = null;
  //     }
  //   };
  // }, []);

  const [loadingState, setloadingState] = useState(false);
  const [updateDoc, setUpdateDoc] = useState();
  const [flag, setFlag] = useState(false);
  const [content, setContent] = useState("Type Your Text Here");
  const account = new Account(client);
  const [title, setTitle] = useState("");
  const [renderer, setrenderer] = useState(false);
  const [name, setName] = useState("");
  const [details, setdetails] = useState();
  // const { userId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleSelectCard = (id) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id],
    );
    // console.log(selectedCards.length);
  };

  const handleDeleteSelected = async () => {
    setloadingState(true);
    if (
      window.confirm("Are you sure you want to delete the selected posts ?")
    ) {
      try {
        const response = await fetch(
          import.meta.env.VITE_BLOG_URL_WITH_TOKEN + "/delete",
          {
            method: "DELETE",
            headers: {
              Authorization: user.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blogPids: selectedCards,
            }),
          },
        );
        const respData = await response.json();
        console.log("response", respData);
        if (respData.success === true) {
          window.alert("Selected blogs deleted successfully");
          getRefreshedBlogs();
        } else {
          window.alert("Failed to delete ", respData.message);
        }
      } catch (error) {
        console.error("Error deleting cards:", error);
      } finally {
        setSelectedCards([]);
      }
    }
    setloadingState(false);
  };

  // useEffect(() => {
  //   // console.log("bucket id", import.meta.env.VITE_STORAGE_ID);

  //   fetchUserDocuments(userId);
  // }, [renderer, userId]);

  {
    showModal && (
      <div
        className="fixed left-0 right-0 top-0 bottom-0 bg-black backdrop-blur-sm opacity-25 "
        style={{ zIndex: "13" }}
      ></div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Active Session
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            No active user session was found. Redirecting you to the login
            page...
          </p>
        </div>
      </div>
    );
  }

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
      <div className="profile-container">
        {loadingState && <Spinner />}

        <div className="profile-header">
          <div className="profile-info">
            <h2 className="font-nunito text-4xl font-bold">{user.name}</h2>
          </div>
          <div>
            <button
              className="px-2 py-1 border-black border-2 bg-white rounded text-black hover:text-white hover:bg-black hover:scale-110 transition-all"
              onClick={async (e) => {
                e.preventDefault();
                // dispatch(loading());
                dispatch(logout());
                navigate("/login");
              }}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleScrollToTitle}
            className="bg-blue-500 text-white px-6 py-2 flex items-center gap-2 rounded hover:bg-blue-600 shadow-md"
          >
            Create Blog
          </button>
        </div>

        {docs.length != 0 && (
          <div className="w-full flex justify-center mt-4 mb-4 p-2">
            <button
              disabled={selectedCards.length === 0}
              className={`p-2 text-red-600 bg-white rounded border border-red-600 ${
                selectedCards.length === 0
                  ? "cursor-not-allowed "
                  : " hover:bg-red-600 hover:text-white"
              }`}
              onClick={handleDeleteSelected}
            >
              Delete
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-4">
          {docs &&
            docs.map((doc) => {
              return (
                <div key={doc.blogPid} className="card group ">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={selectedCards.includes(doc.blogPid)}
                    onChange={() => handleSelectCard(doc.blogPid)}
                    className="rounded-full cursor-pointer outline-none absolute top-2 right-2 w-8 h-8 text-blue-400 bg-gray-100 border-gray-300 focus:ring-0 checked:border-blue-400"
                  />
                  {doc.image ? (
                    <img
                      src={doc.image}
                      alt="Blog Photo"
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                  <div className="card-content">
                    <h3 className="card-title">{doc.title}</h3>

                    <div className="card-buttons">
                      <button
                        onClick={() => {
                          // console.log(doc.content);
                          handleReadMore(doc.blogPid);
                        }}
                        className="read-more-btn inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Read More
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          setFlag(true);
                          await setUpdateDoc(doc);
                          console.log("image prop.", image);
                          setTitle(doc.title);
                          setContent(doc.content);
                          handleScrollToTitle();
                          // editorRef.current.scrollIntoView({
                          //   behavior: "smooth",
                          // });
                        }}
                        className="update-btn"
                      >
                        Update Card
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-8">
          <div className="w-full flex font-ubuntu mb-6 p-2 text-3xl font-bold uppercase">
            {flag ? <h1>Update existing blog</h1> : <h2>Create a new blog</h2>}
          </div>

          <input
            className="w-full mb-8 placeholder:text-lg outline-none"
            ref={titleRef}
            style={{
              border: "1px solid #ccc", // Thin, light border on all four sides
              borderRadius: "8px", // Rounded corners
              fontWeight: "450", // Font weight
              fontSize: "1.5rem", // Font size
              outline: "none", // Remove focus ring
              boxShadow: isFocused
                ? "inset 0 1px 5px rgba(0, 0, 0, 0.1)"
                : "none", // Remove any outer shadow by default
              WebkitBoxShadow: "none", // Remove shadow for WebKit browsers
              padding: "0.5rem", // Padding inside the input field
              background: "transparent", // Transparent background
              transition: "all 0.3s ease", // Smooth transition for focus state
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // When focused, add an inner shadow to the box
          />

          <div
            className="z-0 mb-4"
            style={{
              outline: "none",
              WebkitBoxShadow: "none",
              boxShadow: "none",
            }}
          >
            <div className="mb-4">
              <JoditEditor
                ref={editor}
                value={content}
                // onChange={setContent}
                onBlur={(newContent) => setContent(newContent)}
                config={joditConfig} // Uses memoized config
              />
            </div>
          </div>
          {flag ? (
            <div className="w-full flex items-center gap-6 justify-center">
              <label>📷 Choose an image : </label>
              <input
                // value={image}
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
              />
              <button
                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                onClick={async (e) => {
                  e.preventDefault();
                  await logContent2();
                }}
              >
                Update
              </button>
              <button
                className="bg-transparent hover:bg-gray-500 text-gray-950 font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent rounded"
                onClick={() => {
                  setTitle("");
                  setContent("Enter Your Text Here ....");
                  setFlag(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center gap-6">
              <label>📷 Choose an image : </label>
              <input
                // value={image}
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="file_input"
                type="file"
              />
              <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={async (e) => {
                  e.preventDefault();
                  setloadingState(true);
                  // await handleImageUpload(e);
                  await logContent3();
                  setloadingState(false);
                  // editorRef.current.destroy();
                }}
              >
                Add Document
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
