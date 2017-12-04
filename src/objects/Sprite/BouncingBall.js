import Sprite from '../Sprite';

export default class BouncingBall extends Sprite
{

    constructor(game, x=0, y=0, key='star')
    {
        super(game, x, y, key);

        this.createHealth(10)
            .createPhysics()
            .createTint()
            .addExisting(game);
    }

    createTint()
    {
        this.tint = 13393619.447213572;

        return this;
    }

    createPhysics()
    {        
        this.game.physics.arcade.enable(this);

        this.body.collideWorldBounds = true;
        this.body.bounce.set(1);
        this.body.velocity.set(this.seedVelocity());

        return this;
    }

    seedVelocity(base_speed=100)
    {
        var speed = base_speed + Phaser.Math.between(0, base_speed / 2);
        var half_chance = Phaser.Utils.chanceRoll(50);

        var direction = half_chance ? -Math.abs(speed) : Math.abs(speed);

        return direction;
    }

}
