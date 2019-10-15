import { ui } from "../../ui/layaMaxUI";
import Game from "../../core/Game";

export default class RightIcon extends ui.rightIconUI{
    static ins:RightIcon;
    constructor(){
        super();
    }

    add(parentSpr:Laya.Image):void
    {
        parentSpr && parentSpr.addChild(this);
        this.pos(parentSpr.width * 0.5,parentSpr.height * 0.5);
        this.icon.scale(0,0);
        let t = new Laya.TimeLine();
        t.to( this.icon , { scaleX:0.4 , scaleY:0.4 } , 100);
        t.to( this.icon , { scaleX:1 , scaleY:1 } , 800 , Laya.Ease.backOut );
        t.play();

        Game.soundManager.play("right.wav");
    }
}