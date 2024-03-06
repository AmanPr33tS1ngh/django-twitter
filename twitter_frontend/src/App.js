import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Pages/Home/Home";
import SignUp from "./Components/Pages/SignUp/SignUp";
import SignIn from "./Components/Pages/SignIn/SignIn";
import Sidebar from "./Components/Sidebar/Sidebar";
import Trending from "./Components/Pages/Trending/Trending";
import Profile from "./Components/Pages/Profile/Profile";
import Explore from "./Components/Pages/Explore/Explore";
import Bookmarks from "./Components/Pages/Bookmark/Bookmarks";
import Notifications from "./Components/Pages/Notifications/Notifications";
import Messages from "./Components/Pages/Messages/Messages";

function App() {
  return (
    <div className="d-grid px-12 py-4 h-screen">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            path="/compose/post/"
            exact
            element={<Home composePost={true} />}
          />
          <Route exact path="/sign-in" element={<SignIn />} />
          <Route exact path="/sign-up" element={<SignUp />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/trending" element={<Trending />} />
          <Route exact path="/explore" element={<Explore />} />
          <Route exact path="/bookmarks" element={<Bookmarks />} />
          <Route exact path="/notification" element={<Notifications />} />
          <Route exact path="/messages" element={<Messages />} />
        </Routes>
        <Trending />
      </BrowserRouter>
    </div>
  );
}

export default App;
