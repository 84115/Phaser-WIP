export default class Dude extends Phaser.Sprite
{

    constructor(game, x=0, y=0, key='ship')
    {
        super(...arguments);

        this.createPhysics();
    }

    createPhysics()
    {
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.drag.set(70);
        this.body.maxVelocity.set(200);

        this.body.collideWorldBounds = true;
    }

    addExisting(game)
    {
        game.add.existing(this);

        return this;
    }

}
