import BaseHttp from "../../core/net/BaseHttp";
import GM from "../GM";
import Session from "../sessions/Session";
import Game from "../../core/Game";


/*
* name;
*/
export default class ReceiverHttp extends BaseHttp {
    constructor(hand:Laya.Handler) {
        super(hand);
    }

    static create(hand:Laya.Handler): ReceiverHttp {
        return new ReceiverHttp(hand);
    }

    send(): void {
        if(Session.SKEY)
        {
            super.send(GM.serverIP + "gamex3/get4","skey=" + Session.SKEY, "post", "text");
        }
    }

    onSuccess(data): void {
        super.onSuccess(data);
    }
}