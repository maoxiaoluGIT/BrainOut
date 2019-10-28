import { ui } from "../../ui/layaMaxUI";
import BaseLevel from "./BaseLevel";
import GM from "../GM";
import RightIcon from "./RightIcon";

export default class Level_42 extends BaseLevel {
    private ui: ui.level42UI;

    constructor() { super(); }

    onInit(): void {
        if (this.isInit) {
            return;
        }
        this.ui = new ui.level42UI();
        this.addChild(this.ui);
        this.isInit = true;

        for(let i = 0; i < 12; i++)
        {
            let btn = this.ui["img" + i];
            btn.tag = this.ui["item" + i];
            this.addEvent(btn,this.onClick);
        }

        this.refresh();
    }

    private onClick(btn):void
    {
        btn.visible = false;
        RightIcon.ins.add(this);
        RightIcon.ins.pos(btn.tag.x + btn.tag.width * 0.5,btn.tag.y + btn.tag.height * 0.5);
        this._num++;
        setTimeout(() => {
            RightIcon.ins.removeSelf();
            btn.tag.visible = false;
            if(this._num == 12)
            {
                this.setAnswer(btn.tag,true);
            }
        }, 500);
    }

    private _num:number = 0;
    refresh(): void  {
        this._num = 0;
        Laya.MouseManager.enabled = true;
        super.refresh();

        for(let i = 0; i < 12; i++)
        {
            let btn = this.ui["img" + i];
            btn.tag.visible = true;
            btn.visible = true;
        }
    }
}