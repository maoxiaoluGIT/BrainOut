import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_24 extends BaseLevel {
    private ui: ui.level24UI;

    private clickNum:number = 0;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level24UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 3; i++)
        {
            let item:Laya.Image = this.ui["item" + i];
            this.addEvent(item,null,true);
            item.tag = [item.x,item.y];
        }
        this.addEvent(this.ui.zhu,this.onClick);

        this.ui.sureBtn.clickHandler = new Laya.Handler(this,this.onSure);
        this.refresh();
    }

    private onClick(sprite: Laya.Sprite):void
    {
        this.clickNum++;
        if(this.clickNum == 3)
        {
            this.ui.zhu.visible = false;
            this.ui.poImg.visible = true;
        }
    }

    refresh():void
    {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.shuru.text = "";

        this.clickNum = 0;

        for(let i = 0; i < 3; i++)
        {
            let item:Laya.Image = this.ui["item" + i];
            item.visible = true;
            item.pos(item.tag[0],item.tag[1]);
        }

        this.ui.zhu.visible = true;
        this.ui.poImg.visible = false;
    }

    private onSure():void
    {
        this.setAnswer(this.ui.rightBox,this.ui.shuru.text == "0");
    }

    onDown(sprite: Laya.Sprite):void
    {
        this.ui.addChild(sprite);
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }
    

    onUp(sprite):void
    {
        sprite.stopDrag();
        if(GM.hit(sprite,this.ui.targetBox))
        {
            sprite.visible = false;
        }
    }
}