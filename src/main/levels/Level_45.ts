import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_45 extends BaseLevel {
    private ui: ui.level45UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level45UI();
        this.addChild(this.ui);
        this.isInit = true;


        this.ui.item0.tag = [this.ui.item0.x,this.ui.item0.y];
        this.addEvent(this.ui.item0,null,true);
        for(let i = 1; i < 8; i++)
        {
            this.addEvent(this.ui["box" + i],this.onClick);
        }
        
        this.refresh();
    }
    private onClick(btn):void
    {
        this.setAnswer(btn,btn == this.ui.box4);
    }

    onDown(sprite: Laya.Sprite):void
    {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();

        this.ui.item0.pos(this.ui.item0.tag[0],this.ui.item0.tag[1]);
    }
}