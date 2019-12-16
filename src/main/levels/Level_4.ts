import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";

export default class Level_4 extends BaseLevel{
    private ui: ui.level4UI;

    private posList:number[][] = [];
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level4UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 7;i++)
        {
            let img:Laya.Image = this.ui["img" + i];
            this.addEvent(img,this.onClick,i < 6);
            this.posList.push([img.x,img.y]);
        }
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
        for(let i = 0; i < 6;i++)
        {
            let img:Laya.Image = this.ui["img" + i];
            img.pos(this.posList[i][0],this.posList[i][1]);
        }

        let index:number = Math.floor(Math.random() * 6);
        let img:Laya.Image = this.ui["img" + index];
        this.ui.img6.pos(img.x,img.y);
    }

    private onClick(img):void
    {
        this.setAnswer(img,img == this.ui.img6);
    }
}