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

        game.add.existing(this);
    }

    update()
    {
        if (this.alive)
        {
            if (this.upKey.isDown)
            {
                this.game.physics.arcade.accelerationFromRotation(this.rotation, 300, this.body.acceleration);
            }
            else
            {
                this.body.acceleration.set(0);
            }

            if (this.leftRotateKey.isDown)
            {
                // this.setAnimation('left');
                // this.body.angularVelocity = -300;
                this.body.velocity.x = -125;
                // this.x--;
            }
            else if (this.rightRotateKey.isDown)
            {
                // this.setAnimation('right');
                // this.body.angularVelocity = 300;
                this.body.velocity.x = 125;
                // this.x++;
            }
            if (this.leftKey.isDown)
            {
                this.body.angularVelocity = -300;
            }
            else if (this.rightKey.isDown)
            {
                this.body.angularVelocity = 300;
            }
            else
            {
                this.body.angularVelocity = 0;
            }

            if (this.fireButton.isDown)
            {
                this.weapon.fire();
            }
        }
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

        this.leftRotateKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.rightRotateKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
    }

}
