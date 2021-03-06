/**
* This script is a demonstration of a few more basic HUD Widgets
**/
var Platformer = new Kiwi.State(this, 'Platformer');

Platformer.init = function() {
    this.onGround = false;
    this.alive = true;
}

Platformer.preload = function () {
    this.addSpriteSheet('desertBackdrop', 'assets/spritesheets/desert.png', 768, 512);
    this.addSpriteSheet('vc', 'assets/war/characters/vietcong-sheet-ak47.png', 150, 117);
    this.addSpriteSheet('nam', 'assets/war/characters/nam-vet.png', 150, 117);
    this.addImage('bullet', 'assets/static/bullet-normal.png');
    this.addSpriteSheet('desertImage', 'assets/war/tiles/tile-spritesheet.png', 48, 48);
    this.addJSON('desertJson', 'assets/war/json/desert-flat.json');
}

Platformer.create = function () {
    this.game.stage.resize(768, 512);

    var background = new Kiwi.GameObjects.StaticImage(this, this.textures.desertBackdrop, 0, 0);
    this.addChild(background);
    background.cellIndex = 1;

    this.desert = new Kiwi.GameObjects.Tilemap.TileMap(this);
    this.desert.createFromFileStore('desertJson', this.textures.desertImage, Kiwi.GameObjects.Tilemap.TileMap.FORMAT_TILED_JSON);
    this.addChild(this.desert);
    this.desert.setCollisionByIndex(-1, Kiwi.Components.ArcadePhysics.NONE, false);
    this.desert.setCollisionRange(0, 35, Kiwi.Components.ArcadePhysics.ANY, true);

    this.vc = new SpecialSprite(this, this.textures.vc, 50, 300);
    this.addChild(this.vc);

    this.marine = new SpecialSprite(this, this.textures.nam, 600, 300);
    this.marine.animation.add('die', [11, 12, 13, 14, 15], 0.05, false, false);
    this.marine.animation.add('flash', [11, 0], 0.1, false, false);
    this.marine.animation.add('up', [9], 0.1, false, false);
    this.marine.animation.add('down', [10], 0.1, false, false);
    this.marine.animation.add('idle', [0], 0.1, false, false);

    this.marine.box.hitbox = new Kiwi.Geom.Rectangle(40,27,50,90);

    console.log(this.marine.box.rawHitbox);

    this.marine.scaleX = -1;
    this.addChild(this.marine);

    this.bullets = [];

    if (this.game.deviceTargetOption == Kiwi.TARGET_BROWSER) {
        this.bar = new Kiwi.HUD.Widget.Bar(this.game, 4, 4, 10, 10, 100, 20);
        this.game.huds.defaultHUD.addWidget(this.bar);
        this.bar.bar.style.backgroundColor = '#900';
        this.bar.style.backgroundColor = 'white';
        this.bar.style.border = '2px solid #900';
    }

    this.game.input.onUp.add(this.jump, this);

    this.game.time.clock.units = 2000;
    this.timer = this.game.time.clock.createTimer('shoot', 2, -1, false);
    this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.shoot, this);
    this.timer.start();


    //Text
    var text = new Kiwi.GameObjects.Textfield(this, 'Click to jump. Try to avoid the bullets!', this.game.stage.width / 2, 10, '#000', 12);
    text.textAlign = 'center';
    this.addChild(text);
}

Platformer.update = function () {
    Kiwi.State.prototype.update.call(this);

    var col = this.desert.collideSingle(this.marine);

    if (this.alive) {
        if (col) {
            this.onGround = true;
            this.marine.animation.play('idle');
        } else {
            this.onGround = false;
            if (this.marine.physics.velocity.y < 0) {
                this.marine.animation.play('up');
            } else {
                this.marine.animation.play('down');
            }
        }
    }

    this.desert.collideSingle(this.vc);

    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].x > this.game.stage.width) {
            this.removeChild(this.bullets[i], true);
            this.bullets.splice(i, 1);
            i--;
            continue;
        }

        if (this.alive) {
            if (this.bullets[i].physics.overlaps(this.marine, false)) {
                this.removeChild(this.bullets[i], true);
                this.bullets.splice(i, 1);
                i--;

                if (this.game.deviceTargetOption == Kiwi.TARGET_BROWSER) {
                    this.bar.counter.current--;

                    if (this.bar.counter.current == 0) {
                        this.alive = false;
                        this.marine.animation.play('die');
                    } else {
                        this.marine.animation.play('flash');
                    }
                }
            }
        }
    }
}

Platformer.shoot = function () {
    this.bullets.push(new SpecialStatic(this, this.textures.bullet, this.vc.x + this.vc.width - 20, this.vc.y + this.vc.height / 2 + 10));
    this.bullets[this.bullets.length - 1].physics.velocity.x = 50;
    this.addChild(this.bullets[this.bullets.length - 1]);
}

Platformer.jump = function () {
    if (this.onGround === true) {
        this.marine.physics.velocity.y = -30;
        this.onGround = false;
    }
}


var SpecialStatic = function(state, texture, x, y) {
    Kiwi.GameObjects.StaticImage.call(this, state, texture, x, y);
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.moves = true;
}

Kiwi.extend(SpecialStatic, Kiwi.GameObjects.StaticImage);

SpecialStatic.prototype.update = function () {
    Kiwi.GameObjects.StaticImage.prototype.update.call(this);
    this.physics.update();
}
 
var SpecialSprite = function(state, texture, x, y) {
    Kiwi.GameObjects.Sprite.call(this, state, texture, x, y);
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.moves = true;
    this.physics.acceleration.y = 6;
}

Kiwi.extend(SpecialSprite, Kiwi.GameObjects.Sprite);

SpecialSprite.prototype.update = function () {
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.physics.update();
}



//Create's a new Kiwi.Game.
/*
* Param One - DOMID - String - ID of a DOMElement that the game will reside in.
* Param Two - GameName - String - Name that the game will be given.
* Param Three - State - Object - The state that is to be loaded by default.
* Param Four - Options - Object - Optional options that the game will use whilst playing. Currently this is used to to choose the renderer/debugmode/device to target
*/
if(typeof  gameOptions == "undefined")  gameOptions = {};

var game = new Kiwi.Game('game', 'KiwiExample', Platformer,  gameOptions);