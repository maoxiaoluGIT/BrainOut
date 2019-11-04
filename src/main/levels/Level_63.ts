import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_63 extends BaseLevel{
    private ui: ui.level63UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level63UI();
        this.addChild(this.ui);
        this.isInit = true;

        for (let i = 0; i < 4; i++)  {
            let itemImg = this.ui["item" + i];
            this.addEvent(itemImg, null,true);
            itemImg.tag = [itemImg.x,itemImg.y];
        }

        this.refresh();
    }

    refresh(): void {
        super.refresh();
        for (let i = 0; i < 4; i++)  {
            let itemImg = this.ui["item" + i];
            itemImg.pos(itemImg.tag[0],itemImg.tag[1]);
        }
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    onUp(sprite):void
    {
        super.onUp(sprite);
        if(sprite == this.ui.item2)
        {
            this.ui.hitBox.pos(this.ui.item2.x + 90,this.ui.item2.y - 40);
        }

        if(sprite == this.ui.item2 || sprite == this.ui.item3)
        {
            if(GM.hitPoint(this.ui.item3,this.ui.hitBox))
            {
                Laya.Tween.to(this.ui.item3,{x:this.ui.item2.x + 138,y:this.ui.item2.y + 20},150,null,new Laya.Handler(this,this.onCom));
            }
            else
            {
                this.setAnswer(sprite,false);
            }
        }
        else
        {
            this.setAnswer(sprite,false);
        }

    }

    private onCom():void
    {
        this.setAnswer(this.ui.item2,true);
    }

}