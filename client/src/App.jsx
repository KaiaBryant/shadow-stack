import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import "./styles/global.css"

function App() {
  return (
    <Router>
      {/* Flex column layout that fills the viewport */}
      <div className="d-flex flex-column min-vh-100">
        <Header />

        {/* This grows to fill the leftover space */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/character-select" element={<CharacterSelection />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/createuser" element={<CreateUser />} />
            <Route path="/gameintro" element={<GameIntro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/levels" element={<LevelsMenu />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
