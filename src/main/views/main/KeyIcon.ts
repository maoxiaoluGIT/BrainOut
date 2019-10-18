import { ui } from "../../../ui/layaMaxUI";
import Game from "../../../core/Game";
import GameConfig from "../../../GameConfig";
import GameEvent from "../../GameEvent";

export default class KeyIcon extends ui.KeyIconUI {
    static ins:KeyIcon;
    constructor() { super(); }

    static fly(num:number = 1):void
    {
        if(!KeyIcon.ins)
        {
            KeyIcon.ins = new KeyIcon();
        }
        KeyIcon.ins.yaoshishu.text = "" + num;
        Game.layerManager.addChild(KeyIcon.ins);
        KeyIcon.ins.pos(GameConfig.width * 0.5,GameConfig.height - 300);
        Laya.Tween.to(KeyIcon.ins,{y:GameConfig.height - 600},500,null,new Laya.Handler(this,()=>{
            Game.eventManager.event(GameEvent.UPDATE_KEY_NUM);
            KeyIcon.ins.removeSelf();
        }),500);
    }
}