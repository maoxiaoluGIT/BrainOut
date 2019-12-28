import OppoIcon120 from "./OppoIcon120";
import { ui } from "../../ui/layaMaxUI";
import GM from "../GM";

export default class MainGameBox extends ui.oppo.mainGameBoxUI {
    constructor() { 
        super(); 
        this.hitBox.on(Laya.Event.CLICK,this,this.onHide);

        let arr:any[] = GM.oppoGames;
        for(let i = 0; i < 4; i++)
        {
            let icon120:OppoIcon120 = new OppoIcon120(arr[i]);
            this.addChild(icon120);
            icon120.pos(100,300 + 116 + i *  180);
        }
    }

    private onHide():void
    {
        Laya.Tween.to(this,{x:-750},300);
    }
}