import BaseHttp from "../../core/net/BaseHttp";
import GM from "../GM";
import Session from "../sessions/Session";

/*
* name;
*/
export default class SenderHttp extends BaseHttp {
    constructor() {
        super(null);
    }

    static create(): SenderHttp {
        return new SenderHttp();
    }


    send(): void {
        let obj = Session.gameData;
        super.send(GM.serverIP + "gamex3/save4","skey=" + Session.SKEY + "&gamedata=" + JSON.stringify(obj), "post", "text");
    }

    onSuccess(data): void {
        super.onSuccess(data);
        GM.log("save success" +data);
    }
}