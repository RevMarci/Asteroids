class Asteroid {
    constructor(size, health) {
        this.health = health;
        this.size = size;
        this.angle = 0;
        this.speed = Math.floor(Math.random() * 5) + 1;

        this.side = Math.floor(Math.random() * 4);

        if (this.side == 0) {
            // Left
            this.x = 0;
            this.y = Math.floor(Math.random() * window.innerHeight);
            this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5); 
        } else if (this.side == 1) {
            // Right
            this.x = window.innerWidth;
            this.y = Math.floor(Math.random() * window.innerHeight);
            this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5) + Math.PI;
        } else if (this.side == 2) {
            // Up
            this.x = Math.floor(Math.random() * window.innerWidth);
            this.y = 0;
            this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5) + Math.PI / 2;
        } else {
            // Down
            this.x = Math.floor(Math.random() * window.innerWidth);
            this.y = window.innerHeight;
            this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5) - Math.PI / 2;
        }

        console.log(this);

        this.update = this.update.bind(this);
    }

    draw() {
        let ctx = GameArea.instance?.context;

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.draw();
    }

    isHit(objX, objY) {
        return (
            this.x < objX && this.x + this.size > objX &&
            this.y < objY && this.y + this.size > objY
        );
    }

    isOutOfBounds() {
        return (
            this.x < 0 || this.x > GameArea.instance.canvas.width ||
            this.y < 0 || this.y > GameArea.instance.canvas.height
        );
    }
}