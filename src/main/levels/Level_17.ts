import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_17 extends BaseLevel{
    private ui: ui.level17UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level17UI();
        this.addChild(this.ui);
        this.isInit = true;

        // this.addEvent(this.ui.ya,null,true);
        this.addEvent(this.ui.shi,null,true);
        this.addEvent(this.ui.ping,null,true);
        this.ui.ya.tag = [this.ui.ya.x,this.ui.ya.y];
        this.ui.shi.tag = [this.ui.shi.x,this.ui.shi.y];
        this.ui.ping.tag = [this.ui.ping.x,this.ui.ping.y];

        this.ui.ui.on(Laya.Event.MOUSE_DOWN,this,this.imgDown);
        this.ui.ui.on(Laya.Event.MOUSE_UP,this,this.imgUp);
        
        this.refresh();
    }

    refresh():void
    {
        super.refresh();
        this.ui.ya.height = 331;
    }

    private _downY:number;
    private imgDown():void
    {
        this._downY = Laya.stage.mouseY;
        this.ui.ui.on(Laya.Event.MOUSE_MOVE,this,this.imgMove);
    }

    private imgUp():void
    {
        if(this.ui.ya.height >= 470 && this.ui.ya.height <= 565)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
        this.ui.ui.off(Laya.Event.MOUSE_MOVE,this,this.imgMove);
    }

    private imgMove():void
    {
        if(Laya.stage.mouseY < this._downY)
        {
            this.ui.ya.height+=4;
        }
        else
        {
            this.ui.ya.height-=4;
        }

        if(this.ui.ya.height > 660)
        {
            this.ui.ya.height = 600;
        }

        if(this.ui.ya.height < 311)
        {
            this.ui.ya.height = 311;
        }
    }


    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite: Laya.Image):void
    {
        sprite.stopDrag();
        if(sprite == this.ui.ya)
        {
            if(GM.hit(sprite,this.ui.shui))
            {
                Laya.Tween.to(sprite,{x:-34,y:280},500);
                this.setAnswer(this.ui.rightBox,true);
            }
            else
            {
                this.setAnswer(this.ui.rightBox,false);
                this.gotoStartPos(sprite);
            }
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
            this.gotoStartPos(sprite);
        }
    }

    private gotoStartPos(sprite: Laya.Image):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},500);
    }

}