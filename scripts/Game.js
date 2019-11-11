class Game {

    constructor() {
        this.player1 = null;
        this.player2 = null;
        this.game = null;
    }

    /**
     * Initialize the game controller
     */
    init() {
        // Animate the arrow
        document.getElementById("id-game-grid-front").addEventListener("mousemove", function (e) {
            e.preventDefault();
            game.onGridMousemove(e)
        });

        // Play
        document.getElementById("id-game-grid-front").addEventListener("click", function (e) {
            e.preventDefault();
            game.onClickPlayTurn(e, null)
        });

        // Display player select window
        this.openModalWindowStartGame();
    }

    /**
     * Start a new game
     */
    newGame() {
        this.game = new Puissance4(6, 7, this.player1, this.player2);
        this.game.initGrid();
        this.game.displayGrid();
        this.newTurn(this.player1);
    }

    /**
     * Animate the arrow
     * @param {Event} e 
     */
    onGridMousemove(e) {
        let arrowEl = document.getElementById("id-arrow");

        let x = e.screenX;
        if (x < 120) {
            x = 120;
        }
        if (x > 680) {
            x = 680;
        }

        arrowEl.style.left = x - 51 + "px";
    }

    /**
     * 
     * @param {*} e 
     * @param {*} typePlayer 
     */
    onClickPlayTurn(e) {
        let col = -1;
        let x = 0;

        if (e != null) {
            // Stop bubbling event
            e.preventDefault();

            // Get column
            x = e.screenX;

            if (x >= 40 && x <= 160) {
                col = 0;
            }
            if (x >= 180 && x <= 250) {
                col = 1;
            }
            if (x >= 270 && x <= 340) {
                col = 2;
            }
            if (x >= 360 && x <= 430) {
                col = 3;
            }
            if (x >= 450 && x <= 520) {
                col = 4;
            }
            if (x >= 540 && x <= 610) {
                col = 5;
            }
            if (x >= 630 && x <= 780) {
                col = 6;
            }

        } else {
            col = 0;
        }

        //console.log("x=" + x + ", col=" + col);

        if (col != -1) {
            let winner = false;
            let nextPlayer = null;

            //console.log("game : " + this.game.turnsToPlay);

            // Play a new turn
            let isDone = false;
            if (this.game.turnsToPlay % 2 == 0) {
                isDone = this.game.newTurn(this.player1, col);
                // Check if a player has win the game
                winner = this.game.checkVictory(this.player1);
                if (winner) {
                    this.victory(this.player1)
                } else {
                    nextPlayer = this.player2;
                }
            } else {
                isDone = this.game.newTurn(this.player2, col);
                // Check if a player has win the game
                winner = this.game.checkVictory(this.player2);
                if (winner) {
                    this.victory(this.player2)
                } else {
                    nextPlayer = this.player1;
                }
            }

            if (isDone) {
                this.game.turnsToPlay--;
                // Display grid
                this.game.displayGrid();

                // Draw game
                if (this.turnsToPlay == 0) {
                    alert("Match nul !");
                    this.openModalWindowEndGame();
                }

                // Change player color turn
                if (winner === false && this.game.turnsToPlay > 0) {
                    this.newTurn(nextPlayer);
                }
            }

        }

    }

    /**
     * Victory 
     * @param {Player} player 
     */
    victory(player) {
        // Display victory!
        let victoryEl = document.getElementById("id-victory");
        victoryEl.classList.remove("hide");
        victoryEl.classList.add("show");
        victoryEl.textContent = "Victoire!";
        // Victory ! New game?
        this.openModalWindowEndGame(player);
    }

    /**
     * New turn
     * @param {Player} player 
     */
    newTurn(player) {
        let victoryEl = document.getElementById("id-victory");
        victoryEl.classList.add("show");

        // Change player color turn
        let turnEl = document.getElementById("id-turn-player")
        if (this.game.turnsToPlay % 2 == 0) {
            turnEl.classList.remove("token-" + this.player2.color);
            turnEl.classList.add("token-" + this.player1.color);
            victoryEl.textContent = this.player1.name;

        } else {
            turnEl.classList.remove("token-" + this.player1.color);
            turnEl.classList.add("token-" + this.player2.color);
            victoryEl.textContent = this.player2.name;
        }

        // If next player is a bot, don't wait for next turn
        if (player.type === 'BOT') {
            this.onClickPlayTurn(null);
        }

    }

    /**
     * Window victory + ask for a next game?
     * @param {*} player 
     */
    openModalWindowEndGame(player) {
        let victoryEl = document.getElementById("id-txt-victory");
        victoryEl.textContent = "Victoire " + player.name;

        // Get the modal
        let modal = document.getElementById("id-modal-replay");
        modal.style.display = "block";

        // Get the <span> element that closes the modal
        var btnYesEl = document.getElementById("id-btn-yes");
        var btnNoEl = document.getElementById("id-btn-no");

        // When the user clicks on <span> (x), close the modal
        btnYesEl.onclick = function (e) {
            modal.style.display = "none";
            game.openModalWindowStartGame();
        }

        btnNoEl.onclick = function (e) {
            modal.style.display = "none";

            // Page auto-destruction.... :)
            let bodyEl = document.getElementsByTagName("body")[0];
            while(bodyEl.firstChild){
                bodyEl.removeChild(bodyEl.firstChild);
            }
        }
    }

    /**
     * Start window - Select game mode
     */
    openModalWindowStartGame() {
        // Get the modal
        let modal = document.getElementById("myModal");
        modal.style.display = "block";

        // Get the <span> element that closes the modal
        var btnCpuEl = document.getElementById("id-btn-cpu");
        var btnHumanEl = document.getElementById("id-btn-human");

        // When the user clicks on <span> (x), close the modal
        btnCpuEl.onclick = function (e) {
            game.player1 = new Player("Joueur 1", "HUMAN", "red");
            game.player2 = new Player("Skynet", "BOT", "yellow");
            modal.style.display = "none";
            game.newGame();
        }

        btnHumanEl.onclick = function (e) {
            game.player1 = new Player("Joueur 1", "HUMAN", "red");
            game.player2 = new Player("Joueur 2", "HUMAN", "yellow");
            modal.style.display = "none";
            game.newGame();
        }
    }

}