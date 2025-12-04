import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


function Home({ holidayMode }) {   
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const username = localStorage.getItem("username");
    const maxUnlocked = localStorage.getItem("maxUnlockedLevel");

    if (username && maxUnlocked) {
      navigate("/levels");
    } else {
      navigate("/createuser");
    }
  };

  return (
    <>
      {/* Snow only when holidayMode is true */}
      {holidayMode && (
        <div id="background">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i}>
              <span />
            </div>
          ))}
        </div>
      )}

      {/* Main home content */}
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8 text-center">

              <h1 className="home-title oxanium-home-title display-3 fw-bold mb-4">
                Shadow Stack
              </h1>

              <p className="subhead fs-4 mb-5">
                Built for aspiring analysts, students, and cybersecurity teams who want
                practical learning — not boring theory.
              </p>

              <button
                className="home-btn btn-lg px-5 py-3"
                onClick={handleGetStarted}
              >
                Get Started
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
