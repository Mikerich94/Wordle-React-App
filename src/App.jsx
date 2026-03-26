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

  // handleSubmit lives here, before the return
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentGuess.length !== 5) return;   // fixed typo: currentGuess
    if (status !== "playing") return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === secretWord) {
      setStatus("won");
    } else if (newGuesses.length === 5) {    // use newGuesses, not guesses
      setStatus("lost");
    }
  };

  // Cell color logic
  const getCellColor = (guess, colIndex) => {
    if (!guess) return "white";
   const letter = guess[colIndex] || ""; //prevent undefined error when guess is shorter than 5 letters
    if (secretWord[colIndex] === letter) return "green";      // right spot
    if (secretWord.includes(letter)) return "yellow";         // wrong spot
    return "red";                                             // not in word
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Wordle Game</h1>

      {/* Grid with coloring */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {Array.from({ length: 5 }).map((_, colIndex) => {
            const guess = guesses[rowIndex] || "";
            const letter = guess[colIndex] || "";
            const bg = guess ? getCellColor(guess, colIndex) : "white";

            return (
              <div
                key={colIndex}
                className="guess-letter"
                style={{ backgroundColor: bg, margin: 2 }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}

      {/* Win/loss messages */}
      {status === "won" && <p>You've won! 🎉</p>}
      {status === "lost" && <p>You've lost! The word was {secretWord}.</p>}

      {/* Form is inside the return, only shown while playing */}
      {status === "playing" && (
        <form onSubmit={handleSubmit}>
          <input
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
            maxLength={5}
            placeholder="Enter guess"
          />
          <button type="submit">Guess</button>
        </form>
      )}
    </div>
  );
}