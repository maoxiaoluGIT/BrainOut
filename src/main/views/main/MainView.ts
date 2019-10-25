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
import Session from "../../sessions/Session";
import SkipView from "./SkipView";
import KeyIcon from "./KeyIcon";
import GM from "../../GM";
import PassView from "./PassView";
import AdType from "./AdType";
import KeyNullTips from "./KeyNullTips";

export default class MainView extends ui.mainViewUI {
    private _mainFace:MainFace;
    private _rightView:RightView;
    private _tipsView:TipsView;
    private _skipView:SkipView;
    private _box:Laya.Box = new Laya.Box();
    // private _viewMap:any = {};

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
        Game.eventManager.on(GameEvent.ON_FIRST,this,this.goLastIndex);
        Game.eventManager.on(GameEvent.ON_REFRESH,this,this.onRefresh);
        Game.eventManager.on(GameEvent.SHOW_TIPS,this,this.showTips);
        Game.eventManager.on(GameEvent.SKIP_CUR,this,this.showSkip);
        Game.eventManager.on(GameEvent.AD_SUCCESS_CLOSE,this,this.onAddKey);
        Game.eventManager.on(GameEvent.SHARE_SUCCESS,this,this.onAddKey)
        Game.eventManager.on(GameEvent.WX_ON_SHOW,this,this.showWx);
        Game.eventManager.on(GameEvent.WX_ON_HIDE,this,this.hideWx);
        Game.eventManager.on(GameEvent.SHOW_TIPS_NULL,this,this.showTipsNull);

        this._monseIcon = new ui.mouseIconUI();

        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Game.eventManager.on(GameEvent.SELECT_CELL,this,this.showLevel);
        this.goLastIndex();
    }

    private _nullTipsView:KeyNullTips;
    private showTipsNull():void
    {
        if(!this._nullTipsView)
        {
            this._nullTipsView = new KeyNullTips();
        }
        this.addChild(this._nullTipsView);
        this._nullTipsView.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
        MyEffect.popup(this._nullTipsView,1,500,100);
    }

    private showWx():void
    {
        Game.soundManager.setMusicVolume(1);
    }

    private hideWx():void
    {
        Game.soundManager.setMusicVolume(0);
    }

    private onAddKey(type:number):void
    {
        Session.gameData.keyNum += 1;
        Session.onSave();
        KeyIcon.fly("+1");
        
        if(type == AdType.answerRight)
        {
            this.onNext();
        }
        else if(type == AdType.skip)
        {

        }
    }

    private showSkip():void
    {
        if(!this._skipView)
        {
            this._skipView = new SkipView();
        }
        this.addChild(this._skipView);
        this._skipView.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
        MyEffect.popup(this._skipView,1,500,100);
    }

    private onMouseDown():void
    {
        this.addChild(this._monseIcon);
        this._monseIcon.pos(Laya.stage.mouseX,Laya.stage.mouseY - Game.layerManager.y);
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

        Session.gameData.keyNum--;
        Session.onSave();
        KeyIcon.fly("-1");
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

        this.curLv++;
        Session.gameData.lastIndex = this.curLv;
        
        if(this.curLv > Session.gameData.maxIndex)
        {
            Session.gameData.maxIndex = this.curLv;
        }
        Session.onSave();
    }

    private goLastIndex():void
    {
        this.showLevel(Session.gameData.lastIndex);
    }

    private onNext():void
    {
        if(this.curLv <= GM.indexNum)
        {
            this.showLevel(this.curLv);
            return;
        }
        this.showPassGame();
    }

    private _passView:PassView;
    private showPassGame():void
    {
        if(!this._passView)
        {
            this._passView = new PassView();
        }
        this.addChild(this._passView);
        this._passView.anchorX = this._passView.anchorY = 0.5;
        this._passView.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
        MyEffect.popup(this._passView,1,500,250);
    }

    private curView:BaseLevel;
    private curLv:number;
    showLevel(lv:number):void
    {
        this._box.removeChildren();
        Laya.MouseManager.multiTouchEnabled = false;

        RightIcon.ins.removeSelf();
        WrongIcon.ins.removeSelf();
        if(this.curView)
        {
            this.curView.onClear();
            this.curView.destroy(true)
        }
        
        this.curLv = lv;
        let VIEW:any = Laya.ClassUtils.getClass(lv + "");
        if(VIEW)
        {
            this.curView = new VIEW(); 
        }
        this.curView.onShow(lv,this._box);
        this._mainFace.setTitle(this.curView.sys);
        Laya.SoundManager.stopSound(Game.soundManager.pre + "win.mp3");


    }
}