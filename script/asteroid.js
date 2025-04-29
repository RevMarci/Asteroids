class Asteroid {
    constructor(devView, lvl, x = 0, y = 0, angle = 0) {
        this.devView = devView;
        this.image = document.getElementById("asteroid1");
        this.lvl = lvl;
        switch (this.lvl) {
            case 1:
                this.health = 2;
                this.size = 20;
                this.point = 3;
                this.speed = Math.random() * 2.5 + 1.6;
                break;
        
            case 2:
                this.health = 4;
                this.size = 40;
                this.point = 4;
                this.speed = Math.random() * 2 + 1.2;
                break;

            case 3:
                this.health = 6;
                this.size = 80;
                this.point = 5;
                this.speed = Math.random() * 1.5 + 0.8;
                break;

            default:
                break;
        }
        this.x = x;
        this.y = y;
        this.angle = angle;
        

        if (this.x == 0 && this.y == 0) {
            let side = Math.floor(Math.random() * 4);

            if (side == 0) {
                // Left
                this.x = 0 - this.size;
                this.y = Math.floor(Math.random() * window.innerHeight);
                this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5); 
            } else if (side == 1) {
                // Right
                this.x = window.innerWidth + this.size;
                this.y = Math.floor(Math.random() * window.innerHeight);
                this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5) + Math.PI;
            } else if (side == 2) {
                // Up
                this.x = Math.floor(Math.random() * window.innerWidth);
                this.y = 0 - this.size;
                this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5) + Math.PI / 2;
            } else {
                // Down
                this.x = Math.floor(Math.random() * window.innerWidth);
                this.y = window.innerHeight + this.size;
                this.angle = Math.random() * 0.7 - 0.35 - (this.y / window.innerHeight - 0.5) - Math.PI / 2;
            }
        }

        //console.log(this);

        this.update = this.update.bind(this);
    }

    draw() {
        let ctx = GameArea.instance?.context;

        ctx.drawImage(this.image, this.x - this.size * 1.05, this.y - this.size * 1.05, this.size * 2.1, this.size * 2.1);

        if (this.devView) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.arc(this.x, this.y, this.size ,0 ,2*Math.PI);
            ctx.stroke();
        }
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.draw();
    }

    isHit(objX, objY, objSize) {
        let distance_x = Math.abs(this.x - objX);
        let distance_y = Math.abs(this.y - objY);
        let distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y) - this.size - objSize;
        return (
            distance < 1
        );
    }

    isOutOfBounds() {
        return (
            this.x + this.size < 0 || this.x - this.size > GameArea.instance.canvas.width ||
            this.y + this.size < 0 || this.y - this.size > GameArea.instance.canvas.height
        );
    }
}