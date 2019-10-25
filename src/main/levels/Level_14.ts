import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_14 extends BaseLevel{
    private ui: ui.level14UI;
    private posList:number[][] = [];
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level14UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.item0,null,true);
        this.addEvent(this.ui.item1,null,true);
        this.addEvent(this.ui.item2,null,true);
        this.addEvent(this.ui.item3,this.onClick);

        this.posList = [[this.ui.item0.x,this.ui.item0.y],[this.ui.item1.x,this.ui.item1.y],[this.ui.item2.x,this.ui.item2.y]];
        this.refresh();
    }

    private _isTarget:boolean;
    private _lastX:number = 0;
    private _lastY:number = 0;
    private _count:number = 0;

    private _downPos:Laya.Point = new Laya.Point();
    onDown(sprite: Laya.Sprite):void
    {
        this._downPos.x = Laya.stage.mouseX;
        this._downPos.y = Laya.stage.mouseY;
        this._lastX = this._lastY = this._count = 0;
        if(sprite == this.targetItem && !this.ui.item3.visible)
        {
            Laya.timer.frameLoop(1,this,this.onLoop);
        }
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    onUp(sprite:Laya.Sprite):void
    {
        Laya.timer.clear(this,this.onLoop);
        if(Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y)
        {
            this.onClick(sprite);
        }
        else
        {
            super.onUp(sprite);
        }
    }

    
    private onLoop():void
    {
        if(this._lastX != this.targetItem.x && this._lastY != this.targetItem.y)
        {
            this._count++;
        }
        this._lastX = this.targetItem.x;
        this._lastY = this.targetItem.y;

        if(this._count >= 30)
        {
            Laya.timer.clear(this,this.onLoop);
            this.ui.item3.visible = true;
            this.ui.item3.pos(this.targetItem.x,this.targetItem.y);
            Laya.Tween.to(this.ui.item3,{x:this.ui.item3.x - 100,y:this.ui.item3.y + 150},100,Laya.Ease.backOut);
        }
    }

    private targetItem:Laya.Box;
    refresh(): void  {
        Laya.MouseManager.enabled = true;
        this._count = 0;
        super.refresh();
        this.ui.item3.visible = false;
        this.ui.item0.pos(this.posList[0][0],this.posList[0][1]);
        this.ui.item1.pos(this.posList[1][0],this.posList[1][1]);
        this.ui.item2.pos(this.posList[2][0],this.posList[2][1]);
        let targetIndex = Math.floor(3 * Math.random());
        this.targetItem = this.ui["item" + targetIndex];
    }

    private onClick(img): void {
        this.setAnswer(img,img == this.ui.item3);
    }
}