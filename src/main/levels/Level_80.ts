import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import Session from "../sessions/Session";
import GM from "../GM";

export default class Level_80 extends BaseLevel{
    private ui: ui.level80UI;
    
    constructor() { super(); }

    private _delta:number = 4;

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level80UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.ui.ji.tag = [this.ui.ji.x,this.ui.ji.y];
        this.refresh();

        this.addEvent(this.ui.zuo,null,true);
        this.addEvent(this.ui.you,null,true);
        this.addEvent(this.ui.shang,null,true);
        this.addEvent(this.ui.xia,null,true);
    }

    onDown(sprite: Laya.Sprite):void
    {
        Laya.timer.frameLoop(1,this,this.onLoop,[sprite]);
    }

    private onLoop(sprite):void
    {
        if(sprite == this.ui.zuo)
        {
            this.ui.ji.x -= this._delta;
        }
        else if(sprite == this.ui.you)
        {
            this.ui.ji.x += this._delta;
        }
        else if(sprite == this.ui.shang)
        {
            this.ui.ji.y -= this._delta;
        }
        else if(sprite == this.ui.xia)
        {
            this.ui.ji.y += this._delta;
        }

        this.onCheck();
    }
    

    onUp(sprite: Laya.Sprite):void
    {
        Laya.timer.clear(this,this.onLoop);
        this.onCheck();
    }
    
    private onCheck():void
    {
        if(GM.hitPoint(this.ui.ji,this.ui.chukouBox))
        {
            this.setAnswer(this.ui.rightBox,true);
            Laya.timer.clear(this,this.onLoop);
        }
        else
        {
            for(let i = 0; i < 34;i++)
            {
                let line = this.ui["line" + i];
                if(GM.hitPoint(this.ui.ji,line))
                {
                    this.setAnswer(this.ui.rightBox,false);
                    Laya.timer.clear(this,this.onLoop);

                    setTimeout(() => {
                        this.refresh(); 
                    }, 1000);
                    break;
                }
            }
        }
    }

    refresh():void
    {
        super.refresh();
        this.ui.ji.pos(this.ui.ji.tag[0],this.ui.ji.tag[1]);
        Laya.MouseManager.enabled = true;
    }
}