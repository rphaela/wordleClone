const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

let wordle = "swift";

// const getWordle = () => {
//     fetch('https://od-api.oxforddictionaries.com/api/v2/word')
//     .then(response => response.json())
//     .then(json => {
//         console.log(json)
//         wordle = json.toUpperCase()
//     })
//     .catch(err => console.log(err))
// }

// getWordle()

const keys = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "Enter",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "<<",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  buttonElement.addEventListener("keydown", (e) => logKey(e.key));
  keyboard.append(buttonElement);
});

const handleClick = (letter) => {
  console.log("clicked", letter);

  if (letter === "<<") {
    deleteLetter();
    console.log("guessRows", guessRows);
    return;
  }
  if (letter === "Enter") {
    checkRow();
    console.log("guessRows", guessRows);
    return;
  }
  addLetter(letter);
};

const logKey = (letter) => {
  console.log("clicked", letter);

  const lettersPattern = /[a-z]/;
  lettersPattern.test(letter);

  if (letter === "Enter") {
    checkRow();
    console.log("guessRows", guessRows);
    return;
  }

  if (letter === "Backspace") {
    deleteLetter();
    console.log("guessRows", guessRows);
    return;
  } else {
    if (lettersPattern.test(letter) && letter.length === 1) {
      addLetter(letter);
      return;
    }
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
    console.log("guessRows", guessRows);
  }
};

const deleteLetter = () => {
  if (currentTile > 0 && !isGameOver) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join("");

  if (currentTile > 4) {
    console.log("guess is", guess + " wordle is " + wordle);
    flipTile();

    if (wordle === guess) {
      if (currentRow === 0) {
        setTimeout(() => {
          showMessage("genius");
          isGameOver = true;
          jumpTile();
        }, 2400);
        return;
      }
      if (currentRow === 1) {
        setTimeout(() => {
          showMessage("magnificent");
          isGameOver = true;
          jumpTile();
        }, 2400);
        return;
      }
      if (currentRow === 2) {
        setTimeout(() => {
          showMessage("impressive");
          isGameOver = true;
          jumpTile();
        }, 2400);
        return;
      }
      if (currentRow === 3) {
        setTimeout(() => {
          showMessage("splendid");
          isGameOver = true;
          jumpTile();
        }, 2400);
        return;
      }
      if (currentRow === 4) {
        setTimeout(() => {
          showMessage("great");
          isGameOver = true;
          jumpTile();
        }, 2400);
        return;
      }
      if (currentRow === 5) {
        setTimeout(() => {
          showMessage("phew");
          isGameOver = true;
          jumpTile();
        }, 2400);
        return;
      }
    } else {
      if (currentRow >= 5) {
        setTimeout(() => {
          showMessage(`${wordle}`);
          isGameOver = true;
        }, 2400);
        return;
      }
      if (currentRow < 5) {
        setTimeout(() => {
        currentRow++;
        currentTile = 0;}, 2400)
      }
    }
  } else {
    showMessage("Not enough letters");
    shakeTile();
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter) && guess.color != "green-overlay") {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};

const shakeTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;

  rowTiles.forEach((tile) => {
    tile.classList.add("shake");
  });
};

const jumpTile = () => {
    const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add("jump");
        }, 250 * index);
      });
    };
