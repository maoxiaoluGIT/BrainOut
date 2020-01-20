import ViewManager from "./views/ViewManager";
import ImageEffect from "../core/utils/ImageEffect";
import { ViewID } from "./views/ViewID";
import MainView from "./views/main/MainView";
import Game from "../core/Game";
import SysTitles from "./sys/SysTitles";
import InitView from "./InitView";
import CellsView from "./views/cells/CellsView";
import SettingView from "./views/setting/SettingView";
import { BaseCookie } from "./gameCookie/BaseCookie";
import { BasePlatform } from "./platforms/BasePlatform";
import PlatformID from "./platforms/PlatformID";
import TestCookie from "./gameCookie/TestCookie";
import TestPlatform from "./platforms/TestPlatform";
import WXCookie from "./gameCookie/WXCookie";
import WXPlatform from "./platforms/WXPlatform";
import CookieKey from "./gameCookie/CookieKey";
import ImageEffect2 from "../core/utils/ImageEffect2";
import SigninView from "./views/signin/SigninView";
import Level_1 from "./levels/Level_1";
import Level_2 from "./levels/Level_2";
import Level_3 from "./levels/Level_3";
import Level_4 from "./levels/Level_4";
import Level_5 from "./levels/Level_5";
import Level_6 from "./levels/Level_6";
import Level_7 from "./levels/Level_7";
import Level_8 from "./levels/Level_8";
import Level_9 from "./levels/Level_9";
import Level_10 from "./levels/Level_10";
import Level_11 from "./levels/Level_11";
import Level_12 from "./levels/Level_12";
import Level_13 from "./levels/Level_13";
import Level_14 from "./levels/Level_14";
import Level_15 from "./levels/Level_15";
import Level_16 from "./levels/Level_16";
import Level_17 from "./levels/Level_17";
import Level_18 from "./levels/Level_18";
import Level_19 from "./levels/Level_19";
import Level_20 from "./levels/Level_20";
import Level_21 from "./levels/Level_21";
import Level_22 from "./levels/Level_22";
import Level_23 from "./levels/Level_23";
import Level_24 from "./levels/Level_24";
import Level_25 from "./levels/Level_25";
import Level_26 from "./levels/Level_26";
import Level_27 from "./levels/Level_27";
import Level_28 from "./levels/Level_28";
import Level_29 from "./levels/Level_29";
import Level_30 from "./levels/Level_30";
import Level_31 from "./levels/Level_31";
import Level_32 from "./levels/Level_32";
import Level_33 from "./levels/Level_33";
import Level_34 from "./levels/Level_34";
import Level_35 from "./levels/Level_35";
import Level_36 from "./levels/Level_36";
import Level_37 from "./levels/Level_37";
import Level_38 from "./levels/Level_38";
import Level_39 from "./levels/Level_39";
import Level_40 from "./levels/Level_40";
import Level_41 from "./levels/Level_41";
import Level_42 from "./levels/Level_42";
import Level_43 from "./levels/Level_43";
import Level_44 from "./levels/Level_44";
import Level_45 from "./levels/Level_45";
import Level_46 from "./levels/Level_46";
import Level_47 from "./levels/Level_47";
import Level_48 from "./levels/Level_48";
import Level_49 from "./levels/Level_49";
import Level_50 from "./levels/Level_50";
import Log from "./Log";
import TTCookie from "./gameCookie/TTCookie";
import TTPlatform from "./platforms/TTPlatform";
import Level_51 from "./levels/Level_51";
import Level_52 from "./levels/Level_52";
import Level_53 from "./levels/Level_53";
import Level_54 from "./levels/Level_54";
import Level_55 from "./levels/Level_55";
import Level_56 from "./levels/Level_56";
import Level_57 from "./levels/Level_57";
import Level_58 from "./levels/Level_58";
import Level_59 from "./levels/Level_59";
import Level_60 from "./levels/Level_60";
import Level_62 from "./levels/Level_62";
import Level_61 from "./levels/Level_61";
import Level_63 from "./levels/Level_63";
import Level_64 from "./levels/Level_64";
import Level_65 from "./levels/Level_65";
import QQCookie from "./gameCookie/QQCookie";
import QQPlatform from "./platforms/QQPlatform";
import Level_66 from "./levels/Level_66";
import Level_67 from "./levels/Level_67";
import Level_68 from "./levels/Level_68";
import Level_69 from "./levels/Level_69";
import Level_70 from "./levels/Level_70";
import Session from "./sessions/Session";
import { DataKey } from "./sessions/DataKey";
import OppoPlatform from "./platforms/OppoPlatform";
import Level_71 from "./levels/Level_71";
import Level_72 from "./levels/Level_72";
import Level_73 from "./levels/Level_73";
import Level_74 from "./levels/Level_74";
import Level_75 from "./levels/Level_75";
import Level_76 from "./levels/Level_76";
import Level_77 from "./levels/Level_77";
import Level_78 from "./levels/Level_78";
import Level_79 from "./levels/Level_79";
import Level_80 from "./levels/Level_80";

/**游戏总管理 */
export default class GM{
    static codeVer:string = "5.0.2.200120";
    static resVer:string = "5.0.2.200120";
    static fromOtherGame:boolean = false;
    static isConsoleLog:number;
    static platformId:number;
    static serverIP:string;
    static gamesInfo:string[][];
    static iconSwitch:number;
    static oppoGames:any[];
    static rightGame:any;
    static oppoSwitch:number;

    static helpIndex:number = 0;

    static userName:string;
    static userHeadUrl:string;
    static viewManager:ViewManager = new ViewManager();
    static imgEffect:ImageEffect = new ImageEffect();
    static imgEffect2:ImageEffect2 = new ImageEffect2();
    // static cookie:BaseCookie;
    static platform:BasePlatform;
    static musicState:number = 1;
    static soundState:number = 1;
    static shakeState:number = 1;

    static isRightView:boolean = false;

    static sysLog:Function = Log.syslog;

    /**本地资源 */
    static nativefiles:string[] = ["loading/loding.png","loading/shuzi2.png","loading/jiazaizhong.png","atlas/pubRes.atlas","atlas/pubRes.png","config.json"];

    static setConfig(config):void
    {
        GM.platformId = config.platformId;
        GM.serverIP = config.platforms[GM.platformId];
        GM.gamesInfo = config.gamesInfo;
        GM.iconSwitch = config.iconSwitch;
        GM.oppoGames = config.oppoGames;
        GM.rightGame = config.rightGame;
        GM.oppoSwitch = config.oppoSwitch;

        if(config.platformId == PlatformID.TEST || config.platformId == PlatformID.H5)
        {
            // GM.cookie = new TestCookie();
            GM.platform = new TestPlatform();
        }
        else if(config.platformId == PlatformID.WX)
        {
            // GM.cookie = new WXCookie();
            GM.platform = new WXPlatform();
        }
        else if(config.platformId == PlatformID.TT)
        {
            // GM.cookie = new TTCookie();
            GM.platform = new TTPlatform();
        }
        else if(config.platformId == PlatformID.QQ)
        {
            // GM.cookie = new QQCookie();
            GM.platform = new QQPlatform();
        }
        else if(config.platformId == PlatformID.OPPO)
        {
            // GM.cookie = new QQCookie();
            GM.platform = new OppoPlatform();
        }
        
        // if(config.platformId == PlatformID.WX || config.platformId == PlatformID.TT || config.platformId == PlatformID.QQ)
        // {
        //     // for(let i = 1; i < 11;i++)
		// 	// {
		// 	// 	GM.nativefiles.push("atlas/guanqia/" + i + ".atlas");
		// 	// 	GM.nativefiles.push("atlas/guanqia/" + i + ".png");
		// 	// }
        //     // Laya.URL.basePath = "https://img.kuwan511.com/brainOut/" + GM.resVer + "/";
		// 	// Laya.MiniAdpter.nativefiles = GM.nativefiles;
        // }
    }

    static setMusic():void
    {
        let musicState = Session.gameData[DataKey.musicState];
        Game.soundManager.setMusicVolume(musicState);
        GM.musicState = musicState;
    }

    static setSound():void
    {
        let soundState = Session.gameData[DataKey.soundState];
        Game.soundManager.setSoundVolume(soundState);
        GM.soundState = soundState;
    }

    static setShake():void
    {
        let shakeState = Session.gameData[DataKey.shakeState];
        GM.shakeState = shakeState;
    }

    static playMusic(musicUrl):void
    {
        if(GM.musicState == 1)
        {
            Game.soundManager.play(musicUrl,true);
        }
    }

    static playSound(soundUrl:string):void
    {
        if(GM.soundState == 1)
        {
            Laya.SoundManager.setSoundVolume( 1 );
            Game.soundManager.play(soundUrl);
        }
    }
    
    static startGame():void
    {
        Game.layerManager.addChild(new InitView());
    }

    static log(message):void
    {
        // console.log("%c" + message, "color:green");
        console.log(message);
    }

    static addLog(str):void
    {
        // Game.layerManager.logTxt.text += str + "\n";
        console.log(str);
    }

    static indexNum;

    static onReg():void
    {
        // Game.tableManager.register(SysTitles.NAME , SysTitles );
        
        let REG: Function = Laya.ClassUtils.regClass;
		//界面
        REG(ViewID.main, MainView);
        REG(ViewID.setting, SettingView);
        REG(ViewID.cells, CellsView);
        REG(ViewID.signin,SigninView);
        //关卡
        let CLAS:any[] = [
            Level_1,Level_2,Level_3,Level_4,Level_5,Level_6,Level_7,Level_8,Level_9,Level_10,
            Level_11,Level_12,Level_13,Level_14,Level_15,Level_16,Level_17,Level_18,Level_19,Level_20,
            Level_21,Level_22,Level_23,Level_24,Level_25,Level_26,Level_27,Level_28,Level_29,Level_30,
            Level_31,Level_32,Level_33,Level_34,Level_35,Level_36,Level_37,Level_38,Level_39,Level_40,
            Level_41,Level_42,Level_43,Level_44,Level_45,Level_46,Level_47,Level_48,Level_49,Level_50,
            Level_51,Level_52,Level_53,Level_54,Level_55,Level_56,Level_57,Level_58,Level_59,Level_60,
            Level_61,Level_62,Level_63,Level_64,Level_65,Level_66,Level_67,Level_68,Level_69,Level_70,
            Level_71,Level_72,Level_73,Level_74,Level_75,Level_76,Level_77,Level_78,Level_79,Level_80
        ];

        // if(!GM.fromOtherGame)
        // {
        //     CLAS.length = 40;
        // }

        let index:number = 1;
        for(let i = 0; i < CLAS.length; i++)
        {
            REG(index, CLAS[i]);
            GM.indexNum = index;
            index++;

        }
    }

    static hit(b0:Laya.Sprite , b1:Laya.Sprite):boolean{
        return b0.x < b1.x + b1.width &&
        b0.x + b0.width > b1.x &&
        b0.y < b1.y + b1.height &&
        b0.y + b0.height > b1.y
    }

    static hitPoint(tt:Laya.Sprite , box:Laya.Sprite):boolean{
        return tt.x >= box.x && tt.x <= box.x + box.width 
        && tt.y >= box.y && tt.y <= box.y + box.height;
    }

    static hitPoint2(xx,yy , box:Laya.Sprite):boolean{
        return xx >= box.x && xx <= box.x + box.width 
        && yy >= box.y && yy <= box.y + box.height;
    }

    static showTTBanner():void
    {
        if(GM.platformId == PlatformID.TT)
        {
            GM.platform.showBanner2();
        }
    }

    static hideTTBanner():void
    {
        if(GM.platformId == PlatformID.TT)
        {
            GM.platform.hideBanner();
        }
    }
}