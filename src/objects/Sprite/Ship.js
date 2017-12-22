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
            .createInfo()
            .addExisting(game);
    }

    update()
    {
        var weaponConfig = this.weaponConfig[this.weaponList[0]];

        this.textHealth.setText("health: " + this.health + '/' + this.maxHealth);
        this.textWeaponName.setText("weapon: " + this.weaponList[0]);
        this.textWeaponAmmo.setText("ammo: " + weaponConfig.ammo + "/" + (weaponConfig.ammo * weaponConfig.clipSize));

        if (this.health <= 0) this.kill();

        if (this.alive)
        {
            this.updateControls()
                .updateWeapon()
                .updateOrbs()
                .updateEmmiter();
        }
        else {
            // Called To Often Make Singleton Fn
            this.emitter.on = false;
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
            weaponLeftKey: this.game.input.keyboard.addKey(Phaser.Keyboard.Q)
        };

        this.controls.weaponLeftKey.onDown.add(function(){
            this.switchWeapon(this.shift());
        }, this);

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

    createWeapon(type='default')
    {
        this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Creates 30 bullets, using the 'star' graphic
        this.weapon = this.game.add.weapon(100, 'star');

        // The bullet will be automatically killed when it leaves the world bounds
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;

        // Tell the Weapon to track the 'player' Sprite
        // With no offsets from the position
        // But the 'true' argument tells the weapon to track sprite rotation
        this.weapon.trackSprite(this, 24, 0, true);

        // The speed at which the bullet is fired
        this.weapon.bulletSpeed = 400;

        // Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 200;

        // http://www.html5gamedevs.com/topic/28703-how-to-stop-phaser-weapon-plugin-reloading/
        this.weapon.fireLimit = 0;

        this.weaponList = [
            'default',
            'op',
            'alt',
            'bomb'
        ];

        // Power Up Example (Make this last 30 seconds, button to trigger?)
        // this.weapon.bulletWorldWrap = true;

        this.weaponConfig = this.generateWeaponConfig();

        return this;
    }

    createInfo()
    {
        var fontSize = 12;
        var style = { font: fontSize + "px Arial", fill: "#fff", align: "left" };

        this.textHealth = this.game.add.text(fontSize, fontSize, "health", style);
        this.textWeaponName = this.game.add.text(fontSize, fontSize*2, "weapon", style);
        this.textWeaponAmmo = this.game.add.text(fontSize, fontSize*3, "weapon-data", style);

        return this;
    }

    switchWeapon(type='default')
    {
        if (this.weapon)
        {
            this.weapon.bulletKillType = this.weaponConfig[type].bulletKillType;
            this.weapon.bulletSpeed = this.weaponConfig[type].bulletSpeed;
            this.weapon.bulletLifespan = this.weaponConfig[type].bulletLifespan;
            this.weapon.fireRate = this.weaponConfig[type].fireRate;
            this.weapon.bulletAngleVariance = this.weaponConfig[type].bulletAngleVariance;
            this.weapon.fireLimit = this.weaponConfig[type].fireLimit;
        }
    }

    shift()
    {
        var list = this.weaponList;
        var start = list.shift();

        list.push(start);

        this.weaponList = list;

        return this.weaponList[0];
    }

    updateControls()
    {
        if (this.controls.upKey.isDown)
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
        var index = (player.orbs.children.length == 0 ? 0 : player.orbs.children.length - 1);
        var ref = player.orbs.children[index];

        console.log(index);

        if (index == 0) player.health -= 15;

        if (ref) ref.destroy();

        enemy.kill();
    }

    generateWeaponConfig()
    {
        // clipCount (Adjusted) should equal clipSize when updated
        // LOOK INTO http://phaser.io/docs/2.5.0/Phaser.Weapon.html#fireRate
        return {
            alt: {
                bulletKillType: Phaser.Weapon.KILL_CAMERA_BOUNDS,
                bulletLifespan: 0,
                bulletSpeed: 200,
                fireRate: 200,
                bulletAngleVariance: 15,
                ammo: 200,
                clipSize: 6,
                clipCount: 6 
            },
            bomb: {
                bulletKillType: Phaser.Weapon.KILL_LIFESPAN,
                bulletLifespan: 20000,
                bulletSpeed: 0,
                fireRate: 1000,
                bulletAngleVariance: 0,
                ammo: 10,
                clipSize: 0,
                clipCount: 0 
            },
            op: {
                bulletKillType: Phaser.Weapon.KILL_CAMERA_BOUNDS,
                bulletLifespan: 0,
                bulletSpeed: 600,
                fireRate: 50,
                bulletAngleVariance: 30,
                ammo: 50,
                clipSize: 1,
                clipCount: 1
            },
            default: {
                bulletKillType: Phaser.Weapon.KILL_CAMERA_BOUNDS,
                bulletLifespan: 0,
                bulletSpeed: 400,
                fireRate: 200,
                bulletAngleVariance: 0,
                ammo: 0,
                clipSize: 0,
                clipCount: 0
            }
        };
    }

}
