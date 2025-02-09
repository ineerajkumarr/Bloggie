import React, { useRef, useEffect, useState } from "react";
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

function Profile() {
  // const divRef = useRef(null);
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [body, setBody] = useState("");
  const handleReadMore = (doc) => {
    navigate("/details", { state: doc });
  };

  useEffect(() => {
    setEditorLoaded(true);

    return () => {
      if (editorRef.current) {
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
  }, []);
  const logContent = async () => {
    if (!image) return;

    try {
      const response = await storage.createFile(
        "6686f34a0009af2c7c2f",
        ID.unique(), // Replace with your bucket ID
        image // Permissions, you can set it according to your requirements
      );
      console.log("File uploaded successfully", response);

      const fileId = response.$id;
      // console.log(fileId);
      // setTimeout(async () => {
      //   const previewUrl = await storage
      //     .getFilePreview("6686f34a0009af2c7c2f", fileId)
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
            console.error("Error fetching file URL, retrying...", error);
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        throw new Error("Failed to fetch file URL after retries");
      };

      // Ensure this is inside an async function
      const fetchFileUrl = async () => {
        try {
          const fileUrl = await retryGetFileUrl("6686f34a0009af2c7c2f", fileId);
          console.log("File URL:", fileUrl);
          // setImageUrl(fileUrl);
          let response = await databases.createDocument(
            "66758ff80025a0f37a63",
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
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      };

      // Call the async function
      await fetchFileUrl();

      // console.log("previewURL", imageUrl);

      console.log("imageURL", imageUrl);
    } catch (error) {
      console.error("Failed to upload file", error);
    }

    // if (editorRef.current) {
    //   const content = editorRef.current.getContent();
    // try {
    //   let response = await databases.createDocument(
    //     "66758ff80025a0f37a63",
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
    const result = await databases.updateDocument(
      "66758ff80025a0f37a63", // databaseId
      import.meta.env.VITE_COLLECTION_ID, // collectionId
      updateDoc.$id, // documentId
      {
        title: title,
        body: content,
      }
    );
    console.log(result);
    setTitle("");
    setBody("");
    setrenderer((prev) => !prev);
    // }
  };

  // image upload
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (image) {
      // Perform actions with the updated image state
      console.log("Image state has been updated:", image);
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
    console.log("Image received :", image);
  };

  const handleDestroyEditor = () => {
    if (editorRef.current) {
      editorRef.current.remove();
      editorRef.current = null;
      // editorRef.current.remove; // Call destroy method on the editor instance
    }
  };

  const [loadingstate, setloadingState] = useState(false);
  const [updateDoc, setUpdateDoc] = useState();
  const [flag, setFlag] = useState(false);
  const [content, setContent] = useState("Type Your Text Here");
  const account = new Account(client);
  const [title, setTitle] = useState("");
  const [renderer, setrenderer] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [details, setdetails] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.sessionId);
  const docs = useSelector((state) => state.auth.docs);
  const { userId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const handleSelectCard = (id) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id]
    );
    console.log(selectedCards.length);
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected posts ?")
    ) {
      try {
        for (const cardId of selectedCards) {
          await databases.deleteDocument(
            "66758ff80025a0f37a63",
            import.meta.env.VITE_COLLECTION_ID,
            cardId
          );
          console.log(`Deleted card with ID: ${cardId}`);
        }
        setSelectedCards([]);
        setrenderer((prev) => !prev);
      } catch (error) {
        console.error("Error deleting cards:", error);
      }
    }
  };

  const fetchUserDocuments = async (userId) => {
    try {
      setloadingState(true);
      const response = await databases.listDocuments(
        "66758ff80025a0f37a63",
        import.meta.env.VITE_COLLECTION_ID,
        [Query.equal("author", userId)]
      );
      console.log(userId);
      dispatch(listDocs(response.documents));
      console.log("were in User documents:", response.documents);
      const result = await databases.getDocument(
        "66758ff80025a0f37a63", // databaseId
        "6686e3dc002407d4cf23", // collectionId
        userId // queries (optional)
      );
      console.log(result);
      console.log("sessionId", user);
      setdetails(result);
      setName(result.name);
      setBio(result.bio);

      setloadingState(false);
    } catch (error) {
      console.error("Error fetching documents:", error.message);
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
        "66758ff80025a0f37a63", // databaseId
        import.meta.env.VITE_COLLECTION_ID, // collectionId
        modalId // documentId
      );
      console.log(result);
      setrenderer((prev) => !prev);
    }
  };

  useEffect(() => {
    fetchUserDocuments(userId);
  }, [renderer, userId]);

  if (loadingstate) {
    return (
      <>
        <span className="loader"></span>
      </>
    );
  }
  {
    showModal && (
      <div
        className="fixed left-0 right-0 top-0 bottom-0 bg-black backdrop-blur-sm opacity-25 "
        style={{ zIndex: "13" }}
      ></div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h2 className="font-nunito text-4xl font-bold">{name}</h2>
          <p className="text-gray-900 italic">{bio}</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/update", { state: details });
            }}
            className="mt-6 bg-slate-200 hover:bg-slate-400 text-gray-500 font-semibold hover:text-white py-1 px-4 border border-slate-300 hover:border-transparent rounded"
          >
            Edit Profile
          </button>
        </div>
        <div>
          <button
            className="px-2 py-1 border-black border-2 bg-white rounded text-black hover:text-white hover:bg-black hover:scale-110 transition-all"
            onClick={async (e) => {
              e.preventDefault();
              // dispatch(loading());

              const result = await account.deleteSession(
                user // sessionId
              );

              console.log(result);
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
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
              <div key={doc.$id} className="card group">
                {/* <button
                  onClick={() => handleDelete(doc.$id)}
                  className="absolute top-2 right-2 hidden group-hover:block bg-red-500 text-white rounded-full p-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button> */}
                <input
                  id="default-checkbox"
                  type="checkbox"
                  checked={selectedCards.includes(doc.$id)}
                  onChange={() => handleSelectCard(doc.$id)}
                  className="rounded-full cursor-pointer outline-none absolute top-2 right-2 w-8 h-8 text-blue-400 bg-gray-100 border-gray-300 focus:ring-0 checked:border-blue-400"
                />
                <img
                  src={doc.imageURL}
                  alt="Blog Photo"
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                  }}
                />
                <div className="card-content">
                  <h3 className="card-title">{doc.title}</h3>
                  <p className="card-details">
                    {/* <div dangerouslySetInnerHTML={{ __html: doc.body }} /> */}
                  </p>
                  <div className="card-buttons">
                    <button
                      onClick={() => {
                        console.log(doc.body);
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
                        console.log("our updatedoc", updateDoc);
                        setTitle(doc.title);
                        setContent(doc.body);
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
          className="w-full border-none mb-8 border-b-2 placeholder:text-lg outline-none focus:outline-none focus:border-b-2 focus:border-b-black"
          style={{
            borderBottom: "2px solid black",
            fontWeight: "450",
            fontSize: "1.5rem",
            outline: "none",
            boxShadow: "none",
            WebkitBoxShadow: "none",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          className="z-0 mb-4"
          style={{
            outline: "none",
            WebkitBoxShadow: "none",
            boxShadow: "none",
          }}
        >
          <ErrorBoundary>
            {editorLoaded && (
              <Editor
                ref={editorRef}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                // initialValue={flag ? updateDoc.body : content}
                // onInit={(evt, editor) => (editorRef.current = editor)}
                apiKey="5spe8phiyw6h5n9tn7aavpbol6tv4cc4fgf4lbeq9fil45dq"
                init={{
                  content_css: "./Profile.css",
                  plugins:
                    "anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks  ",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],
                }}
              />
            )}
          </ErrorBoundary>
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
  );
}

export default Profile;


///
import React, { useState } from "react";
import emailjs from "emailjs-com";
import client, { databases } from "../appwrite";
import { Account } from "appwrite";
import { useNavigate } from "react-router-dom";

const account = new Account(client);

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // Tracks the current step: 'email', 'otp', 'reset'
  const [email, setEmail] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [Id, setId] = useState("67666737001cc1b01df4");
  const [otpValidated, setOtpValidated] = useState(false);
  const navigate = useNavigate();
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const func = async (email) => {
    const result = await databases.listDocuments(
      "66758ff80025a0f37a63",
      "6686e3dc002407d4cf23"
    );
    const user = result.documents.find((obj) => obj.email === email) || null;
    setId(user.$id);
    console.log(Id, user.password);

    return user.password;
  };
  // func("ineerajkumarr@gmail.com");

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);

    // EmailJS service configuration
    const serviceID = "service_m77kkev"; // Replace with your EmailJS Service ID
    const templateID = "template_4sesf7r"; // Replace with your EmailJS Template ID
    const userID = "UcpXns0uwmuNPE-3x"; // Replace with your EmailJS User ID/Public Key

    const templateParams = {
      to_email: email,
      otp: generatedOtp, // Pass the generated OTP to the email template
    };

    emailjs.send(serviceID, templateID, templateParams, userID).then(
      (response) => {
        console.log("Email sent successfully!", response.status, response.text);
        alert("OTP sent to your email!");
      },
      (err) => {
        console.error("Failed to send email.", err);
        alert("Failed to send email. Please try again.");
      }
    );

    // Transition to OTP step
    setStep("otp");
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
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const passwd = await func(email);
      console.log("old passswd", passwd);

      const session = await account.createEmailPasswordSession(email, passwd);
      console.log(session);

      await account.updatePassword(newPassword, passwd);
      const result = await databases.updateDocument(
        "66758ff80025a0f37a63", // databaseId
        "6686e3dc002407d4cf23", // collectionId
        Id, // documentId
        {
          password: newPassword,
        }
      );
      console.log(result);

      await account.deleteSession(session.$id); // Deletes the current session

      alert("Password updated successfully!");
      setStep("reset");
      // Simulate password update (integrate Appwrite's password update API here)
      console.log("Password updated successfully:", newPassword);
      alert("Password updated successfully!");
      setEmail("");
      setEnteredOtp("");
      setId("");
      setStep("email");
      navigate("/login");
    } catch (error) {
      console.log(error);
      try {
        await account.deleteSessions();
      } catch (error) {
        console.log(error);
      }
      setStep("reset");
      setNewPassword("");
      alert("Some Error Occured. Try Again");
    }
    // Optionally, redirect to login or reset state
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-blue-400 via-white to-blue-600 flex items-center justify-center">
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
