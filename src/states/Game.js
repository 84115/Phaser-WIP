import SocketState from 'states/Socket';
import Player from 'objects/Player';
import Dude from 'objects/Dude';

export default class GameState extends SocketState
{

    preload()
    {
        this.game.load.audio('sfx', [
            'fx_mixdown.mp3',
            'fx_mixdown.ogg'
        ]);
    }

    create()
    {
        this.game.physics.arcade.gravity.y = 0;



        this.platforms = this.game.add.group();

        for (var i = 0; i < 40; i++)
        {
            this.platforms.create(this.game.world.randomX, this.game.world.randomY, 'star');
        }


        this.orb = this.game.add.sprite(0, 0, 'star');
        this.orb.pivot.x = 32;
        this.orb2 = this.game.add.sprite(0, 0, 'star');
        this.orb2.pivot.x = 32;
        this.orb3 = this.game.add.sprite(0, 0, 'star');
        this.orb3.pivot.x = 32;

        this.orb.rotation = ((6.3/3)*1);
        this.orb2.rotation = ((6.3/3)*2);
        this.orb3.rotation = ((6.3/3)*3);

        var tint = 13393619.447213572;
        this.orb.tint = tint;
        this.orb2.tint = tint;
        this.orb3.tint = tint;






        this.ball = this.game.add.sprite(200, 200, 'star');
        this.game.physics.arcade.enable(this.ball);
        this.ball.tint = tint;
        this.ball.body.setCircle(8);
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);
        this.ball.body.velocity.set(200);





        this.createPlayer();
        this.player.anchor.setTo(0.5);
        this.createPlayers();
        // this.createSockets();
        this.createFx();

    }

    createPlayer()
    {
        this.player = new Player(this.game, 200, 200);
    }

    createPlayers()
    {
        this.players = this.game.add.group();
    }

    createSockets()
    {
        this.socketConnect();
        this.socketOn('joinPlayer', this.socketJoinPlayer);
        this.socketOn('addPlayer', this.socketAddPlayer);
        this.socketOn('removePlayer', this.socketRemovePlayer);
        this.socketOn('poll', this.socketUpdatePlayerPositions);
        this.socketOn('disconnect', this.socketRemovePlayers);
    }

    createFx()
    {
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

        //  Make some buttons to trigger the sounds
        this.makeButton('alien death', 100, 0);
        this.makeButton('boss hit', 100, 30);
        this.makeButton('escape', 100, 60);
        this.makeButton('meow', 100, 90);
        this.makeButton('numkey', 100, 120);
        this.makeButton('ping', 100, 150);
        this.makeButton('death', 100, 180);
        this.makeButton('shot', 100, 210);
        this.makeButton('squit', 100, 240);
    }

    preRender()
    {
        this.orb.x = this.player.x;
        this.orb.y = this.player.y;
        this.orb2.x = this.player.x;
        this.orb2.y = this.player.y;
        this.orb3.x = this.player.x;
        this.orb3.y = this.player.y;
    }

    render()
    {
        this.game.debug.body(this.ball);
    }

    update()
    {
        // if (this.player.uuid)
        // {
        //     this.socketEmit('poll', this.player.schema());
        // }

        this.orb.rotation += 0.08;
        this.orb2.rotation += 0.08;
        this.orb3.rotation += 0.08;

        this.game.physics.arcade.collide(this.player, this.players);
    }

    addPlayer(data)
    {
        var player = new Dude(this.game, data.x, data.y);

        player.tint = data.tint;
        player.uuid = data.uuid;

        this.players.add(player);

        return player;
    }

    findPlayerByUuid(uuid)
    {
        return this.players.iterate('uuid', uuid, Phaser.Group.RETURN_CHILD);
    }

    forEachExistingPlayer(player_update, callback)
    {
        for (var existing in player_update)
        {
            if (player_update.hasOwnProperty(existing) && this.player.uuid != existing)
            {
                callback(player_update[existing]);
            }
        }
    }

    socketJoinPlayer(data)
    {
        this.player.uuid = data.uuid;

        this.forEachExistingPlayer(data.players, player => this.addPlayer(player));

        this.socketEmit('addPlayer', this.player.schema());

        return this;
    }

    socketAddPlayer(data)
    {
        if (data.uuid != this.player.uuid)
        {
            this.addPlayer(data);
        }

        return this;
    }

    socketRemovePlayer(uuid)
    {
        var ditcher = this.findPlayerByUuid(uuid);

        this.players.remove(ditcher);

        return this;
    }

    socketUpdatePlayerPositions(data)
    {
        var self = this;

        this.forEachExistingPlayer(data, function(player)
        {
            var other_players = self.findPlayerByUuid(player.uuid);

            if (other_players.updateSchema)
            {
                other_players.updateSchema(player);
            }
        });

        return this;
    }

    socketRemovePlayers()
    {
        this.players.forEach(player => player.kill());

        return this;
    }

    makeButton(name, x, y)
    {
        var button = this.game.add.button(x, y, 'star', (button => this.fx.play(button.name)), this, 0, 1, 2);
        button.name = name;
    }

}
