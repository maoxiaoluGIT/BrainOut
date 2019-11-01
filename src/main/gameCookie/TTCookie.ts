import { BaseCookie } from "./BaseCookie";

export default class TTCookie extends BaseCookie {
    private tt;
    constructor() {
        super();
        this.tt = Laya.Browser.window.tt;
    }

    setCookie(code: string, data1: any): void {
        this.tt.setStorage({
            key: code,
            data: data1,
            success(res) {
            }
        });
    }

    getCookie(code: string, callback: any): void {
        this.tt.getStorage({
            key: code,
            success(res) {
                callback && callback(res.data);
            },
            fail(res){
                callback && callback(null);
            },
            complete(res){
            }
        })
    }

    removeCookie(code: string):void
    {
        this.tt.removeStorage({
            key: code,
            success (res) {
            }
          })
    }

    clearAll():void
    {
        this.tt.clearStorage();
    }
}