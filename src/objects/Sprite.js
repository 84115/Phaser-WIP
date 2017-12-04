export default class Sprite extends Phaser.Sprite
{

    constructor(game, x=0, y=0, key)
    {
        super(...arguments);
    }

    createHealth(health)
    {
        this.health = health;
        this.maxHealth = this.health;

        return this;
    }

    createPhysics()
    {
        this.game.physics.arcade.enable(this);

        return this;
    }

    addExisting(game)
    {
        game.add.existing(this);

        return this;
    }

    collideKillBoth(a, b)
    {
        a.kill();
        b.kill();
    }

    collideKillA(a, b)
    {
        a.kill();
    }

    collideKillB(a, b)
    {
        b.kill();
    }

}
