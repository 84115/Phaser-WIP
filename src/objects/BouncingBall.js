export default class BouncingBall extends Phaser.Sprite
{

    constructor(game, x=0, y=0, key='star')
    {
        super(game, x, y, key);

        this.game.physics.arcade.enable(this);

        this.tint = 13393619.447213572;
        this.body.setCircle(8);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1);
        this.body.velocity.set(200);

        game.add.existing(this);
    }

    render()
    {
        this.game.debug.body(this);
    }

}
