import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home/Home";
import SignUp from "./Components/Pages/SignUp/SignUp";
import SignIn from "./Components/Pages/SignIn/SignIn";
import Profile from "./Components/Pages/Profile/Profile";
import Explore from "./Components/Pages/Explore/Explore";
import Requests from "./Components/Pages/Requests/Requests";
import Messages from "./Components/Pages/Messages/Messages";
import AuthRoute from "./Components/Authentication/AuthRoute";
import AddPost from "./Components/ReUsableComponents/Post/AddPost/AddPost";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<AuthRoute element={<Home />} />} />
          <Route
            exact
            path="/:profile"
            element={<AuthRoute element={<Profile />} />}
          />
          <Route
            exact
            path="/:profile/:view_type"
            element={<AuthRoute element={<Profile />} />}
          />
          <Route
            path="/post/:username/:id"
            exact
            element={<AuthRoute element={<AddPost />} />}
          />
          <Route
            path="/post"
            exact
            element={<AuthRoute element={<AddPost />} />}
          />
          <Route exact path="/sign_in" element={<SignIn />} />
          <Route exact path="/sign_up" element={<SignUp />} />
          {/* <Route
              exact
              path="/trending"
              element={<AuthRoute element={<Trending />} />}
            /> */}
          <Route
            exact
            path="/explore"
            element={<AuthRoute element={<Explore />} />}
          />
          <Route
            exact
            path="/status/:id"
            element={<AuthRoute element={<Explore />} />}
          />
          <Route
            exact
            path="/requests"
            element={<AuthRoute element={<Requests />} />}
          />
          <Route
            exact
            path="/messages"
            element={<AuthRoute element={<Messages />} />}
          />
          <Route
            exact
            path="/messages/:slug"
            element={<AuthRoute element={<Messages />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
