class Player {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.angle = 0;

        this.lastX = x; // Utolsó X pozíció
        this.lastY = y; // Utolsó Y pozíció

        window.addEventListener("mousemove", (e) => this.updateAngle(e));

        this.startShoot();
    }

    updateAngle(event) {
        let rect = GameArea.instance.canvas.getBoundingClientRect(); // Canvas pozíciója
        this.lastX = event.clientX - rect.left;
        this.lastY = event.clientY - rect.top;

        // Szög számítása az egér felé
        this.angle = Math.atan2(this.lastY - (this.y + this.height / 2), this.lastX - (this.x + this.width / 2));
    }

    update() {
        let moving = false; // Mozgás figyelése

        if (GameArea.instance.keys["w"]) {
            this.y -= this.speed;
            moving = true;
        }
        if (GameArea.instance.keys["s"]) {
            this.y += this.speed;
            moving = true;
        }
        if (GameArea.instance.keys["a"]) {
            this.x -= this.speed;
            moving = true;
        }
        if (GameArea.instance.keys["d"]) {
            this.x += this.speed;
            moving = true;
        }

        // Ha nincs egérmozgás, de van mozgás billentyűkkel, frissítjük az irányt
        if (moving) {
            this.angle = Math.atan2(this.lastY - (this.y + this.height / 2), this.lastX - (this.x + this.width / 2));

            /*this.angle = Math.atan2(this.y - this.lastY, this.x - this.lastX);
            this.lastX = this.x;
            this.lastY = this.y;*/
        }
    }

    draw() {
        let ctx = GameArea.instance.context;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    startShoot() {
        setInterval(() => {
            let bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.angle);
        }, 300);
    }
}
