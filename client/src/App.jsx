import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Results from './pages/Results';
import Simulator from './pages/Simulator';
import CharacterSelect from "./pages/CharacterSelect";
import CreateUser from "./pages/CreateUsername";
import GameIntro from "./pages/GameIntro";
import Login from "./pages/Login";
import CharacterCard from './components/CharacterCard';
import ProgressTracker from './components/ProgressTracker';
import QuestionCard from './components/QuestionCard';
import ThreatMeter from './components/ThreatMeter';


function App() {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/CharacterSelect" element={<CharacterSelect />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/GameIntro" element={<GameIntro />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;