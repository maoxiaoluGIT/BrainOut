import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";

export default class Level_39 extends BaseLevel {
    private ui: ui.level39UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level39UI();
        this.addChild(this.ui);
        this.isInit = true;

        this.addEvent(this.ui.shu,null,true);


        this.refresh();
    }

    onDown(sprite: Laya.Sprite): void  {
        sprite.startDrag();
    }


    onUp(sprite: Laya.Sprite): void  {
        sprite.stopDrag();
        if(sprite == this.ui.shu)
        {
            if(GM.hitPoint(this.ui.shu,this.ui.chui))
            {
                this.setAnswer(this.ui.rightBox,true);
            }
            else
            {
                this.randMonse();
            }
        }
    }

    private showRight(): void  {
        this.setAnswer(this.ui.rightBox, true);
    }

    private onClick(img: Laya.Image): void  {
        this.setAnswer(img, true);
    }


    private _num:number = 0;
    refresh(): void  {
        Laya.MouseManager.enabled = true;
        super.refresh();
        this.randMonse();
    }

    private _lastIndex:number = 0;
    private randMonse():void
    {
        let rand = Math.floor(4 * Math.random());
        if(rand == this._lastIndex)
        {
            rand++;
            if(rand > 3)
            {
                rand = 0;
            }
        }
        this._lastIndex = rand;
        let img = this.ui["kengxia" + this._lastIndex];
        this.ui.shu.pos(img.x,img.y);
        Laya.Tween.to(this.ui.shu,{y:this.ui.shu.y - 80},200,Laya.Ease.backOut);
    }
}