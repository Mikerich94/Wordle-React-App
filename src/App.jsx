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
    <div>
      <h1>Wordle Game</h1>

      {/* Grid */}
      {Array.from({ length: 5 }).map((_, rowIndex) => {
        const guess = guesses[rowIndex] || "";
        const colors = guess ? getCellColors(guess, secretWord) : Array(5).fill("white");

        return (
          <div key={rowIndex} style={{ display: "flex" }}>
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
        <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
          <input
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
            maxLength={5}
            placeholder="Enter guess"
          />
          <button class="btn-primary" type="submit">Guess</button>
        </form>
      )}
    </div>
  );
}