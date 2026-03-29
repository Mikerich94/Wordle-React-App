import "./styles.css";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

type GameStatus = "loading" | "playing" | "won" | "lost";

export default function App() {
  const [secretWord, setSecretWord] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [status, setStatus] = useState<GameStatus>("loading");
  const [error, setError] = useState<string>(""); // holds error message

  useEffect(() => {
    const words: string[] = [
      "ABOUT", "OTHER", "WHICH", "THEIR", "THERE",
      "APPLE", "TRAIN", "PLANT", "BRICK", "CHAIR",
      "WATER", "LIGHT", "HOUSE", "SOUND", "WORLD"
    ];

    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSecretWord(randomWord);
    setStatus("playing");
  }, []);

  // Handle submitting a guess
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  //Warn when guess is not 5 letters long
  if (currentGuess.length !== 5) {
    setError("Guess must be 5 letters long");
    return;
  }

  if (status !== "playing") return;

  const newGuesses = [...guesses, currentGuess];
  setGuesses(newGuesses);
  setCurrentGuess("");
  setError(""); // clear error when guess is valid

  if (currentGuess === secretWord) {
    setStatus("won");
  } else if (newGuesses.length === 5) {
    setStatus("lost");
  }
};

  
  // Determine colors for each letter in a guess
  const getCellColors = (guess: string, secretWord: string): string[] => {
    const colors: string[] = Array(5).fill("red");
    const secretLetters: (string | null)[] = secretWord.split("");

    // First pass: green matches
    guess.split("").forEach((letter, i) => {
      if (letter === secretLetters[i]) {
        colors[i] = "green";
        secretLetters[i] = null;
      }
    });

    // Second pass: yellow matches
    guess.split("").forEach((letter, i) => {
      if (colors[i] !== "green") {
        const index = secretLetters.indexOf(letter);
        if (index !== -1) {
          colors[i] = "yellow";
          secretLetters[index] = null;
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
          <ul style={{ margin: 0 }}>
            <li style={{ color: "green" }}>Green: Correct letter in the correct position</li>
            <li style={{ color: "#b59f3b" }}>Yellow: Correct letter in the wrong position</li>
            <li style={{ color: "red" }}>Red: Letter not in the word</li>
          </ul>
        </div>

        <div className="game-wrapper">
  {/* Grid */}
  {Array.from({ length: 5 }).map((_, rowIndex) => {
    const guess = guesses[rowIndex] || "";
    const colors = guess
      ? getCellColors(guess, secretWord)
      : Array(5).fill("white");

    return (
      <div key={rowIndex} className="grid-row">
        {Array.from({ length: 5 }).map((_, colIndex) => {
          const letter = guess[colIndex] || "";
          const bg = colors[colIndex];
          return (
            <div
              key={colIndex}
              className="grid-cell"
              style={{ backgroundColor: bg }}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  })}

  {/* Guess form */}
  {status === "playing" && (
    <form onSubmit={handleSubmit} className="guess-form">
      <input
        value={currentGuess}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setCurrentGuess(e.target.value.toUpperCase())
        }
        maxLength={5}
        placeholder="ENTER GUESS"
      />
      <button type="submit">Guess</button>
    </form>
  )}
</div>
      </div>
    </div>
  );
}