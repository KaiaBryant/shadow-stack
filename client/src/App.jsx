import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Results from "./pages/Results";
import Simulator from "./pages/Simulator";
import CharacterSelection from "./pages/CharacterSeletion";
import CreateUser from "./pages/CreateUsername";
import GameIntro from "./pages/GameIntro";
import Login from "./pages/Login";
import LevelsMenu from "./components/LevelsMenu";
import Objective from "./pages/GameIntro";
import Admin from "./pages/Admin";
import AdminRegister from "./pages/AdminRegister";

import "./styles/global.css"

function RequireAdminAuth({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      {/* Background blobs */}
      <div className="background-blob blob-1"></div>
      <div className="background-blob blob-2"></div>

      {/* Flex column layout that fills the viewport */}
      <div className="d-flex flex-column min-vh-100">
        <Header />

        {/* This grows to fill the leftover space */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/character-select" element={<CharacterSelection />} />
            {/* <Route path="/admin" element={<Admin />} /> */}
            <Route
              path="/admin"
              element={
                <RequireAdminAuth>
                  <Admin />
                </RequireAdminAuth>
              }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/createuser" element={<CreateUser />} />
            <Route path="/gameintro" element={<GameIntro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/levels" element={<LevelsMenu />} />
            <Route path="/objective" element={<Objective />} />
            <Route path="/register" element={<AdminRegister />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
