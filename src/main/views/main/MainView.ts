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
import { DataKey } from "../../sessions/DataKey";
import TipsView42 from "./TipsView42";
import LogType from "../../LogType";
import TipsView61 from "./TipsView61";
import OppoPlatform from "../../platforms/OppoPlatform";

export default class MainView extends ui.mainViewUI {
    private _mainFace:MainFace;
    private _rightView:RightView;
    private _tipsView:TipsView;
    private _tipsView42:TipsView42;
    private _tipsView61:TipsView61;
    private _skipView:SkipView;
    private _box:Laya.Box = new Laya.Box();
    // private _viewMap:any = {};

    private _monseIcon:ui.mouseIconUI;

    constructor() { 
        super(); 
        this.addChild(this._box);
        // this._box.mouseThrough = true;
        // this.mouseThrough = true;
        this._box.name = "LevelsBox";
        this._mainFace = new MainFace();
        this.addChild(this._mainFace);

        RightIcon.ins = new RightIcon();
        WrongIcon.ins = new WrongIcon();

        Game.eventManager.on(GameEvent.SHOW_RIGHT,this,this.showRight);
        Game.eventManager.on(GameEvent.ON_NEXT,this,this.onNext);
        Game.eventManager.on(GameEvent.ON_SKIP,this,this.onSkip);
        Game.eventManager.on(GameEvent.ON_FIRST,this,this.goFirst);
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
        Game.eventManager.on(GameEvent.SELECT_CELL,this,this.selectCell);
        this.goLastIndex();
    }

    private selectCell(lv):void
    {
        GM.helpIndex = 0;
        this.curLv = lv;
        this.showLevel(this.curLv);
    }

    private goFirst():void
    {
        this.curLv = 1;
        this.showLevel(this.curLv);
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
        GM.showTTBanner();
    }

    private showWx():void
    {
        Game.soundManager.setMusicVolume(GM.musicState);
    }

    private hideWx():void
    {
        Game.soundManager.setMusicVolume(0);
    }

    private onAddKey(type:number):void
    {
        Session.gameData[DataKey.keyNum] += 1;
        Session.onSave();
        KeyIcon.fly("+1");
        GM.sysLog(LogType.get_key);
        
        if(type == AdType.answerRight)
        {
            GM.sysLog(LogType.shengli_ad_com);
        }
        else if(type == AdType.skip)
        {
            GM.sysLog(LogType.skip_ad_com);
        }
        else if(type == AdType.nullKey)
        {
            GM.sysLog(LogType.key_null_ad_com);
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
        GM.showTTBanner();
    }

    private onMouseDown():void
    {
        this.addChild(this._monseIcon);
        this._monseIcon.pos(Laya.stage.mouseX,Laya.stage.mouseY - Game.layerManager.y);
        MyEffect.smallBig(this._monseIcon,1.4,0);
    }

    private showTips():void
    {
        if(this.curView.sys.id == 42)
        {
            if(!this._tipsView42)
            {
                this._tipsView42 = new TipsView42();
            }
            this.addChild(this._tipsView42);
            this._tipsView42.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
            MyEffect.popup(this._tipsView42,1,500,100);
            this._tipsView42.setTips(this.curView.sys);
        }
        else if(this.curView.sys.id == 61)
        {
            if(!this._tipsView61)
            {
                this._tipsView61 = new TipsView61();
            }
            this.addChild(this._tipsView61);
            this._tipsView61.pos(GameConfig.width * 0.5,GameConfig.height * 0.5);
            MyEffect.popup(this._tipsView61,1,500,100);
            this._tipsView61.setTips(this.curView.sys);
        }
        else
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

        Session.gameData[DataKey.keyNum]--;
        Session.onSave();
        KeyIcon.fly("-1");
        GM.sysLog(LogType.resume_key);
        GM.showTTBanner();
    }

    private onRefresh():void
    {
        this.curView.refresh();
        GM.hideTTBanner();
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

        if(this.curLv > Session.gameData[DataKey.maxIndex])
        {
            Session.gameData[DataKey.maxIndex] = this.curLv;
        }
        if(GM.helpIndex > 0)
        {
            this.curLv == Session.gameData[DataKey.lastIndex];
            GM.helpIndex = 0;
        }
        else
        {
            GM.sysLog(3000 + this.curLv);
            this.curLv++;
            Session.gameData[DataKey.lastIndex] = this.curLv;
        }
        if(Session.gameData[DataKey.lastIndex] > GM.indexNum)
        {
            Session.gameData[DataKey.lastIndex] = 1;
        }

        Session.onSave();

        GM.showTTBanner();
    }

    private goLastIndex():void
    {
        this.curLv = Session.gameData[DataKey.lastIndex];
        if(GM.helpIndex > 0)
        {
            this.helpLevel(GM.helpIndex);
        }
        else
        {
            this.showLevel(this.curLv);
        }
    }

    private onSkip():void
    {
        this.curLv++;
        if(this.curLv <= GM.indexNum)
        {
            this.showLevel(this.curLv);
            return;
        }
        this.showPassGame();
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
        GM.showTTBanner();
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
        let VIEW:any = Laya.ClassUtils.getClass(lv + "");
        if(VIEW)
        {
            this.curView = new VIEW(); 
        }
        this.curView.onShow(lv,this._box);
        this._mainFace.setTitle(this.curView.sys);
        Laya.SoundManager.stopSound(Game.soundManager.pre + "win.mp3");
        GM.sysLog(2000 + lv);

        GM.platform.recorder();

        if(GM.platform instanceof OppoPlatform)
        {
            (GM.platform as OppoPlatform).showBanner("142894");
        }
        GM.hideTTBanner();
    }

    helpLevel(lv:number):void
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
        let VIEW:any = Laya.ClassUtils.getClass(lv + "");
        if(VIEW)
        {
            this.curView = new VIEW(); 
        }
        this.curView.onShow(lv,this._box);
        this._mainFace.setTitle(this.curView.sys);
        Laya.SoundManager.stopSound(Game.soundManager.pre + "win.mp3");
        GM.hideTTBanner();
    }
}