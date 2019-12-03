import PlatformID from "../platforms/PlatformID";
import { BasePlatform } from "../platforms/BasePlatform";
import BaseHttp from "../../core/net/BaseHttp";
import GM from "../GM";
import Session from "../sessions/Session";

/*
* name;
*/
export default class LoginHttp extends BaseHttp {
    
    private jsCode: string;
    constructor(hand:Laya.Handler) {
        super(hand);
    }

    static create(hand:Laya.Handler): LoginHttp {
        return new LoginHttp(hand);
    }

    public static FRONT:string = "";

    send(): void {
        let str:string = "gamex3/login";
        super.send(GM.serverIP + str, "scode=" + GM.platformId + "&jscode=" + LoginHttp.FRONT + this.jsCode, "post", "text");
    }

    onSuccess(data): void {
        Session.SKEY = data;
        super.onSuccess(data);
        GM.addLog("login success,key=" + Session.SKEY)
    }
    

    checkLogin(): void {
        GM.addLog("调用oppo的login");
        GM.platform.login((code:string)=>{
            GM.addLog("jsCode:" + code);
            this.jsCode = code;
            this.send();
        });
    }

}