import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_48 extends BaseLevel {
    private ui: ui.level48UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level48UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 4; i++)
        {
            let btn = this.ui["img" + i];
            this.addEvent(btn,null,true);
            btn.tag = [btn.x,btn.y];
        }
        this.addEvent(this.ui.baobao,null,true);

        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
    }


    onUp(sprite: Laya.Sprite): void  {
        if(sprite == this.ui.baobao)
        {
            if(GM.hit(this.ui.baobao,this.ui.xiaohai))
            {
                this.ui.baobao.visible = false;
                this.ui.xiaohai.skin = "guanqia/48/pic_34_6.png";
                Laya.Tween.to(this.ui.xiaohai,{x:-300},2000);
                GM.imgEffect.addEffect2(this.ui.nvren,3);
                Laya.Tween.to(this.ui.nvren,{x:-300},3000,null,null,500);
                setTimeout(() => {
                    this.setAnswer(this.ui.rightBox,true);
                }, 1500);
            }
        }
        else
        {
            this.setAnswer(this.ui.rightBox,false);
            this.gotoStartPos(sprite);
        }
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.to(sprite,{x:sprite.tag[0],y:sprite.tag[1]},100);
    }

    private onClick():void
    {
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
    }
}