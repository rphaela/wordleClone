document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();
    

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;

function getNewWord() {
        fetch('http://localhost:8000/word')
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.error(err);
        });
    }


    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");
    const messageDisplay = document.querySelectorAll(".message-container");

    
    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }
    
    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();
        
        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
            
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;
            
            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);

        if(!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if(isCorrectPosition) {
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr()

        if(currentWordArr.length !==5) { 
            // showMessage("A palavra deve conter cinco letras!");
            window.alert("A palavra deve conter cinco letras!");
        }

        const currentWord = currentWordArr.join("");

        fetch(`http://localhost:8000/check/?word=${currentWord}`)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            if(json === 'Entry guess not found') {
                window.alert("Palavra não identificada.")
                return
            }
            else {

                const firstLetterId = guessedWordCount * 5 + 1;
                const interval = 200;
                currentWordArr.forEach((letter, index) => {
                    setTimeout(() => {
                        const tileColor = getTileColor(letter, index);

                        const letterId = firstLetterId + index;
                        const letterEl = document.getElementById(letterId);
                        letterEl.classList.add("animate__flipInX"); 
                        letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                    }, interval * index);
                });

                guessedWordCount += 1;

                setTimeout(() => {
                if(currentWord === word) {
                // showMessage('Parabéns!');
                window.alert('Parabéns!');
                }

                if(guessedWords.length === 6) {
                        // showMessage(`Palavra: ${word}`);
                        window.alert(`Palavra: ${word}`)
                }}, 1000);

                guessedWords.push([]);
            }
        }).catch(err => console.log(err));
    };
    
    
    function createSquares() {
        const gameBoard = document.getElementById("board");
        
        for (let index = 0; index <30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter(){
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();


        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));

        lastLetterEl.textContent = '';
        availableSpace = availableSpace - 1;
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute("data-key");

            if(letter === "enter") {
                handleSubmitWord();
                return;
            }

            if(letter === "del") {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }

function showMessage (message) {
        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageDisplay.append(messageEl);
        setTimeout(() => messageDisplay.removeChild(messageEl), 2000)

    }

    });