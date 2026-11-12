import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from './components/ProtectedRoute';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import Practice from "./pages/Practice";
import Games from "./pages/Games";
import SkillSwap from "./pages/SkillSwap";
import MockInterview from "./pages/MockInterview";
import CodeQuiz from './games/CodeQuiz/CodeQuiz';
import MemoryMatch from './games/MemoryMatch/MemoryMatch';
import BugHunt from './games/BugHunt/BugHunt';
import "./index.css";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        {" "}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-profile"
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <Games />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skillswap"
            element={
              <ProtectedRoute>
                <SkillSwap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mock-interview"
            element={
              <ProtectedRoute>
                <MockInterview />
              </ProtectedRoute>
            }
          />
         
          <Route
            path="/games/code-quiz"
            element={
              <ProtectedRoute>
                <CodeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/memory-match"
            element={
              <ProtectedRoute>
                <MemoryMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/bug-hunt"
            element={
              <ProtectedRoute>
                <BugHunt />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;