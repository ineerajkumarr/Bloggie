import { useEffect, useState } from "react";
import { Client, Databases, ID } from "appwrite";
import client from "./appwrite";
import { databases } from "./appwrite";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Page from "./components/Page";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Updateuser from "./components/Updateuser";
import ForgotPassword from "./components/ForgotPassword";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  // c

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update" element={<Updateuser />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/details" element={<Page />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

{
  /* {updateToken &&
        arr.map((doc) => {
          if (doc.$id === updateItem) {
            return (
              <div>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdatetitle(e.target.value)}
                />
                <input
                  type="text"
                  value={updateBody}
                  onChange={(e) => setUpdateBody(e.target.value)}
                />
                <button onClick={(e) => handleUpdate(e)}>Update</button>
              </div>
            );
          }
        })} */
}
