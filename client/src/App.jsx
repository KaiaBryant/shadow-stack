import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Results from './pages/Results';
import Simulator from './pages/Simulator';
import CharacterSelection from "./pages/CharacterSeletion";

function App() {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character-select" element={<CharacterSelection />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/simulator" element={<Simulator />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;