import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_29 extends BaseLevel {
    private ui: ui.level29UI;
    private posList:number[][] = [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level29UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4; i++)
        {
            let sprite = this.ui["item" + i];
            this.posList.push([sprite.x,sprite.y]);
            this.addEvent(sprite,this.onClick,true);
        }

        this.addEvent(this.ui.item4,this.onClick,true);
        this.ui.item4.tag = [this.ui.item4.x,this.ui.item4.y];

        this.refresh();
    }

    private onClick(sprite):void
    {
        if(sprite == this.ui.item0)
        {
            if(this.ui.item4.y > this.ui.item0.y +this.ui.item0.height)
            {
                this.setAnswer(sprite,true);
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

    refresh(): void {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.posList.sort(()=>{
            return Math.random() > 0.5 ? 1 : -1;
        })

        for(let i = 0; i < 4; i++)
        {
            let sprite = this.ui["item" + i];
            sprite.pos(this.posList[i][0],this.posList[i][1]);
        }

        this.ui.item4.pos(this.ui.item4.tag[0],this.ui.item4.tag[1]);
    }

    onDown(sprite: Laya.Sprite):void
    {
        this.ui.addChild(sprite);
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
    }
}