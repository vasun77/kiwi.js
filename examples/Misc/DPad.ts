/// <reference path="../../src/Kiwi.ts" />

class DPad extends Kiwi.State {

    constructor() {
        super('DPad');
    }

    preload() {
        this.addImage('phone', 'assets/smart_phone.png');
        this.addImage('shiny', 'assets/shinyball.png');
    }

    DPad: DPadGroup;

    create() {
        this.DPad = new DPadGroup(this.textures.phone, this.textures.shiny, 0, 300);
        this.addChild(this.DPad);
        this.DPad.addButtons(this);
    }

}

class DPadGroup extends Kiwi.Group {

    constructor(atlas1,atlas2,x,y) {
        super('DPad Group');
        
        //way hacky but....meah...it works.
        this.upButton = new Button(atlas1, 80 + x, 0 + y, 0);
        this.downButton = new Button(atlas1, 80 + x, 160 + y, 180);
        this.leftButton = new Button(atlas1, 0 + x, 80 + y, -90);
        this.rightButton = new Button(atlas1, 160 + x, 80 + y, 90);

        this.aButton = new Button(atlas1, 300,  80 + y, 0);
        this.bButton = new Button(atlas1, 400,  80 + y, 0);

        this.stick = new Stick(atlas2, 670 - x, 125 + y, 70);
    }

    addButtons(state) {
        //again....hacky :L
        state.addChild(this.upButton);
        state.addChild(this.downButton);
        state.addChild(this.leftButton);
        state.addChild(this.rightButton);

        state.addChild(this.aButton);
        state.addChild(this.bButton);

        state.addChild(this.stick);
    }
    
    aButton: Button;
    bButton: Button;

    upButton: Button;
    downButton: Button;
    leftButton: Button;
    rightButton: Button;
    
    stick: Stick;

}

class Stick extends Kiwi.GameObjects.Sprite {
    
    constructor(atlas, x, y, radius) {
        super(atlas, x, y, true);
        this.radius = radius;
        this.iX = x;
        this.iY = y;
        this.input.onDown.add(this.down, this);
        this.input.onUp.add(this.up, this);
    }

    public iX: number;
    public iY: number;
    public nx: number;
    public ny: number;
    public ox: number;
    public oy: number;
    public pointer: Kiwi.Input.Pointer = null;

    public down(ent, pointer) {
        if (this.pointer == null) {
            this.pointer = pointer;
            this.ox = this.x - this.pointer.x;
            this.oy = this.y - this.pointer.y;
        }
    }

    public up(ent, pointer) {
        if (this.pointer.id = pointer.id) {
            this.pointer = null;

            this.x = this.iX;
            this.y = this.iY;
        }
    }

    public radius: number;

    public update() {
        super.update();
        if (this.pointer !== null) {
            this.nx = (this.pointer.x - this.iX);
            this.ny = (this.pointer.y - this.iY);

            var h = Math.sqrt(Math.abs(Math.pow(this.nx, 2) + Math.pow(this.ny, 2)));

            if (h < this.radius) {
                var x = this.pointer.x + this.ox;
                var y = this.pointer.y + this.oy;
            } else {
                var ang = Math.atan2(this.ny, this.nx);
                var h = this.radius;

                var x = this.iX + (Math.cos(ang) * h) + this.oy;
                var y = this.iY + (Math.sin(ang) * h) + this.ox;
            }

            this.x = x;
            this.y = y;
        }
    }

}

class Button extends Kiwi.GameObjects.Sprite {

    constructor(atlas, x, y, rotateDeg) {
        super(atlas, x, y, true);
        this.scaleX = 0.65;
        this.scaleY = 0.65;
        this.rotation = Kiwi.Utils.GameMath.degreesToRadians(rotateDeg);

        this.input.onDown.add(this.pressed, this);
        this.input.onUp.add(this.released, this);
        if(Kiwi.DEVICE.touch) 
            this.input.onEntered.add(this.pressed, this);
        this.input.onLeft.add(this.released, this);
    }

    public pressed() { 
        this.scaleX = 0.6;
        this.scaleY = 0.6;
    }

    public released() { 
        this.scaleX = 0.65;
        this.scaleY = 0.65;
    }



}