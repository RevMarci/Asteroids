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

        this.player = new Player(30, 10, "red", window.innerWidth/2, window.innerHeight/2);

        this.asteroids = [];
        this.startAsteroid();

        this.updateGameArea(); // Indítja az animációs ciklust
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea() {
        this.clear();
        this.player.update();
        this.player.draw();

        this.asteroids = this.asteroids.filter(asteroid => {
            asteroid.update();
            return !asteroid.isOutOfBounds(); // Csak a bent maradtakat tartja meg
        });

        requestAnimationFrame(() => this.updateGameArea());
    }

    startAsteroid() {
        setInterval(() => {
            this.spawnAsteroid();
        }, 2000); // 2 másodpercenként új aszteroida
    }

    spawnAsteroid() {
        let asteroid = new Asteroid(40); // Adj neki egy méretet
        this.asteroids.push(asteroid);
    }
}

var game; // Itt tároljuk a játék példányát

function startGame() {
    game = new GameArea();
}
