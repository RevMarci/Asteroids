class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.angle = angle;
        this.speed = 10;
        this.active = true; // Az objektum aktív állapotban van

        this.update = this.update.bind(this);
    }

    draw() {
        let ctx = GameArea.instance?.context;

        ctx.fillStyle = "#01F1F7";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.draw();
    }

    isOutOfBounds() {
        return (
            this.x < 0 || this.x > GameArea.instance.canvas.width ||
            this.y < 0 || this.y > GameArea.instance.canvas.height
        );
    }

    destroy() {
        this.active = false; // Deaktiváljuk az objektumot
        cancelAnimationFrame(this.animationFrame); // Leállítjuk az update ciklust
    }
}
