import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GameConfig from "../../GameConfig";

export default class Level_10 extends BaseLevel{
    private ui: ui.level10UI;
    private _startX:number;
    private _startY:number;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level10UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.sunImg,null,true);
        this._startX = this.ui.sunImg.x;
        this._startY = this.ui.sunImg.y;

        this.refresh();
    }

    refresh():void
    {
        super.refresh();
        this.ui.blankBox.visible = false;
        this.ui.birdImg0.visible = true;
        this.ui.birdImg1.visible = false;
        this.ui.sunImg.pos(this._startX,this._startY);
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    onUp(sprite:Laya.Sprite):void
    {
        super.onUp(sprite);
        if(this.ui.sunImg.x <= -60 || this.ui.sunImg.x >= GameConfig.width + 75)
        {
            this.setAnswer(this.ui.rightBox,true);
            this.ui.blankBox.visible = true;
            this.ui.birdImg0.visible = false;
            this.ui.birdImg1.visible = true;
        }
    }

}