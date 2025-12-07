import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Results from "./pages/Results";
import Simulator from "./pages/Simulator";
import CharacterSelection from "./pages/CharacterSeletion";
import CreateUser from "./pages/CreateUsername";
import GameIntro from "./pages/GameIntro";
import Login from "./pages/Login";
import LevelsMenu from "./components/LevelsMenu";
import AdminRegister from "./pages/AdminRegister";
import "./styles/global.css";

function App() {
  const [holidayMode, setHolidayMode] = useState(false);   // ⬅️ single source of truth

  return (
    <Router>
      <Header />

      <main>
        <Routes>
          {/* Pass holidayMode into Home so it shows snow */}
          <Route path="/" element={<Home holidayMode={holidayMode} />} />
          <Route path="/character-select" element={<CharacterSelection />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/objective" element={<GameIntro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/levels" element={<LevelsMenu />} />
          <Route path="/register" element={<AdminRegister />} />
        </Routes>
      </main>

      {/* ✅ Single global footer – button only shows on Home based on location */}
      <Footer
        holidayMode={holidayMode}
        onToggleHoliday={() => setHolidayMode((prev) => !prev)}
      />
    </Router>
  );
}

export default App;
