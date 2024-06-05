class SnakeAndLadder {
    constructor() {
        this.boardSize = 100;
        this.snakes = new Map();
        this.ladders = new Map();
        this.players = [];
        this.positions = new Map();
        this.currentPlayerIndex = 0;
        this.gameStatusElement = document.getElementById("game-status");
        this.diceResultElement = document.getElementById("dice-result");
        this.boardElement = document.getElementById("board");

        this.createBoard();
    }

    addSnakes(snakeList) {
        snakeList.forEach(([head, tail]) => {
            this.snakes.set(head, tail);
            this.placeImage(head, tail, 'snake', 'snake.png');
        });
    }

    addLadders(ladderList) {
        ladderList.forEach(([start, end]) => {
            this.ladders.set(start, end);
            this.placeImage(start, end, 'ladder', 'ladder.png');
        });
    }

    addPlayers(playerNames) {
        this.players = playerNames;
        playerNames.forEach(name => {
            this.positions.set(name, 0);
        });
        this.updatePlayerPositions();
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    movePlayer(player, roll) {
        let initialPosition = this.positions.get(player);
        let newPosition = initialPosition + roll;
    
        if (newPosition > this.boardSize) {
            newPosition = initialPosition;
        }
    
        newPosition = this.checkSnakeOrLadder(newPosition);
        this.positions.set(player, newPosition);
    
        const playerMoveText = `${player} rolled a ${roll} and moved from ${initialPosition} to ${newPosition}\n`;
        const truncatedMoveText = playerMoveText.length > 50 ? playerMoveText.substring(0, 50) + "..." : playerMoveText;
        this.gameStatusElement.innerText += truncatedMoveText;
    
        if (newPosition === this.boardSize) {
            this.gameStatusElement.innerText += `${player} wins the game!\n`;
            return true;
        }
    
        this.updatePlayerPositions();
        return false;
    }
    

    checkSnakeOrLadder(position) {
        while (this.snakes.has(position) || this.ladders.has(position)) {
            if (this.snakes.has(position)) {
                position = this.snakes.get(position);
            } else if (this.ladders.has(position)) {
                position = this.ladders.get(position);
            }
        }
        return position;
    }

    updatePlayerPositions() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.innerHTML = '');

        this.positions.forEach((pos, player) => {
            const cell = document.querySelector(`.cell[data-cell='${pos}']`);
            if (cell) {
                const playerDiv = document.createElement('div');
                playerDiv.classList.add('player');
                playerDiv.innerText = player[0];
                cell.appendChild(playerDiv);
            }
        });
    }

    createBoard() {
        for (let i = 100; i > 0; i--) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.cell = i;
            cell.innerText = i;
            this.boardElement.appendChild(cell);
        }
    }

    placeImage(start, end, type, imageUrl) {
        const startCell = document.querySelector(`.cell[data-cell='${start}']`);
        const endCell = document.querySelector(`.cell[data-cell='${end}']`);

        if (startCell && endCell) {
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();
            const boardRect = this.boardElement.getBoundingClientRect();

            const image = document.createElement('div');
            image.classList.add(type);
            image.style.backgroundImage = `url(${imageUrl})`;
            image.style.width = '50px'; 
            image.style.height = '50px'; 
            image.style.position = 'absolute';
            image.style.left = `${(startRect.left + endRect.left) / 2 - boardRect.left - 25}px`;
            image.style.top = `${(startRect.top + endRect.top) / 2 - boardRect.top - 25}px`;

            this.boardElement.appendChild(image);
        }
    }

            
    playTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const diceRoll = this.rollDice();
        this.diceResultElement.innerText = `${currentPlayer} rolled a ${diceRoll}`;
    
        const truncatedDiceResult = `${currentPlayer} rolled a ${diceRoll}`;
        this.diceResultElement.innerText = truncatedDiceResult.length > 20 ? truncatedDiceResult.substring(0, 20) + "..." : truncatedDiceResult;
    
        const hasWon = this.movePlayer(currentPlayer, diceRoll);
    
        if (hasWon) {
            document.getElementById("roll-dice").disabled = true;
        } else {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
    }
    
            
                startGame() {
                    this.currentPlayerIndex = 0;
                    this.gameStatusElement.innerText = '';
                    document.getElementById("roll-dice").disabled = false;
                }
            }
            
            document.getElementById('roll-dice').addEventListener('click', () => {
                game.playTurn();
            });
            
            const snakes = [
                [62, 5], [33, 6], [49, 9], [88, 16], [41, 20], [56, 53], [98, 64], [93, 73], [95, 75]
            ];
            const ladders = [
                [2, 37], [27, 46], [10, 32], [51, 68], [61, 79], [65, 84], [71, 91], [81, 100]
            ];
            const players = ['Gaurav', 'Sagar'];
            
            const game = new SnakeAndLadder();
            game.addSnakes(snakes);
            game.addLadders(ladders);
            game.addPlayers(players);
            game.startGame();
            