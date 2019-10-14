import { ui } from "../../../ui/layaMaxUI";
import MainFace from "./MainFace";
import BaseLevel from "../../levels/BaseLevel";
import RightIcon from "../../levels/RightIcon";
import WrongIcon from "../../levels/WrongIcon";
import Game from "../../../core/Game";
import GameEvent from "../../GameEvent";
import RightView from "./RightView";
import MyEffect from "../../../core/utils/MyEffect";
import GameConfig from "../../../GameConfig";

export default class MainView extends ui.mainViewUI {
    private _mainFace:MainFace;
    private _rightView:RightView;
    private _box:Laya.Box = new Laya.Box();
    constructor() { 
        super(); 
        this.addChild(this._box);
        this._mainFace = new MainFace();
        this.addChild(this._mainFace);

        this.showLevel(1);

        RightIcon.ins = new RightIcon();
        WrongIcon.ins = new WrongIcon();

        Game.eventManager.on(GameEvent.SHOW_RIGHT,this,this.showRight);
        Game.eventManager.on(GameEvent.ON_NEXT,this,this.onNext);
        Game.eventManager.on(GameEvent.ON_REFRESH,this,this.onRefresh);
    }

    private onRefresh():void
    {
        this.curView.refresh();
    }

    private showRight():void
    {
        if(!this._rightView)
        {
            this._rightView = new RightView();
        }
        this.addChild(this._rightView);
        this._rightView.anchorX = this._rightView.anchorY = 0.5;
        this._rightView.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
        MyEffect.popup(this._rightView,1,500,100);
        this._rightView.setWin(this.curView.sys);
    }

    private onNext():void
    {
        this.curLv++;
        this.showLevel(this.curLv);
    }

    private curView:BaseLevel;
    private curLv:number;
    showLevel(lv:number):void
    {
        this._box.removeChildren();

        this.curLv = lv;
        let VIEW:any = Laya.ClassUtils.getClass(lv + "");
        this.curView = new VIEW();
        this.curView.onShow(lv,this._box);
        this._mainFace.setTitle(this.curView.sys);
    }
}