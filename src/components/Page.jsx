import React, { useEffect, useState } from "react";
import { databases } from "../appwrite";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadBlogFromCache, saveBlogToCache } from "../store/localstorage";

function Page() {
  const location = useLocation();
  const [author, setAuthor] = useState(null);
  const [blogData, setBlogData] = useState(null);
  const { blogPid } = useParams();
  const navigate = useNavigate();
  async function loadFreshBlogData(blogPid) {
    const response = await fetch(
      import.meta.env.VITE_BLOG_URL_WITHOUT_TOKEN + `/${blogPid}`,
    );
    const respData = await response.json();
    const blog = respData.data;
    console.log("from api ", blog);
    console.log("saved in state ", blogData);
    saveBlogToCache(blog);
    setBlogData(blog);
  }
  async function loadBlogData() {
    console.log("loading");
    let blog = loadBlogFromCache(blogPid);
    if (!blog) {
      loadFreshBlogData(blogPid);
    } else {
      console.log("stale data");
      setBlogData(blog);
      loadFreshBlogData(blogPid);
    }
  }
  useEffect(() => {
    console.log("came into page ", blogPid);
    loadBlogData();
  }, [blogPid]);

  if (!blogData) {
    return <div className="text-center mt-10 text-xl">Loading blog...</div>;
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
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-10 border border-gray-200">
          {/* Social Media Links */}
          {/*  */}

          {/* Blog Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-4">
            {blogData.title}
          </h1>

          {/* Author & Date */}
          <div className="text-gray-600 text-lg mt-2">
            {blogData.name} • {blogData.createdAt.split("T")[0]}
          </div>

          {/* Blog Cover Image */}
          {blogData.image && (
            <div className="my-6">
              <img
                src={blogData.image}
                alt="Cover"
                className="w-full rounded-lg object-cover shadow-md"
                loading="lazy"
              />
            </div>
          )}

          {/* Blog Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default Page;
