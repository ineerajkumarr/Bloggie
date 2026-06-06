export const saveBlogToCache = (blog) => {
  try {
    const existing = JSON.parse(localStorage.getItem("blogCache")) || {};

    existing[blog.blogPid] = blog;

    localStorage.setItem("blogCache", JSON.stringify(existing));
    console.log("saved!");
  } catch (e) {
    console.error("Could not save blog", e);
  }
};

export const loadBlogFromCache = (blogPid) => {
  try {
    console.log("call for cache....");
    const cache = JSON.parse(localStorage.getItem("blogCache")) || {};
    console.log("saved in localStorage", cache[blogPid]);
    return cache[blogPid] || null;
  } catch (e) {
    console.error("Could not load blog", e);
    return null;
  }
};
