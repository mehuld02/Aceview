import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Games from "./pages/Games";
import SkillSwap from "./pages/SkillSwap";
import MockInterview from "./pages/MockInterview";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import "./index.css";
import ProtectedRoute from './components/ProtectedRoute';
import CodeQuiz from './games/CodeQuiz/CodeQuiz';
import MemoryMatch from './games/MemoryMatch/MemoryMatch';
import BugHunt from './games/BugHunt/BugHunt';
import MatchesPage from "./components/MatchesPage"; 
import ConnectionPage from "./components/ConnectionPage";
import SkillSwapClassroom from "./components/SkillSwapClassroom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/games" element={<Games />} />
        <Route path="/skillswap" element={<SkillSwap />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/connect/:username" element={<ConnectionPage />} />
        <Route path="/classroom" element={<SkillSwapClassroom />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/games" element={<Games />} />
        <Route path="/games/code-quiz" element={<CodeQuiz />} />
        <Route path="/games/memory-match" element={<MemoryMatch />} />
        <Route path="/games/bug-hunt" element={<BugHunt />} />
      </Routes>
    </Router>
  );
}

export default App;
