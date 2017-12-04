import Sprite from '../Sprite';

export default class Player extends Sprite
{

    constructor(game, x=0, y=0, key='ship')
    {
        super(game, x, y, key);

        this.createHealth(75)
            .createPhysics()
            .createControls()
            .createFx()
            .createEmitter()
            .createOrbs(5)
            .createWeapon()
            .addExisting(game);
    }

    update()
    {
        if (this.alive)
        {
            this.updateControls()
                .updateWeapon()
                .updateOrbs()
                .updateEmmiter();
        }
    }

    createPhysics()
    {
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.drag.set(70);
        this.body.maxVelocity.set(200);

        this.body.collideWorldBounds = true;

        return this;
    }

    createControls()
    {
        this.controls = {
            upKey: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            leftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            downKey: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            rightKey: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            superKey: this.game.input.keyboard.addKey(Phaser.Keyboard.X)
        };

        return this;
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

        return this;
    }

    createEmitter()
    {
        this.emitter = this.game.add.emitter(this.x, this.y, 50);

        this.emitter.makeParticles('star');

        this.emitter.gravity = 0;
        this.emitter.setAlpha(1, 0, 800);
        this.emitter.setScale(0.8, 0, 0.8, 0, 800);

        this.emitter.start(false, 400, 1);

        return this;
    }

    createOrbs(count=0)
    {
        if (count > 0)
        {
            this.orbs = this.game.add.group();

            for (var i = 0; i < count; i++)
            {
                var orb = this.game.add.sprite(0, 0, 'star');
                var offset = 6.3 / count;

                orb.pivot.x = 32;
                orb.tint = 13393619.447213572;
                orb.rotation = offset * i;

                this.orbs.add(orb);
            }
        }

        return this;
    }

    createWeapon()
    {
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

        return this;
    }

    updateControls()
    {
        if (this.controls.superKey.isDown)
        {
            this.game.physics.arcade.accelerationFromRotation(this.rotation, 900, this.body.acceleration);
            this.weapon.fireRate = 100;
        }
        else if (this.controls.upKey.isDown)
        {
            this.game.physics.arcade.accelerationFromRotation(this.rotation, 300, this.body.acceleration);
        }
        else if (this.controls.downKey.isDown)
        {
            this.game.physics.arcade.accelerationFromRotation(this.rotation, -150, this.body.acceleration);
        }
        else
        {
            this.body.acceleration.set(0);
            this.weapon.fireRate = 200;
        }

        if (this.controls.leftKey.isDown)
        {
            this.body.angularVelocity = -450;
        }
        else if (this.controls.rightKey.isDown)
        {
            this.body.angularVelocity = 450;
        }
        else
        {
            this.body.angularVelocity = 0;
        }

        return this;
    }

    updateWeapon()
    {
        if (this.fireButton.isDown)
        {
            this.weapon.fire();
        }

        return this;
    }

    updateOrbs()
    {
        if (this.orbs)
        {
            if (this.orbs.children)
            {
                for (var i = 0; i < this.orbs.children.length; i++)
                {
                    var orb = this.orbs.children[i];

                    orb.x = this.x;
                    orb.y = this.y;
                    orb.rotation += 0.08
                }
            }
        }

        return this;
    }

    updateEmmiter()
    {
        var px = -Math.abs(this.body.velocity.x);
        var py = -Math.abs(this.body.velocity.y);

        this.emitter.minParticleSpeed.set(px, py);
        this.emitter.maxParticleSpeed.set(px, py);
        this.emitter.emitX = this.body.x;
        this.emitter.emitY = this.body.y;
        this.emitter.x = this.body.x + this.body.halfWidth;
        this.emitter.y = this.body.y + this.body.halfHeight;

        return this;
    }

    collidePopOrb(player, enemy)
    {
        var index = player.orbs.children.length - 1;
        var ref = player.orbs.children[index];

        if (ref) ref.destroy();

        enemy.kill();
    }

}
