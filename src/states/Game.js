import SocketState from 'states/Socket';
import Player from 'objects/Sprite/Ship';
import BouncingBall from 'objects/Sprite/BouncingBall';

export default class GameState extends SocketState
{

    create()
    {
        this.createBackdrop()
            .createPlayer()
            .createEnemySequence();
    }

    createBackdrop(max_stars=50)
    {
        this.game.stage.backgroundColor = '#000';

        // this.platforms = this.game.add.group();

        // for (var i = 0; i < max_stars; i++)
        // {
        //     this.platforms.create(this.game.world.randomX, this.game.world.randomY, 'star');
        // }

        return this;
    }

    createPlayer()
    {
        this.player = new Player(this.game, 200, 200);
        this.player.anchor.setTo(0.5);

        return this;
    }

    createEnemySequence()
    {
        this.balls = this.game.add.group();

        for (var i = 0; i < 10; i++)
        {
            this.balls.add( new BouncingBall(this.game, this.game.world.randomX, this.game.world.randomY) );
        }

        return this;
    }

    update()
    {
        var physics = this.game.physics.arcade;

        physics.collide(this.player, this.balls, this.player.collidePopOrb, null, this);
        physics.overlap(this.player.weapon.bullets, this.balls, this.player.collideKillBoth, null, this);
        physics.collide(this.balls);
    }

}
