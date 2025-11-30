import { useNavigate } from "react-router-dom";
import "../styles/Home.css"

function Home() {
    const navigate = useNavigate();

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    {/* col-lg-10 = screen > 992px and col-xl-8 = screen > 1200 */}
                    <div className="col-lg-10 col-xl-8 text-center">
                        <h1 className="home-title display-3 fw-bold mb-4">
                            Master Cybersecurity One Question at a Time
                        </h1>
                        <p className="lead fs-4 text-secondary mb-5">
                            Built for aspiring analysts, students, and cybersecurity teams who want practical learning — not boring theory.
                        </p>
                        <button className="btn btn-primary btn-lg px-5 py-3 fw-semibold" onClick={() => navigate('/createuser')}>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;