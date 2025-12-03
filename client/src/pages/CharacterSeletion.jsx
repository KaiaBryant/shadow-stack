import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CharacterSelection.css';

function CharacterSelection() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(2);

    // Retrieve username from session
    const username = localStorage.getItem("username");
    const user_id = localStorage.getItem("user_id");

    // Fetch characters from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/characters")
            .then(res => res.json())
            .then(data => {
                setCharacters(data);
                setCurrentIndex(0);
            })
            .catch(err => console.error("Error loading characters:", err));
    }, []);


    // Save character to DB
    const saveCharacter = async (character_id) => {
        const response = await fetch("http://localhost:5000/api/users/character", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: Number(user_id), character_id }),
        });

        return response.json();
    };


    // When user clicks "Select Character"
    const handleSelectCharacter = async () => {
        const selectedCharacter = characters[currentIndex];

        try {
            await saveCharacter(selectedCharacter.id);

            // store on frontend too
            localStorage.setItem("character_id", selectedCharacter.id);

            navigate('/objective');
        } catch (err) {
            console.error("Error saving character:", err);
            alert("Could not save character");
        }
    };

    // Left arrow
    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
    };

    // Right arrow
    const handleNext = () => {
        setCurrentIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
    };

    // Click on cards
    const handleCardClick = (position) => {
        if (position === -1) {
            // Clicked left card
            handlePrevious();
        } else if (position === 1) {
            // Clicked right card
            handleNext();
        }
        // If position === 0 (center card), do nothing (it's already selected)
    };

    const getVisibleCharacters = () => {
        const visible = [];
        for (let i = -1; i <= 1; i++) {
            let index = currentIndex + i;
            if (index < 0) {
                index = characters.length + index;
            }
            if (index >= characters.length) {
                index = index - characters.length;
            }
            visible.push({ ...characters[index], position: i });
        }
        return visible;
    };

    const visibleCharacters = getVisibleCharacters();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <h2 className="text-white char-selection-title display-1 fw-bold mb-2">
                Welcome, {username}!
            </h2>

            <h1 className="text-white display-6 fw-bold mb-5">
                Select Your Character
            </h1>

            <div className="character-slider-container position-relative">
                <div className="d-flex justify-content-center align-items-center h-100 position-relative">

                    {visibleCharacters.map((character) => (
                        <div
                            key={character.id}
                            className={`character-card position-absolute d-flex flex-column align-items-center justify-content-center ${character.position === 0 ? 'center' : 'side'}`}
                            style={{
                                transform: `translateX(${character.position * 320}px) scale(${character.position === 0 ? 1 : 0.7})`,
                                cursor: character.position !== 0 ? 'pointer' : 'default'
                            }}
                            onClick={() => handleCardClick(character.position)}
                        >
                            <div className="character-box border border-3 border-dark rounded bg-white shadow-lg d-flex align-items-center justify-content-center">
                                <img
                                    src={character.url}
                                    alt={character.character_name}
                                    className="character-avatar-img"
                                />
                            </div>
                        </div>
                    ))}

                </div>

                {/* Navigation Buttons */}
                <button
                    className="btn btn-dark btn-lg position-absolute top-50 start-0 translate-middle-y nav-btn-left"
                    onClick={handlePrevious}
                >
                    &#8592;
                </button>

                <button
                    className="btn btn-dark btn-lg position-absolute top-50 end-0 translate-middle-y nav-btn-right"
                    onClick={handleNext}
                >
                    &#8594;
                </button>
            </div>

            <button
                className="charselect-btn btn-lg px-5 py-3 fw-semibold mb-5"
                onClick={handleSelectCharacter}
            >
                Select Character
            </button>
        </div>
    );
}

export default CharacterSelection;