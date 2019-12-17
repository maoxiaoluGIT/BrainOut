import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_31 extends BaseLevel {
    private ui: ui.level31UI;
    private quanList:Laya.Image[] = [];

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level31UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 6; i++)
        {
            let img:Laya.Image = this.ui["item" + i];
            this.addEvent(img,this.onClick);

            this.quanList.push(this.ui["quan" + i]);
        }
        this.addEvent(this.ui.giftBox,this.onClickGift);
        this.ui.topBox.tag = [this.ui.topBox.x,this.ui.topBox.y];

        this.refresh();
    }

    private onClickGift(img:Laya.Image):void
    {
        Laya.Tween.to(this.ui.topBox,{y:632},500,null,new Laya.Handler(this,this.onCom));
    }

    private onCom():void
    {
        this.ui.item1.visible = true;
    }

    private onClick(img:Laya.Image):void
    {
        if(img.tag == null)
        {
            let quan:Laya.Image = this.quanList.shift();
            quan.pos(img.x,img.y);
            this.ui.addChild(quan);
            img.tag = quan;
        }

        if(this.quanList.length == 0)
        {
            this.setAnswer(this.ui.rightBox,true);
        }
    }

    refresh():void
    {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.ui.topBox.pos(this.ui.topBox.tag[0],this.ui.topBox.tag[1]);
        this.ui.item1.visible = false;

        this.quanList.length = 0;
        for(let i = 0; i < 6; i++)
        {
            let img:Laya.Image = this.ui["item" + i];
            img.tag = null;
            this.quanList.push(this.ui["quan" + i]);
        }
    }
}