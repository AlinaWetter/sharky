class Character extends MovableObject {
    IMAGES_FLOATING = [];
    IMAGES_SWIMMING = [];
    IMAGES_HURT_POISON = [];
    IMAGES_HURT_ELECTRIC = [];
    IMAGES_DEAD_POISON = [];
    IMAGES_DEAD_ELECTRIC = [];
    IMAGES_ATTACK_BUBBLE_NORMAL = [];
    lastAttack;
    attack = false;
    stopLeft = false;
    stopRight = false;
    stopUp = false;
    stopDown = false;
    diving_sound = new Audio('audio/diving.mp3');
    mirror = false;
    poisoned = false;
    electrified = false;
    deadPoison = false;
    deadElectric = false;
    bubbleAttack = false;
    moving;


    offset = {
        x: 60,
        y: 120,
        width: -120,
        height: -180,
    }


    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.pushImages();
        this.width = 250;
        this.height = 250;
        this.y = 110;
        this.x = 120;
        this.speed = 5;
        this.load();
        this.animate();
        this.isMoving();
    }

    load() {
        this.loadImages(this.IMAGES_SWIMMING);
        this.loadImages(this.IMAGES_FLOATING);
        this.loadImages(this.IMAGES_HURT_POISON);
        this.loadImages(this.IMAGES_HURT_ELECTRIC);
        this.loadImages(this.IMAGES_DEAD_POISON);
        this.loadImages(this.IMAGES_DEAD_ELECTRIC);
        this.loadImages(this.IMAGES_ATTACK_BUBBLE_NORMAL);
    }

    pushImages() {
        for (let x = 1; x < 19; x++) {
            this.IMAGES_FLOATING.push(`img/1.Sharkie/1.IDLE/${x}.png`)
        };
        for (let x = 1; x < 7; x++) {
            this.IMAGES_SWIMMING.push(`img/1.Sharkie/3.Swim/${x}.png`)
        }
        for (let x = 1; x < 4; x++) {
            this.IMAGES_HURT_ELECTRIC.push(`img/1.Sharkie/5.Hurt/2.Electric shock/${x}.png`)
        }
        for (let x = 1; x < 5; x++) {
            this.IMAGES_HURT_POISON.push(`img/1.Sharkie/5.Hurt/1.Poisoned/${x}.png`)
        }
        for (let x = 1; x < 13; x++) {
            this.IMAGES_DEAD_POISON.push(`img/1.Sharkie/6.dead/1.Poisoned/${x}.png`)
        }
        for (let x = 1; x < 11; x++) {
            this.IMAGES_DEAD_ELECTRIC.push(`img/1.Sharkie/6.dead/2.Electro_shock/${x}.png`)
        }
        for (let x = 1; x < 9; x++) {
            this.IMAGES_ATTACK_BUBBLE_NORMAL.push(`img/1.Sharkie/4.Attack/Bubble trap/op1 (with bubble formation)/${x}.png`)
        }
    }

    isMoving() {
        setInterval(() => {
            if (keyboard.RIGHT || keyboard.LEFT || keyboard.UP || keyboard.DOWN) {
                this.moving = true;
            } else {
                this.moving = false;
            }
        }, 50);

    }

    animate() {
        this.animateImages();
        this.animateMoves();
    }

    setInstancesFalse() {
        this.poisoned = false;
        this.electrified = false;
        this.deadPoison = false;
        this.deadElectric = false;
    }

    animateImages() {

        setInterval(() => {

            switch (true) {

                case this.deadElectric:
                    this.playAnimation(this.IMAGES_DEAD_ELECTRIC);
                    this.diving_sound.pause();
                    break;

                case this.deadPoison:
                    this.playAnimation(this.IMAGES_DEAD_POISON);
                    this.diving_sound.pause();

                    break;

                case this.electrified:
                    this.playAnimation(this.IMAGES_HURT_ELECTRIC);
                    this.diving_sound.pause();

                    break;

                case this.poisoned:
                    this.playAnimation(this.IMAGES_HURT_POISON);
                    this.diving_sound.pause();

                    break;

                case this.bubbleAttack:
                    this.playAnimation(this.IMAGES_ATTACK_BUBBLE_NORMAL);
                    if (this.IMAGES_ATTACK_BUBBLE_NORMAL.length == this.currentImage) {
                        this.bubbleAttack = false;
                    }
                    break;

                case this.move():
                    this.playAnimation(this.IMAGES_SWIMMING);
                    this.diving_sound.play();
                    break;

                default:
                    this.diving_sound.pause();
                    this.playAnimation(this.IMAGES_FLOATING);

            }

        }, 130);

    }

    hurt(damage) {
        this[`${damage}`] = true;
    }

    animateMoves() {
        setInterval(() => {
            this.swim();
        }, 1000 / 60);
    }

    swim() {
        this.moveRight();
        this.moveLeft();
        this.moveUp();
        this.moveDown();
    }

    move() {
        if (!this.isHurt() && !this.bubbleAttack && this.keyPressed()) {
            return true
        }
    }

    keyPressed() {
        if (keyboard.RIGHT || keyboard.LEFT || keyboard.UP || keyboard.DOWN) {
            return true
        }

    }

    moveRight() {

        if (!this.stopRight) {
            if (this.world.keyboard.RIGHT && this.x > - this.overlap && this.x < this.x_side_gap) {
                this.x += this.speed;
                this.world.camera_x = 0;
                this.mirror = false;
            };

            if (this.world.keyboard.RIGHT && this.x >= this.x_side_gap && this.x <= this.world.level.level_end_x - 720 + this.x_side_gap) {
                this.x += this.speed;
                this.world.camera_x = -this.x + this.x_side_gap;
                this.mirror = false;
            };

            if (this.world.keyboard.RIGHT && this.x > this.world.level.level_end_x - 720 + this.x_side_gap && this.x < this.world.level.level_end_x - this.width) {
                this.x += this.speed;
                this.world.camera_x = -this.world.level.level_end_x + 720;
                this.mirror = false;
            };
        }

    }

    moveLeft() {

        if (!this.stopLeft) {
            console.log()
            if (this.world.keyboard.LEFT && this.x > 0 && this.x <= this.x_side_gap) {
                this.x -= this.speed;
                this.world.camera_x = 0;
                this.mirror = true;
            };

            if (this.world.keyboard.LEFT && this.x >= this.x_side_gap && this.x <= this.world.level.level_end_x - this.x_side_gap) {
                this.x -= this.speed;
                this.world.camera_x = -this.x + this.x_side_gap;
                this.mirror = true;
            };

            if (this.world.keyboard.LEFT && this.x > this.world.level.level_end_x - 720 + this.x_side_gap && this.x < this.world.level.level_end_x - this.width) {
                this.x -= this.speed;
                this.world.camera_x = -this.world.level.level_end_x + 720;
                this.mirror = true;
            };
        }

    }

    moveUp() {

        if (!this.stopUp) {
            if (this.world.keyboard.UP && this.y > this.world.level.level_end_y - this.overlap - 60 && this.y < this.world.level.level_end_y + this.y_side_gap) {
                this.y -= this.speed;
                this.world.camera_y = -this.world.level.level_end_y;
            };

            if (this.world.keyboard.UP && this.y >= this.world.level.level_end_y + this.y_side_gap && this.y <= this.y_side_gap) {
                this.y -= this.speed;
                this.world.camera_y = -this.y + this.y_side_gap;
            };

            if (this.world.keyboard.UP && this.y < this.world.level.level_start_y + this.overlap + 20 && this.y > this.y_side_gap) {
                this.y -= this.speed;
                this.world.camera_y = 0;
            };
        }
    }

    moveDown() {

        if (!this.stopDown) {
            if (this.world.keyboard.DOWN && this.y > this.world.level.level_end_y - this.overlap - 70 && this.y < this.world.level.level_end_y + this.y_side_gap) {
                this.y += this.speed;
                this.world.camera_y = 320;
            };

            if (this.world.keyboard.DOWN && this.y >= this.world.level.level_end_y + this.y_side_gap && this.y <= this.y_side_gap) {
                this.y += this.speed;
                this.world.camera_y = -this.y + this.y_side_gap;
            };

            if (this.world.keyboard.DOWN && this.y < this.world.level.level_start_y + this.overlap + 10 && this.y > this.y_side_gap) {
                this.y += this.speed;
                this.world.camera_y = 0;
            };
        }
    }

    isAttacking() {
        this.bubbleAttack = true;
        this.currentImage = 0;
    }
}