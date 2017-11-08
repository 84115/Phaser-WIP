import Dude from 'objects/Dude';

/*
 * Player
 * ====
 *
 * A sample prefab (extended game object class), for displaying the Phaser
 * logo.
 */

export default class Player extends Dude
{

    constructor(game, x=0, y=0, key='ship')
    {
        super(game, x, y, key);

        this.createHealth(75);
        this.createControls();




        this.game.stage.backgroundColor = '#000';



        this.fx = this.game.add.audio('sfx');
        this.fx.allowMultiple = true;
        this.fx.addMarker('alien death', 1, 1.0);
        this.fx.addMarker('boss hit', 3, 0.5);
        this.fx.addMarker('escape', 4, 3.2);
        this.fx.addMarker('meow', 8, 0.5);
        this.fx.addMarker('numkey', 9, 0.1);
        this.fx.addMarker('ping', 10, 1.0);
        this.fx.addMarker('death', 12, 4.2);
        this.fx.addMarker('shot', 17, 1.0);
        this.fx.addMarker('squit', 19, 0.3);










        this.emitter = this.game.add.emitter(this.x, this.y, 250);

        this.emitter.makeParticles('star');

        this.emitter.gravity = 0;
        this.emitter.setAlpha(1, 0, 800);
        this.emitter.setScale(0.8, 0, 0.8, 0, 800);

        this.emitter.start(false, 400, 1);



        this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Creates 30 bullets, using the 'star' graphic
        this.weapon = this.game.add.weapon(100, 'star');

        // The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;

        // The speed at which the bullet is fired
        this.weapon.bulletSpeed = 1000;
        // this.weapon.bulletSpeed = 1;

        // Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 1;
        // this.weapon.fireRate = 200;

        // Tell the Weapon to track the 'player' Sprite
        // With no offsets from the position
        // But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this, 24, 0, true);


        // this.weapon.bulletWorldWrap = true;
        // this.weapon.bulletAngleVariance = 10;



        this.weapon.bulletSpeed = 400;
        this.weapon.fireRate = 200;


        // this.weapon.bulletSpeed = 400;
        // this.weapon.fireRate = 25;
        // this.weapon.bulletAngleVariance = 10;


        game.add.existing(this);
    }

    update()
    {
        if (this.alive)
        {
            if (this.upKey.isDown)
            {
                if (!this.thruster)
                {
                    // this.fx.play('escape', 1, true);
                }

                this.game.physics.arcade.accelerationFromRotation(this.rotation, 300, this.body.acceleration);
            }
            else if (this.revKey.isDown)
            {
                this.game.physics.arcade.accelerationFromRotation(this.rotation, -900, this.body.acceleration);
                this.weapon.fireRate = 100;
            }
            else if (this.downKey.isDown)
            {
                this.game.physics.arcade.accelerationFromRotation(this.rotation, -150, this.body.acceleration);
            }
            else
            {
                this.body.acceleration.set(0);
                this.weapon.fireRate = 200;
            }

            if (this.leftKey.isDown)
            {
                this.body.angularVelocity = -450;
            }
            else if (this.rightKey.isDown)
            {
                this.body.angularVelocity = 450;
            }
            else
            {
                this.body.angularVelocity = 0;
            }

            if (this.fireButton.isDown)
            {
                this.fx.play('squit');
                this.weapon.fire();
            }
        }



        var px = this.body.velocity.x;
        var py = this.body.velocity.y;

        px *= -1;
        py *= -1;

        this.emitter.minParticleSpeed.set(px, py);
        this.emitter.maxParticleSpeed.set(px, py);

        this.emitter.emitX = this.body.x;
        this.emitter.emitY = this.body.y;
        this.emitter.x = this.body.x+10;
        this.emitter.y = this.body.y+14;

        // this.emitter.rotation = this.rotation;
        this.emitter.forEach(function(item) {
            item.rotation = this.rotation;
            // item.pivot.x = this.body.pivot.x;
        }, this);

    }

    createHealth(health)
    {
        this.health = health;
        this.maxHealth = this.health;
    }

    createControls()
    {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        this.revKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    }

}
