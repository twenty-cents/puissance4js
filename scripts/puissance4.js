class Puissance4 {

    constructor(gridRows, gridCols, player1, player2) {
        // Paramètres reçus
        this.gridRows = gridRows;
        this.gridCols = gridCols;
        this.player1 = player1;
        this.player2 = player2;
        // Paramètres de "classe"
        this.grid = null;
        this.turnsToPlay = gridRows * gridCols;
    }

    /**
     * Initialize a new grid with empty tokens
     */
    initGrid() {
        // Init game : 6 rows / 7 columns
        this.grid = new Array(this.gridRows).fill(0).map(() => new Array(this.gridCols).fill(0));

        // Init each token as empty
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                this.grid[row][col] = new Token(row, col, "empty");
            }
        }

        // Delete all tokens 
        let gridGraphEl = document.getElementById("id-game-grid-front");
        while(gridGraphEl.firstChild){
            gridGraphEl.removeChild(gridGraphEl.firstChild);
        }
    }

    /**
     * Display the game grid
     * 
     */
    displayGrid() {
        let gridGraphEl = document.getElementById("id-game-grid-front");  

        // Display actual grid turn
        let row2 = -1;
        for(let row = this.gridRows-1; row >= 0; row--){
            row2++;

            for(let col = 0; col < this.gridCols; col++){
                // Ajout d'un token
                let cols = this.grid[row];

                // Ajout d'un token dans la grille graphique
                if(cols[col].status == 'red' || cols[col].status == 'yellow') {
                    let divEl = document.createElement("div");
                    divEl.classList.add("token-" + cols[col].status);
                    const left = 82 + (col) * 92;
                    const top = 42 + (row2) * 92;
                    divEl.style.left = left + "px";
                    divEl.style.top = top + "px";
                    gridGraphEl.appendChild(divEl);    
                }
            }
        }
    }

    /**
     * Play a turn
     * @param player
     */
    newTurn(player, col){

        if(player.type === "HUMAN"){
            return this.newTurnHuman(player, col);
        } else {
            return this.newTurnBot(player);
        }
    }

    /**
     * Play a turn (human)
     * @param {Player} player 
     */
     newTurnHuman(player, col){
        return this.play(player, col);
    }

    /**
     * Play a turn (bot)
     * @param {Player} player 
     */
    newTurnBot(player){
        // Random number between 0 and 6
        let randomCol = Math.floor(Math.random() * Math.floor(6))
        // Play
        //this.play(player, randomCol);
        return this.play(player, randomCol);
    }

    /**
     * Play a turn
     * @param {Player} player 
     * @param {Number} col 
     */
    play(player, col) {
        let isDone = false;

        for (let row = 0; row < this.gridRows; row++) {
            if (this.grid[row][col].status === "empty") {
                this.grid[row][col].setStatus(player.color);
                isDone = true;
                break;
            }
        }

        return isDone;
    }

    /**
     * Check if a player has win the game
     * @param {*} player 
     */
    checkVictory(player) {
        let victory = false;
        const color = player.color;

        // Check for four consecutive tokens on a row
        for (let row = 0; row < this.gridRows; row++) {
            for (let col = 0; col < this.gridCols; col++) {
                let ph = 0;
                let pv = 0;
                let x1 = 0;
                let x2 = 0;
                let x3 = 0;
                let x4 = 0;

                if (this.grid[row][col].status === color) {
                    // Check victory on a row
                    ph++;
                    ph += this.checkTocken(row, col + 1, color)
                        + this.checkTocken(row, col + 2, color)
                        + this.checkTocken(row, col + 3, color);

                    // Check victory on a col
                    pv++;
                    pv += this.checkTocken(row + 1, col, color)
                        + this.checkTocken(row + 2, col, color)
                        + this.checkTocken(row + 3, col, color);

                    // Check victory on a diagonal
                    x1++;
                    x1 += this.checkTocken(row + 1, col + 1, color)
                        + this.checkTocken(row + 2, col + 2, color)
                        + this.checkTocken(row + 3, col + 3, color);

                    x2++;
                    x2 += this.checkTocken(row + 1, col - 1, color)
                        + this.checkTocken(row + 2, col - 2, color)
                        + this.checkTocken(row + 3, col - 3, color);

                    x3++;
                    x3 += this.checkTocken(row - 1, col + 1, color)
                        + this.checkTocken(row - 2, col + 2, color)
                        + this.checkTocken(row - 3, col + 3, color);

                    x4++;
                    x4 += this.checkTocken(row - 1, col - 1, color)
                        + this.checkTocken(row - 2, col - 2, color)
                        + this.checkTocken(row - 3, col - 3, color);

                }

                if (ph == 4 || pv == 4 || x1 == 4 || x2 == 4 || x3 == 4 || x4 == 4) {
                    victory = true;
                    break;
                }
            }
        }

        if (victory) {
            console.log(`Victoire de ${player.name}, couleur ${player.color}`);
            //System.out.println(String.format(displayVictory, player.getName(), player.getColor()));
        }
        return victory;
    }

    /**
     * Check the content of a token
     * @param {number} row 
     * @param {number} col 
     * @param {string} color 
     */
    checkTocken(row, col, color) {
        let points = 0;

        if (row >= this.gridRows || row < 0)
            return points;

        if (col >= this.gridCols || col < 0)
            return points;

        if (this.grid[row][col].status == color) {
            points++;
        }
        return points;
    }

}