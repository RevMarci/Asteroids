class GameArea {
    static instance; // Statikus példány tárolása

    constructor() {
        GameArea.instance = this; // Elmentjük az aktuális példányt
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.keys = {}; // Billentyűállapotok tárolása

        // Billentyűleütés figyelése
        window.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });

        // Billentyű felengedése
        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });

        this.player = new Player(30, 10, "red", 100, 100);
        this.updateGameArea(); // Indítja az animációs ciklust
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea() {
        this.clear();
        this.player.update();
        this.player.draw();
        requestAnimationFrame(() => this.updateGameArea());
    }
}

var game; // Itt tároljuk a játék példányát

function startGame() {
    game = new GameArea();
}
