import { useNavigate } from "react-router-dom";
import "../styles/Home.css"

function Home() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
    const username = localStorage.getItem("username"); 
    const maxUnlocked = localStorage.getItem("maxUnlockedLevel");

    if (username && maxUnlocked) {
      // User has already created a profile and started playing
      navigate("/levels");
    } else {
      // New user — start onboarding
      navigate("/createuser");
    }
  };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    {/* col-lg-10 = screen > 992px and col-xl-8 = screen > 1200 */}
                    <div className="col-lg-10 col-xl-8 text-center">
                        <h1 className="home-title oxanium-home-title display-3 fw-bold mb-4">
                            Shadow Stack
                        </h1>
                        <p className="subhead fs-4 mb-5">
                            Built for aspiring analysts, students, and cybersecurity teams who want practical learning — not boring theory.
                        </p>
                        <button className="home-btn btn-lg px-5 py-3" onClick={handleGetStarted}>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;