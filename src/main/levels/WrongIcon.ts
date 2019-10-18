import { ui } from "../../ui/layaMaxUI";
import Game from "../../core/Game";
import GM from "../GM";

export default class WrongIcon extends ui.wrongIconUI{
    static ins:WrongIcon;
    constructor() { super(); }

    add(parentSpr:Laya.Sprite):void
    {
        parentSpr && parentSpr.addChild(this);
        this.pos(parentSpr.width * 0.5,parentSpr.height * 0.5);

        this.icon.scale(0,0);
        let t = new Laya.TimeLine();
        t.to( this.icon , { scaleX:0.4 , scaleY:0.4 } , 100);
        t.to( this.icon , { scaleX:1 , scaleY:1 } , 800 , Laya.Ease.backOut );
        t.to( this.icon , { scaleX:0 , scaleY:0 } , 400);

        t.play();

        GM.playSound("wrong.mp3");

        GM.platform.shake(false);
    }
}