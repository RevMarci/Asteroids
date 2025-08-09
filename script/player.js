class Player {
    constructor(x, y, devView) {
        this.image = document.getElementById("ship");
        this.size = 30;
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.angle = 0;

        this.lastX = x; // Utolsó X pozíció
        this.lastY = y; // Utolsó Y pozíció

        window.addEventListener("mousemove", (e) => this.updateAngle(e));

        this.devView = devView;
    }

    updateAngle(event) {
        let rect = GameArea.instance.canvas.getBoundingClientRect(); // Canvas pozíciója
        this.lastX = event.clientX - rect.left;
        this.lastY = event.clientY - rect.top;

        // Szög számítása az egér felé
        this.angle = Math.atan2(this.lastY - this.y, this.lastX - this.x);
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
            this.angle = Math.atan2(this.lastY - this.y, this.lastX - this.x);
        }
    }

    draw() {
        let ctx = GameArea.instance.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Kör rajzolása
        //ctx.drawImage(this.image, this.x - this.size, this.y- this.size, this.size * 2, this.size * 2);
        ctx.drawImage(this.image, 0-this.size, 0-this.size, this.size * 3, this.size * 2);

        if (this.devView) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}
