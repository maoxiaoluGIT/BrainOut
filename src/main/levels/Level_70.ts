import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_70 extends BaseLevel {
    private ui: ui.level70UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level70UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 9; i++)
        {
            let btn= this.ui["item" + i];
            this.addEvent(btn,null,true);
            btn.tag = {};
            btn.tag.pos = [btn.x,btn.y];
            btn.tag.isTween = false;
        }

        this.refresh();

        Laya.timer.frameLoop(1,this,this.onLoop);
    }

    private onLoop():void
    {
        for(let i = 0; i < 9; i++)
        {
            let btn= this.ui["item" + i];
            if(btn.tag.isTween)
            {
                continue;
            }
            if(!GM.hitPoint2(btn.x,btn.y,this.ui.box))
            {
                btn.stopDrag();
                this.gotoStartPos(btn);
            }
        }
    }

    onClear():void
    {
        super.onClear();
        Laya.timer.clear(this,this.onLoop);
    }

    onDown(sprite): void  {
        this.addChild(sprite);
        sprite.tag.isTween = false;
        // sprite.startDrag(new Laya.Rectangle(this.ui.box.x,this.ui.box.y,this.ui.box.width,this.ui.box.height));
        sprite.startDrag();
    }


    private hit0:boolean = false;
    private hit1:boolean = false;
    onUp(sprite: Laya.Sprite): void  {
        if(sprite == this.ui.item5)
        {
            this.hit0 = false;
            if(GM.hitPoint(this.ui.item5,this.ui.hitBox0))
            {
                this.hit0 = true;
                Laya.Tween.to(this.ui.item5,{x:160,y:682},150,null,new Laya.Handler(this,()=>{
                    if(this.hit0 && this.hit1)
                    {
                        this.setAnswer(this.ui.rightBox,true);
                    }
                }));
            }
            else
            {
                this.gotoStartPos(sprite);
            }
        }
        else if(sprite == this.ui.item4)
        {
            this.hit1 = false;
            if(GM.hitPoint(this.ui.item4,this.ui.hitBox1))
            {
                this.hit1 = true;
                Laya.Tween.to(this.ui.item4,{x:260,y:682},150,null,new Laya.Handler(this,()=>{
                    if(this.hit0 && this.hit1)
                    {
                        this.setAnswer(this.ui.rightBox,true);
                    }
                }));
            }
            else
            {
                this.gotoStartPos(sprite);
            }
        }
        else
        {
            this.gotoStartPos(sprite);
        }
    }

    private gotoStartPos(sprite):void
    {
        Laya.Tween.clearTween(sprite);
        sprite.tag.isTween = true;
        Laya.Tween.to(sprite,{x:sprite.tag.pos[0],y:sprite.tag.pos[1]},100,null,new Laya.Handler(this,this.onCom2,[sprite]));
    }

    private onCom2(sprite):void
    {
        sprite.tag.isTween = false;
    }

    private onClick():void
    {
    }

    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();

        for(let i = 0; i < 9; i++)
        {
            let btn = this.ui["item" + i];
            btn.pos(btn.tag.pos[0],btn.tag.pos[1]);
        }
    }
}