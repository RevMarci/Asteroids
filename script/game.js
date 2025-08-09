class GameArea {
    static instance;

    constructor(devView) {
        this.devView = devView;

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

        this.player = new Player(window.innerWidth / 2, window.innerHeight / 2, this.devView);
        this.points = 0;
        this.spawnRate = 1500;

        this.asteroids = [];
        this.bullets = [];
        
        this.asteroidInterval = setInterval(() => this.spawnAsteroid(), this.spawnRate);
        this.bulletInterval = setInterval(() => this.spawnBullet(), 300);

        const explosion = document.getElementById('explosion');
        const punch = document.getElementById('explosion');
        const lazer = document.getElementById('explosion');

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
                    punch.currentTime = 0;
                    punch.play();
                    asteroid.health--;
                    return false;
                }
                return true;
            });

            if (asteroid.health == 0) {
                explosion.currentTime = 0;
                explosion.play();

                this.points += asteroid.point;
                this.spawnRate = Math.max(200, this.spawnRate - asteroid.lvl * 5);
                //this.spawnRate = 400 + 1100 * Math.exp(-0.01826 * this.points);
                console.log("SpawnRate: " + this.spawnRate);
                clearInterval(this.asteroidInterval);
                this.asteroidInterval = setInterval(() => this.spawnAsteroid(), this.spawnRate);

                if (asteroid.lvl != 1) {
                    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
                        newAsteroids.push(new Asteroid(this.devView, asteroid.lvl - 1, asteroid.x, asteroid.y, asteroid.angle + Math.random() - 0.7));
                    }
                }
                return false;
            }

            if (asteroid.isHit(this.player.x, this.player.y, this.player.size)) {
                if (gameRuning) {
                    gameRuning = false;
                    this.endGame();
                }
                return;
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
        let asteroid = new Asteroid(this.devView, Math.floor(Math.random() * 2) + 2);
        this.asteroids.push(asteroid);
    }

    spawnBullet() {
        lazer.volume = 0.2;
        lazer.currentTime = 0;
        lazer.play();
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
        alert("You died!\n" + username + "'s points: " + this.points);
        leaderboard.push(new User(username, this.points));
        console.log(leaderboard);

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

        leaderboard.sort(function(a, b){return b.point - a.point});
        let output = "";
        for (const user of leaderboard) {
            output += '<p>' + user.name + ' - ' + user.point + '</p>';
        }
        document.getElementById("leaders").innerHTML = output;

        main.classList.toggle("hidden");
    }
}

class User {
    constructor (name, point) {
        this.name = name;
        this.point = point;
    }
}

var gameRuning = false;
var main = document.getElementById("main");
var game;
var username;
var leaderboard = [];

function startGame() {
    devView = document.getElementById("devView").checked;
    console.log("Dev view status: " + devView);

    username = prompt("Identify yourself, soldier. Type in your callsign!", "NovaHawk");
    if (username == null || username.length <= 0) {
        alert("That's not a valid callsign, soldier! Try again!");
        return;
    }

    gameRuning = true;
    main.classList.toggle("hidden");
    game = new GameArea(devView);
}

function howToPlay() {
    alert("Listen up, pilot!\nUse W, A, S, and D to steer that ship.\nAsteroids are everywhere — hit one, and you're done.\nYour weapons auto-fire toward your cursor, so keep it sharp.\nBlast those rocks to earn points.\nThe more you score, the higher your rank on the leaderboard.\nBut be warned: the more you climb, the more hell comes flying at you.\n\nNow move out — and don't die!");
}
