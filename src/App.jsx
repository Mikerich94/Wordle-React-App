import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const words = [
      "ABOUT", "OTHER", "WHICH", "THEIR", "THERE",
      "APPLE", "TRAIN", "PLANT", "BRICK", "CHAIR",
      "WATER", "LIGHT", "HOUSE", "SOUND", "WORLD"
    ];

    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSecretWord(randomWord);
    setStatus("playing");
  }, []);

  // Handle submitting a guess
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentGuess.length !== 5) return;
    if (status !== "playing") return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === secretWord) {
      setStatus("won");
    } else if (newGuesses.length === 5) {
      setStatus("lost");
    }
  };

  // Determine colors for each letter in a guess
  const getCellColors = (guess, secretWord) => {
    const colors = Array(5).fill("red");
    const secretLetters = secretWord.split("");

    // 1First pass: green matches
    guess.split("").forEach((letter, i) => {
      if (letter === secretLetters[i]) {
        colors[i] = "green";
        secretLetters[i] = null; // mark used
      }
    });

    // 2Second pass: yellow matches
    guess.split("").forEach((letter, i) => {
      if (colors[i] !== "green") {
        const index = secretLetters.indexOf(letter);
        if (index !== -1) {
          colors[i] = "yellow";
          secretLetters[index] = null; // mark used
        }
      }
    });

    return colors;
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="app">
      <div className="game-container">
        <h1 className="title">Wordle</h1>
        <div className="instructions">
        <p>Try to guess the 5 letter word. You have 5 attempts to do so.</p>
        <p>As you guess, letters will change color to indicate how close your guess is to the secret word.</p>
       <ul style={{ margin:0}}>
        <li style={{ color: "green" }}>Green: Correct letter in the correct position</li>
        <li style={{ color: "#b59f3b" }}>Yellow: Correct letter in the wrong position</li>
        <li style={{ color: "red" }}>Red: Letter not in the word</li>
        </ul>
        </div>
        {/* Grid */}
        {Array.from({ length: 5 }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || "";
          const colors = guess ? getCellColors(guess, secretWord) : Array(5).fill("white");

          return (
            <div className="guess-row" key={rowIndex} style={{ display: "flex", justifyContent: "center" }}>
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const letter = guess[colIndex] || "";
                const bg = colors[colIndex];
                return (
                  <div
                    key={colIndex}
                    className="guess-letter"
                    style={{
                      backgroundColor: bg,
                      width: 40,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 2,
                      fontWeight: "bold",
                      fontSize: 20,
                      color: bg === "red" ? "white" : "black",
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Win/loss messages */}
        {status === "won" && <p>You've won! 🎉</p>}
        {status === "lost" && <p>You've lost! The word was {secretWord}.</p>}

        {/* Guess form */}
        {status === "playing" && (
          <form onSubmit={handleSubmit} className="form">
            <div className="input-wrapper">
              <input
                className="input-modern"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                maxLength={5}
                placeholder="ENTER GUESS"
              />
            </div>

            <button className="btn-primary" type="submit">
              Guess
            </button>
          </form>
        )}
      </div>
    </div>
  );
}