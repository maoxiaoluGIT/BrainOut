import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_47 extends BaseLevel{
    private ui: ui.level47UI;

    private posList:number[][] = [];
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level47UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4;i++)
        {
            let img = this.ui["item" + i];
            this.addEvent(img,this.onClick,true);
            this.posList.push([img.x,img.y]);
        }
        this.addEvent(this.ui.item,this.onClick,true);
        this.refresh();
    }

    private _downPos:Laya.Point = new Laya.Point();
    onDown(sprite: Laya.Sprite):void
    {
        this._downPos.x = Laya.stage.mouseX;
        this._downPos.y = Laya.stage.mouseY;

        sprite.off(Laya.Event.CLICK,this,this.onClick);
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    onUp(sprite: Laya.Sprite):void
    {
        if(Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y)
        {
            this.onClick(sprite);
        }
        else
        {
            super.onUp(sprite);
        }
    }

    refresh(): void {
        super.refresh();
        for(let i = 0; i < 4;i++)
        {
            let img = this.ui["item" + i];
            img.pos(this.posList[i][0],this.posList[i][1]);
        }

        let img = this.ui["item1"];
        this.ui.item.pos(img.x - 9,img.y + 147);
    }

    private onClick(img):void
    {
        this.setAnswer(img,img == this.ui.item);
    }
}