// Clone of Josh Wardle's Wordle Game
// https://www.nytimes.com/games/wordle/index.html
// Cloned by Ian Ostrom using NYT Wordle dataset in Code.org's App Lab


// sets up the word bank of five letter words

// very long list of valid guesses 10,000
var validGuesses = getColumn("Wordle","validWordleGuess");

// much shorter 2308 item list that the correct answer is chosen from at random
var answers = getColumn("Wordle", "validWordleAnswer");


// cuts out the 7000+ null values at the end of the answers list
answers.length = 2308; 



// chooses the correct word for the game instance
var correctWord = chooseWord();

// currentRow and Column allow the letter input spaces to be a 
// 2D array with IDs in the format of A0-F4
var currentColumn = 0; // columns are 0-4
var currentRow = "A"; // rows are A-F
var numGuesses = 1;
var streak = 0;

// sets up the game
createTitle("Wordo");
placeLetterRows();
createButtons();
setEventHandlers();
setupWinOverlay();
setupAlert();


/* Begin gameplay functions */

// Called when a letter key button is pressed.
// Sets the text of the letter in the first empty space in the current row.
function handleLetter(letter){
  if(currentColumn < 5){
    var id = currentRow + currentColumn;
    setText(id, letter);
    currentColumn++;
  }
}

// Clears the last space that has a letter 
// when the backspace button is pressed.
function handleBackSpace(){
  if(currentColumn > 0){
    currentColumn--;
    var id = currentRow + currentColumn;
    resetLetter(id);
  }
}

// Handles an ENTER keypress
function handleEnter(){
  
  // gets the word from the last row entered
  var word = "";
  
  for(var i = 0; i < 5; i++){
    word += getText(currentRow + i);
  }
  
  word = word.toLowerCase(); // to match the lowercase in the dataset
  
  
  // checks if the word is 5 letters and is in the word list
  if(!checkLongEnough(word)){
    toggleAlertHidden(false, "Not enough letters");
    return;
  } else if(!checkValid(word.toLowerCase())){
    toggleAlertHidden(false, "Not in wordlist");
    return;
  } 
  
  // sets color hints for each of the letters/buttons
  checkCorrectLetters(word);
  
  // checks for win/loss and if neither procedes to next row
  if(checkWin(word.toLowerCase())){
        setTimeout(function(){
          handleWin();          
        }, 1000);    
  } else if(numGuesses > 5){ // check for loss
        setTimeout(function(){
          handleLoss();          
        }, 1000);
  } else { //go to next row
      currentRow = nextLetter(currentRow);
      currentColumn = 0;
      numGuesses++;
      toggleAlertHidden(false, "Guess is incorrect");
      // need to change letter/button colors
  }
}


// helper functions for the handleEnter function
function checkLongEnough(word){
  return word.length == 5; 
}

// checks if the entered word is in either the validGuesses or answers lists
function checkValid(word){
  return (validGuesses.indexOf(word) != -1 || answers.indexOf(word) != -1);
}

// checks if the word matches the chosen word for the current game
function checkWin(word){
  return (word == correctWord);
}

// sets the congrats message and makes the win/loss overlay visible
function handleWin(){
  var guessText = (numGuesses == 1) ? " guess!" : " guesses!";
  streak++;
  var congrats = "You win in " + numGuesses + guessText + "\nYour streak is " + streak + ".";
  
  setText("winText", congrats);
  toggleOverlayHidden(false); // false sets visibility of winOverlay to visible
}

// sets the loss message and makes the win/loss overlay visible
function handleLoss(){
  streak = 0;
  var condolence = "Sorry, you lose.\n\nThe word was\n" + correctWord.toUpperCase();
  
  setText("winText", condolence);
  toggleOverlayHidden(false);
}

// checks the letters in an inputted word
// and sets the letter/key colors to either green (correct)
// yellow (in the word but wrong position)
// grey (not in the word).
function checkCorrectLetters(word){
  for(var i = 0; i < word.length; i++){
    var letter = word[i]; // keys
    var id = currentRow + i; // letter spaces
    if(letter == correctWord[i]){
      changeGreen(id);
      // letter must be uppercase here to match the id of the letter space
      changeGreen(letter.toUpperCase()); 
    } else if(correctWord.indexOf(letter) != -1){
      changeYellow(id);
      changeYellow(letter.toUpperCase());
    } else {
      changeGrey(id);
      changeGrey(letter.toUpperCase());
    }
  }
}


// helper functions to set the colors of the keys/letters
function changeGreen(id){
  setStyle(id, "background-color: green;");
  setStyle(id, "color: white;");
}

function changeYellow(id){
  setStyle(id, "background-color: #eed60e;");
  setStyle(id, "color: white;");
}

function changeGrey(id){
  setStyle(id, "background-color: grey;");
  setStyle(id, "color: white;");
}

/* End gameplay functions */



/* Begin game setup functions */

// chooses the target word for the current game instance
function chooseWord(){
  return answers[randomNumber(0, answers.length-1)];
}

// creates the title banner for the app
function createTitle(title){
  textLabel("title", title);
  setPosition("title", 0, 0, 320, 40);
  setStyle("title", "font-family: serif");
  setStyle("title", "font-size: 2.5em;");
  setStyle("title", "font-weight: bold");
  setStyle("title", "padding: 0;");
  setStyle("title", "text-align: center;");
  setStyle("title", "border-bottom: 1px solid LightGray;");

}

// creates one row of letter spaces and sets their style
// the ID uses the format of A0 - rows A-F and columns 0-4
function createLetterRow(letter, yPos){
  for(var i = 0; i < 5; i++){
    var id = letter + i;
    textLabel(id, "");
    setStyle(id, "font-size: 1.5em;");
    setStyle(id, "padding: .25em 0;");
    setStyle(id, "text-align: center;");
    setStyle(id, "border: 1px solid Gainsboro;");
    setPosition(id, (54 + (44 * i)), (55 + yPos), 38 , 36);
  }
}

// places all the rows of letter spaces in a 5x6 grid
function placeLetterRows(){
  var letter = "A";
  for(var i = 0; i < 6; i++){
    createLetterRow(letter, 40 * i);
    letter = nextLetter(letter);
  }
}

// helper function to iterate from A-Z
// used by several functions
function nextLetter(letter){
  return String.fromCharCode(letter.charCodeAt(0) + 1);
}

// iterates through all the letter spaces and calls the reset letter function
function resetLetters(){
  var letter = "A";
  for(var i = 0; i < 6; i++){
    for(var j = 0; j < 5; j++){
      var id = letter + j;
      resetLetter(id);
    }
    letter = String.fromCharCode(letter.charCodeAt(0) + 1);
  }
}

// resets the color of each letter
function resetLetter(id){
  setText(id, "");
  setStyle(id, "color: black;");
  setStyle(id, "background-color: white;");
}

// creates all the keyboard buttons
function createButtons(){
  var row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  var row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  var row03 = ["ENTER"];
  var row3 = ["Z", "X", "C", "V", "B", "N", "M", "\u232B"];

  
  function createButtonRow(row, yPos, xOffset, thickness){
    for(var i = 0; i < row.length; i++){
      var id = row[i];
      button(id, id);
      setStyle(id, "border: none;");
      setStyle(id, "background-color: LightGray;");
      setStyle(id, "color: black;");
      setStyle(id, "font-family: Arial;");
      setStyle(id, "padding: .25em 0;");
      setPosition(id, xOffset + (28 * i), (45 + yPos), thickness , 30);
    }
  }
  createButtonRow(row1, 270, 22, 24);
  createButtonRow(row2, 310, 38, 24);
  createButtonRow(row03, 350, 20, 60);
  createButtonRow(row3, 350, 84, 24);
}

// resets the keyboard buttons to the default colors
function resetButtons(){
  var letters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
  for(var i = 0; i < letters.length; i++){
    setStyle(letters[i], "background-color: LightGray;");
    setStyle(letters[i], "color: black;");
  }
}

// creates Event handlers for each of the buttons
function setEventHandlers(){
  onEvent("ENTER", "click", handleEnter);
  onEvent("\u232B", "click", handleBackSpace);
  
  var letters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

  for(var i = 0; i < letters.length; i++){
    setEvent(letters[i]);
  }
  
  function setEvent(id){
    onEvent(id, "click", function(){
      handleLetter(id);
    });
  }
}

// main game reset function
function resetBoard(){
  resetLetters();
  resetButtons();
  correctWord = chooseWord();
  currentRow = "A";
  currentColumn = 0;
  numGuesses = 1;
}

// creates the overlay popup that shows upon win/loss
function setupWinOverlay(){
  // blurs the gameboard behind the overlay
  textLabel("blur", "");
  setSize("blur", 320, 450);
  setStyle("blur", "z-index: 1");  
  setStyle("blur", "background-color: rgba(255, 255, 255, 0.3)");
  
  // creates the overlay
  textLabel("overlay", "");
  setPosition("overlay", 20, 75, 280, 300);
  setStyle("overlay", "z-index: 2");
  setStyle("overlay", "background-color: white;");
  setStyle("overlay", "border: 1px solid GainsBoro;");
  setStyle("overlay", "border-radius: 5px;");
  setStyle("overlay", "box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);");
    
  // creates the text label for the congrats message
  textLabel("winText", "");
  setPosition("winText", 30, 140, 260, 40);
  setStyle("winText", "z-index: 3;");
  setStyle("winText", "font-size: 1.5em;");
  setStyle("winText", "text-align: center;");
  
  // creates the play again button
  button("playAgain", "Play Again");
  setStyle("playAgain", "z-index: 3;");
  setPosition("playAgain", 100, 280);
  
  onEvent("playAgain","click", function(){
    toggleOverlayHidden(true); // true sets visibility of winOverlay to hidden
    resetBoard();
  });
  
  toggleOverlayHidden(true);
}

// toggles the visibility of all elements on the winOverlay
function toggleOverlayHidden(bool){
  var elements = ["blur", "overlay", "winText", "playAgain"];
  for(var i = 0; i < elements.length; i++){
    setProperty(elements[i], "hidden", bool);
  }
}

// creates the alert message box that shows when the enter button is pressed
function setupAlert(){
  textLabel("alert", "");
  setStyle("alert", "z-index: 1;");
  setPosition("alert", 80, 40, 160, 20);
  setStyle("alert", "font-size: 0.9em;");
  setStyle("alert", "text-align: center;");
  setStyle("alert", "background-color: black;");
  setStyle("alert", "color: white;");
  setStyle("alert", "border-radius: 5px");
  
  toggleAlertHidden(true, "");
}

// hides/shows the alert message box
// has a 2 second delay before the box disappears
function toggleAlertHidden(bool, text){
  setText("alert", text);
  setProperty("alert", "hidden", bool);
  if(bool == false){
    setTimeout(function(){
      toggleAlertHidden(true, "");
    } , 2000);
  }
}

/* End game setup functions */
