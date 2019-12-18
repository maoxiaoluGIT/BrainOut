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

        for(let i = 1; i < 6; i++)
        {
            let item = this.ui["item" + i];
            this.addEvent(item,null,true);
            item.tag = [item.x,item.y];
        }

        this.refresh();
    }

    refresh(): void {
        Laya.MouseManager.enabled = true;
        super.refresh();

        for(let i = 1; i < 6; i++)
        {
            let item = this.ui["item" + i];
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
        if(sprite == this.ui.item1)
        {
            let hitDan:boolean = GM.hitPoint(this.ui.item1,this.ui.baBox);
            if(hitDan)
            {
                isHit = true;
                this.ui.item1.pos(98,822);
                setTimeout(() => {
                    this.ui.rightBox.pos(this.ui.item1.x + this.ui.item1.width * 0.5,this.ui.item1.y + this.ui.item1.height * 0.5);
                    this.setAnswer(this.ui.rightBox, true);
                }, 300);
            }
        }

        if (!isHit)  {
            this.ui.rightBox.pos(sprite.x + sprite.width * 0.5,sprite.y + sprite.height * 0.5);
            this.setAnswer(this.ui.rightBox, false);
        }
    }
}