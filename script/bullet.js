class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 10;
        this.active = true; // Az objektum aktív állapotban van

        this.update = this.update.bind(this);
        this.animationFrame = requestAnimationFrame(this.update);
    }

    draw() {
        let ctx = GameArea.instance?.context;
        if (!ctx || !this.active) return; // Ha már töröltük, ne rajzoljon

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, 4, 4);
    }
    
    update() {
        if (!this.active) return; // Ha már töröltük, ne fusson tovább

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.outOfBounds()) {
            this.destroy();
            return;
        }

        this.draw();
        this.animationFrame = requestAnimationFrame(this.update);
    }

    outOfBounds() {
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
