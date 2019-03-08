# Phone Trivia

---

### What is Phone Trivia?

Phone Trivia is a browser based trivia game designed to be played by a group of players using their phones as controllers. There are 3 components to every game; Players, the Host, and a Gameboard.

---

#### Routes

/host
/game
/player

#### Host

The Host page allows the game host to select the options for the new game of trivia. The can select the number of questions, difficulty, category, etc.
Once the host submits the game a QR code is generated that any player can scan to get linked to the game. There is also an options to connect a gameboard to the game. Multiple gameboards can be linked to the same game to make it easier for players to view the questions.
After all of the players have joined the host can start the game and show the questions.

#### Game

The Game page is the gameboard. The initial screen will show a QR code that is the unique board ID. After the host scans this code and links the board the QR code will switch to be the QR code to allow players to join. 

### Player

The Player page will start by opening up a QR code reader. Once a player scans a game QR code their screen will switch to display the QR code so that it can be shared to other players. Once the host starts the game they will be prompted to get ready to begin. When questions are displayed the player will answer by entering via the on screen options.
