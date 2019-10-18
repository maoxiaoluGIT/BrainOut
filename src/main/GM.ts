import ViewManager from "./views/ViewManager";
import ImageEffect from "../core/utils/ImageEffect";
import { ViewID } from "./views/ViewID";
import MainView from "./views/main/MainView";
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
import Level_17 from "./levels/Level_17";
import Level_18 from "./levels/Level_18";
import Level_19 from "./levels/Level_19";
import Level_20 from "./levels/Level_20";
import ImageEffect2 from "../core/utils/ImageEffect2";

/**游戏总管理 */
export default class GM{
    static codeVer:string = "0.0.1.101701";
    static resVer:string = "0.0.1.101701";
    static userName:string;
    static platformId:number;
    static userHeadUrl:string;
    static isConsoleLog:number;
    static viewManager:ViewManager = new ViewManager();
    static imgEffect:ImageEffect = new ImageEffect();
    static imgEffect2:ImageEffect2 = new ImageEffect2();
    static cookie:BaseCookie;
    static platform:BasePlatform;
    static musicState:number = 1;
    static soundState:number = 1;
    static shakeState:number = 1;

    /**本地资源 */
    static nativefiles:string[] = ["loading/loding.png","loading/shuzi2.png","loading/jiazaizhong.png"];

    static setConfig(config):void
    {
        GM.isConsoleLog = config.isConsoleLog;
        GM.platformId = config.platformId;

        if(config.platformId == PlatformID.TEST)
        {
            GM.cookie = new TestCookie();
            GM.platform = new TestPlatform();
        }
        else if(config.platformId == PlatformID.WX)
        {
            GM.cookie = new WXCookie();
            GM.platform = new WXPlatform();
        }
        this.setMusic();
        this.setSound();
        this.setShake();
    }

    static setMusic():void
    {
        GM.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
			if (res == null) {
				GM.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                Game.soundManager.setMusicVolume(1);
                GM.musicState = 1;
			}
			else {
                Game.soundManager.setMusicVolume(res.state);
                GM.musicState = res.state;
			}
		});
    }

    static setSound():void
    {
        GM.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
			if (res == null) {
				GM.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                Game.soundManager.setSoundVolume(1);
                GM.soundState = 1;
			}
			else {
                Game.soundManager.setSoundVolume(res.state);
                GM.soundState = res.state;
			}
		});
    }

    static setShake():void
    {
        GM.cookie.getCookie(CookieKey.SHAKE_SWITCH, (res) => {
			if (res == null) {
                GM.cookie.setCookie(CookieKey.SHAKE_SWITCH, { "state": 1 });
                GM.shakeState = 1;
			}
			else {
                GM.shakeState = res.state;
			}
		});
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

    static log(message?: any, ...optionalParams: any[]):void
    {
        if(GM.isConsoleLog == 1)
        {
            console.log(message,optionalParams);
        }
    }

    static onReg():void
    {
        Game.tableManager.register(SysTitles.NAME , SysTitles );
        
        let REG: Function = Laya.ClassUtils.regClass;
		//界面
        REG(ViewID.main, MainView);
        REG(ViewID.setting, SettingView);
        REG(ViewID.cells, CellsView);
        //关卡
        let CLAS:any[] = [
            Level_1,Level_2,Level_3,Level_4,Level_5,Level_6,Level_7,Level_8,Level_9,Level_10,
            Level_11,Level_12,Level_13,Level_14,Level_15,Level_16,Level_17,Level_18,Level_19,Level_20];
        let index:number = 1;
        for(let i = 0; i < CLAS.length; i++)
        {
            REG(index, CLAS[i]);
            index++;
        }
    }

    static hit(b0:Laya.Sprite , b1:Laya.Sprite):boolean{
        return b0.x < b1.x + b1.width &&
        b0.x + b0.width > b1.x &&
        b0.y < b1.y + b1.height &&
        b0.y + b0.height > b1.y
    }
}