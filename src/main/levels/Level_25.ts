import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_25 extends BaseLevel {
    private ui: ui.level25UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level25UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 7; i++)
        {
            let item:Laya.Image = this.ui["item" + i];
            this.addEvent(item,null,true);
            item.tag = [item.x,item.y];
        }

        this.refresh();
    }

    refresh(): void {
        Laya.MouseManager.enabled = true;
        super.refresh();

        for(let i = 0; i < 7; i++)
        {
            let item:Laya.Image = this.ui["item" + i];
            item.visible = true;
            item.pos(item.tag[0],item.tag[1]);
        }
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
        let isHit:boolean = false;
        if(sprite == this.ui.item1 || this.ui.item5)
        {
            if(GM.hit(this.ui.item1,this.ui.item5))
            {
                isHit = true;
                Laya.Tween.to(this.ui.item1,{x:this.ui.item5.x + 64,y:this.ui.item5.y + 28},100);
                this.setAnswer(this.ui.item1,true);
            }
        }

        if (!isHit)  {
            this.setAnswer(sprite, false);
        }
    }
}