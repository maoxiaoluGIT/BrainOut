import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_19 extends BaseLevel{
    private ui: ui.level19UI;
    
    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level19UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 5; i++)
        {
            let img = this.ui["item" + i];
            this.addEvent(img,null,true);
            img.tag = [img.x,img.y];
        }

        this.refresh();
    }

    refresh():void
    {
        super.refresh();
        for(let i = 0; i < 5; i++)
        {
            let img = this.ui["item" + i];
            img.pos(img.tag[0],img.tag[1]);
        }
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite: Laya.Sprite):void
    {
        sprite.stopDrag();
        if(sprite != this.ui.item4)
        {
            this.setAnswer(sprite,false);
            return;
        }
        if(GM.hit(sprite,this.ui.item0))
        {
            this.setAnswer(sprite,true);
            return;
        }
        this.setAnswer(sprite,false);
    }

}