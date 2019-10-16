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
import TipsView from "./TipsView";

export default class MainView extends ui.mainViewUI {
    private _mainFace:MainFace;
    private _rightView:RightView;
    private _tipsView:TipsView;
    private _box:Laya.Box = new Laya.Box();
    private _viewMap:any = {};

    private _monseIcon:ui.mouseIconUI;
    constructor() { 
        super(); 
        this.addChild(this._box);
        this._mainFace = new MainFace();
        this.addChild(this._mainFace);

        RightIcon.ins = new RightIcon();
        WrongIcon.ins = new WrongIcon();

        Game.eventManager.on(GameEvent.SHOW_RIGHT,this,this.showRight);
        Game.eventManager.on(GameEvent.ON_NEXT,this,this.onNext);
        Game.eventManager.on(GameEvent.ON_REFRESH,this,this.onRefresh);
        Game.eventManager.on(GameEvent.SHOW_TIPS,this,this.showTips);

        this._monseIcon = new ui.mouseIconUI();

        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);

        this.showLevel(1);
    }

    private onMouseDown():void
    {
        this.addChild(this._monseIcon);
        this._monseIcon.pos(Laya.stage.mouseX,Laya.stage.mouseY + Game.layerManager.y);
        MyEffect.smallBig(this._monseIcon,1.4,0);
    }

    private showTips():void
    {
        if(!this._tipsView)
        {
            this._tipsView = new TipsView();
        }
        this.addChild(this._tipsView);
        this._tipsView.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
        MyEffect.popup(this._tipsView,1,500,100);
        this._tipsView.setTips(this.curView.sys);
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
        MyEffect.popup(this._rightView,1,500,250);
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
        Laya.MouseManager.multiTouchEnabled = false;
        this.curLv = lv;
        this.curView = this._viewMap[lv];
        if(!this.curView)
        {
            let VIEW:any = Laya.ClassUtils.getClass(lv + "");
            if(VIEW)
            {
                this.curView = new VIEW(); 
            }
            this._viewMap[lv] = this.curView;
        }
        else
        {
            this.curView.refresh();
        }
        this.curView.onShow(lv,this._box);
        this._mainFace.setTitle(this.curView.sys);

        
    }
}