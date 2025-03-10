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
        this.points = 0;

        this.asteroids = [];
        this.startAsteroid();

        this.bullets = [];
        this.startBullet();

        this.updateGameArea(); // Indítja az animációs ciklust
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea() {
        this.clear();
        this.player.update();
        this.player.draw();
        this.drawPoints();

        this.asteroids = this.asteroids.filter(asteroid => {
            asteroid.update();

            this.bullets = this.bullets.filter(bullet => {
                if (asteroid.isHit(bullet.x, bullet.y)) {
                    asteroid.health--;
                    return false;
                }
                return true;
            });

            if (asteroid.health == 0) {
                this.points += 2;
                return false;
            }

            if (asteroid.isHit(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2)) {
                this.endGame();
            }

            return !asteroid.isOutOfBounds(); // Csak a bent maradtakat tartja meg
        });

        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return !bullet.isOutOfBounds();
        });

        requestAnimationFrame(() => this.updateGameArea());
    }

    startAsteroid() {
        setInterval(() => {
            this.spawnAsteroid();
        }, 500); // uj aszteroida
    }

    spawnAsteroid() {
        let asteroid = new Asteroid(40, 3); // Adj neki egy méretet
        this.asteroids.push(asteroid);
    }

    startBullet() {
        setInterval(() => {
            this.spawnBullet();
        }, 300);
    }

    spawnBullet() {
        let bullet = new Bullet(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, this.player.angle);
        this.bullets.push(bullet);
    }

    drawPoints() {
        this.context.font = "50px arial";
        this.context.fillText(this.points, 100, 60)
    }

    endGame() {
        cancelAnimationFrame();
    }
}

var game; // Itt tároljuk a játék példányát

function startGame() {
    game = new GameArea();
}
