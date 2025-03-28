class GameArea {
    static instance;

    constructor() {
        GameArea.instance = this;
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.backgroundImage = document.getElementById("gackground");

        this.keys = {};
        this.handleKeyDown = (e) => { this.keys[e.key] = true; };
        this.handleKeyUp = (e) => { this.keys[e.key] = false; };

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

        this.player = new Player(window.innerWidth / 2, window.innerHeight / 2);
        this.points = 0;
        this.spawnRate = 1500;

        this.asteroids = [];
        this.bullets = [];
        
        this.asteroidInterval = setInterval(() => this.spawnAsteroid(), this.spawnRate);
        this.bulletInterval = setInterval(() => this.spawnBullet(), 300);

        this.animationFrameId = null;
        this.updateGameArea();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateGameArea() {
        this.clear();
        this.drawBackground();
        this.player.update();
        this.player.draw();
        this.drawPoints();

        let newAsteroids = [];
        this.asteroids = this.asteroids.filter(asteroid => {
            asteroid.update();

            this.bullets = this.bullets.filter(bullet => {
                if (asteroid.isHit(bullet.x, bullet.y, bullet.size)) {
                    asteroid.health--;
                    return false;
                }
                return true;
            });

            if (asteroid.health == 0) {
                this.points += asteroid.point;
                this.spawnRate = Math.max(200, this.spawnRate - asteroid.lvl * 5);
                //this.spawnRate = 400 + 1100 * Math.exp(-0.01826 * this.points);
                console.log("SpawnRate: " + this.spawnRate);
                clearInterval(this.asteroidInterval);
                this.asteroidInterval = setInterval(() => this.spawnAsteroid(), this.spawnRate);

                if (asteroid.lvl != 1) {
                    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
                        newAsteroids.push(new Asteroid(asteroid.lvl - 1, asteroid.x, asteroid.y, asteroid.angle + Math.random() - 0.7));
                    }
                }
                return false;
            }

            if (asteroid.isHit(this.player.x, this.player.y, this.player.size)) {
                this.endGame();
            }

            return !asteroid.isOutOfBounds();
        });
        this.asteroids = [...this.asteroids, ...newAsteroids];

        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return !bullet.isOutOfBounds();
        });

        this.animationFrameId = requestAnimationFrame(() => this.updateGameArea());
    }

    spawnAsteroid() {
        let asteroid = new Asteroid(Math.floor(Math.random() * 2) + 2);
        this.asteroids.push(asteroid);
    }

    spawnBullet() {
        let bullet = new Bullet(this.player.x, this.player.y, this.player.angle);
        this.bullets.push(bullet);
    }

    drawPoints() {
        this.context.font = "50px arial";
        this.context.fillText(this.points, 100, 60);
    }

    drawBackground() {
        this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    endGame() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        clearInterval(this.asteroidInterval);
        clearInterval(this.bulletInterval);

        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);

        if (document.body.contains(this.canvas)) {
            document.body.removeChild(this.canvas);
        }
    }
}

var game;

function startGame() {
    game = new GameArea();
}
