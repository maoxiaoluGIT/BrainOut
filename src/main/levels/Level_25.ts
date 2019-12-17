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
            let item = this.ui["item" + i];
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
            let item = this.ui["item" + i];
            item.visible = true;
            item.pos(item.tag[0],item.tag[1]);
        }

        this.ui.danImg.visible = false;
        // this.ui.item1.visible = true;
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
        this.ui.danImg.pos(this.ui.item5.x + 70,this.ui.item5.y + 54);
        let isHit:boolean = false;
        // if(sprite == this.ui.item1 || sprite == this.ui.item5 || sprite == this.ui.item2)
        // {
        //     let hitDan:boolean = GM.hitPoint(this.ui.item1,this.ui.danImg);
        //     let hitFace:boolean = GM.hitPoint(this.ui.item1,this.ui.item2);
        //     if(hitDan && !hitFace)
        //     {
        //         this.ui.danImg.visible = true;
        //         this.ui.item1.visible = false;
        //         isHit = true;
        //         setTimeout(() => {
        //             this.ui.rightBox.pos(this.ui.danImg.x + this.ui.danImg.width * 0.5,this.ui.danImg.y + this.ui.danImg.height * 0.5);
        //             this.setAnswer(this.ui.rightBox, true);
        //         }, 300);
        //     }
        // }

        if (!isHit)  {
            this.ui.rightBox.pos(sprite.x + sprite.width * 0.5,sprite.y + sprite.height * 0.5);
            this.setAnswer(this.ui.rightBox, false);
        }
    }
}