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

/**游戏总管理 */
export default class GM{
    static codeVer:string = "0.0.1.10231800";
    static resVer:string = "0.0.1.10231800";
    static isConsoleLog:number;
    static platformId:number;
    static serverIP:string;

    static userName:string;
    static userHeadUrl:string;
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
        GM.platformId = config.platformId;
        GM.serverIP = config.platforms[GM.platformId];

        if(config.platformId == PlatformID.TEST || config.platformId == PlatformID.H5)
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

    static log(message):void
    {
        console.log("%c" + message, "color:green");
    }

    static indexNum;

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
            Level_11,Level_12,Level_13,Level_14,Level_15,Level_16,Level_17,Level_18,Level_19,Level_20,
            Level_21,Level_22,Level_23,Level_24,Level_25,Level_26,Level_27,Level_28,Level_29,Level_30,
            Level_31,Level_32,Level_33,Level_34,Level_35
        ];
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
}