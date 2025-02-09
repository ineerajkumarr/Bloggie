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
  const user = useSelector((state) => state.auth.userId);
  const docs = useSelector((state) => state.auth.docs);
  const titleRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(true);
  const [body, setBody] = useState("");
  const editor = useRef(null);
  const handleReadMore = (doc) => {
    navigate("/details", { state: doc });
  };
  const handleScrollToTitle = () => {
    titleRef.current.scrollIntoView({ behavior: "smooth" }); // Scrolls the input into view
    titleRef.current.focus(); // Sets the cursor focus on the input
  };

  useEffect(() => {
    if (!user) {
      // console.log("USER : ", user);

      // console.log("returned back !!");

      navigate("/login", { replace: true }); // Prevents back navigation
    }
  }, [user, navigate]);
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
    []
  );

  const logContent = async () => {
    if (!image) {
      try {
        let response = await databases.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          ID.unique(),
          { title: title, body: content, author: userId }
        );
        // console.log(response);
        setTitle("");
        setImage(null);
        setContent("Type Your Text Here");
      } catch (error) {
        // console.error(error);
      }
    } else {
      try {
        const response = await storage.createFile(
          import.meta.env.VITE_STORAGE_ID,
          ID.unique(), // Replace with your bucket ID
          image // Permissions, you can set it according to your requirements
        );
        // console.log("File uploaded successfully", response);

        const fileId = response.$id;
        // console.log(fileId);
        // setTimeout(async () => {
        //   const previewUrl = await storage
        //     .getFilePreview("import.meta.env.VITE_STORAGE_ID", fileId)
        //     .toString();

        // }, 3000);
        const retryGetFileUrl = async (
          bucketId,
          fileId,
          retries = 5,
          delay = 1000
        ) => {
          for (let i = 0; i < retries; i++) {
            try {
              const fileUrl = await storage.getFileView(bucketId, fileId); // Await here
              if (fileUrl.href) {
                return fileUrl.href;
              }
            } catch (error) {
              // console.error("Error fetching file URL, retrying...", error);
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          throw new Error("Failed to fetch file URL after retries");
        };

        // Ensure this is inside an async function
        const fetchFileUrl = async () => {
          try {
            const fileUrl = await retryGetFileUrl(
              import.meta.env.VITE_STORAGE_ID,
              fileId
            );
            // console.log("File URL:", fileUrl);
            // setImageUrl(fileUrl);
            let response = await databases.createDocument(
              import.meta.env.VITE_DATABASE_ID,
              import.meta.env.VITE_COLLECTION_ID,
              ID.unique(),
              { title: title, body: content, author: userId, imageURL: fileUrl }
              // [
              //   Permission.read(Role.any()), // Anyone can view this document
              //   Permission.update(Role.team("writers")), // Writers can update this document
              //   Permission.update(Role.user(userId)), // Admins can update this document
              //   Permission.delete(Role.user(userId)), // User 5c1f88b42259e can delete this document
              //   Permission.delete(Role.team("admin")), // Admins can delete this document
              // ]
            );
            // console.log(response);
            setTitle("");
            setImage(null);
            setContent("Type Your Text Here");
          } catch (error) {
            // console.error(error);
          }
        };

        // Call the async function
        await fetchFileUrl();

        // console.log("previewURL", imageUrl);

        // console.log("imageURL", imageUrl);
      } catch (error) {
        // console.error("Failed to upload file", error);
      }
    }

    // if (editorRef.current) {
    //   const content = editorRef.current.getContent();
    // try {
    //   let response = await databases.createDocument(
    //     import.meta.env.VITE_DATABASE_ID,
    //     import.meta.env.VITE_COLLECTION_ID,
    //     ID.unique(),
    //     { title: title, body: content, author: userId, imageURL: imageUrl }
    //     // [
    //     //   Permission.read(Role.any()), // Anyone can view this document
    //     //   Permission.update(Role.team("writers")), // Writers can update this document
    //     //   Permission.update(Role.user(userId)), // Admins can update this document
    //     //   Permission.delete(Role.user(userId)), // User 5c1f88b42259e can delete this document
    //     //   Permission.delete(Role.team("admin")), // Admins can delete this document
    //     // ]
    //   );
    //   console.log(response);
    //   // setrenderer((prev) => !prev);
    //   // window.location.reload();
    // } catch (error) {
    //   return error;
    // }
    // setImageUrl("");
    // }
    setrenderer((prev) => !prev);
  };
  const log2content = async () => {
    // if (editorRef.current) {
    //   const content = editorRef.current.getContent();
    setloadingState(true);
    const result = await databases.updateDocument(
      import.meta.env.VITE_DATABASE_ID, // databaseId
      import.meta.env.VITE_COLLECTION_ID, // collectionId
      updateDoc.$id, // documentId
      {
        title: title,
        body: content,
      }
    );
    // console.log(result);
    setTitle("");
    setContent("Type Your Text Here");
    setFlag(false);
    setImage(null);
    setloadingState(false);
    setrenderer((prev) => !prev);
    // }
  };

  // image upload
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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

  const handleImageChange = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
    // console.log("Image received :", image);
  };

  const handleDestroyEditor = () => {
    if (editorRef.current) {
      editorRef.current.remove();
      editorRef.current = null;
      // editorRef.current.remove; // Call destroy method on the editor instance
    }
  };

  const [loadingState, setloadingState] = useState(false);
  const [updateDoc, setUpdateDoc] = useState();
  const [flag, setFlag] = useState(false);
  const [content, setContent] = useState("Type Your Text Here");
  const account = new Account(client);
  const [title, setTitle] = useState("");
  const [renderer, setrenderer] = useState(false);
  const [name, setName] = useState("");
  const [details, setdetails] = useState();
  const { userId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleSelectCard = (id) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id]
    );
    // console.log(selectedCards.length);
  };

  const handleDeleteSelected = async () => {
    setloadingState(true);
    if (
      window.confirm("Are you sure you want to delete the selected posts ?")
    ) {
      try {
        for (const cardId of selectedCards) {
          await databases.deleteDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID,
            cardId
          );
          // console.log(`Deleted card with ID: ${cardId}`);
        }
        setSelectedCards([]);
        setrenderer((prev) => !prev);
      } catch (error) {
        // console.error("Error deleting cards:", error);
      }
    }
    setloadingState(false);
  };

  const fetchUserDocuments = async (userId) => {
    try {
      setloadingState(true);
      const response = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID,
        [Query.equal("author", userId)]
      );
      // console.log(userId);
      dispatch(listDocs(response.documents));
      // console.log("were in User documents:", response.documents);
      const result = await databases.getDocument(
        import.meta.env.VITE_DATABASE_ID, // databaseId
        import.meta.env.VITE_USERS_COLLECTIONS, // collectionId
        userId // queries (optional)
      );
      // console.log(result);
      // console.log("sessionId", user);
      setdetails(result);
      setName(result.name);

      setloadingState(false);
    } catch (error) {
      // console.error("Error fetching documents:", error.message);
    }
  };
  // fetchUserDocuments(userId);
  // useEffect(() => {
  //   return () => {
  //     // Cleanup TinyMCE editor instance on unmount
  //     if (editorRef.current) {
  //       editorRef.current.destroy();
  //       editorRef.current = null;
  //     }
  //   };
  // }, []);
  const handleDelete = async (modalId) => {
    if (window.confirm("are You sure you want to delete the document ?")) {
      const result = await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID, // databaseId
        import.meta.env.VITE_COLLECTION_ID, // collectionId
        modalId // documentId
      );
      // console.log(result);
      setrenderer((prev) => !prev);
    }
  };

  useEffect(() => {
    // console.log("bucket id", import.meta.env.VITE_STORAGE_ID);

    fetchUserDocuments(userId);
  }, [renderer, userId]);

  {
    showModal && (
      <div
        className="fixed left-0 right-0 top-0 bottom-0 bg-black backdrop-blur-sm opacity-25 "
        style={{ zIndex: "13" }}
      ></div>
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
            <h2 className="font-nunito text-4xl font-bold">{name}</h2>
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
                <div key={doc.$id} className="card group ">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={selectedCards.includes(doc.$id)}
                    onChange={() => handleSelectCard(doc.$id)}
                    className="rounded-full cursor-pointer outline-none absolute top-2 right-2 w-8 h-8 text-blue-400 bg-gray-100 border-gray-300 focus:ring-0 checked:border-blue-400"
                  />
                  {doc.imageURL ? (
                    <img
                      src={doc.imageURL}
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
                          // console.log(doc.body);
                          handleReadMore(doc);
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
                          // console.log("our updatedoc", updateDoc);
                          setTitle(doc.title);
                          setContent(doc.body);
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
              <button
                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                onClick={async (e) => {
                  e.preventDefault();
                  await log2content();
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
                  // await handleImageUpload(e);
                  await logContent();
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
