import { BaseCookie } from "./BaseCookie";

export default class TestCookie extends BaseCookie {
    constructor() {
        super();
    }

    setCookie(code: string, data: any): void {
        Laya.LocalStorage.setJSON(code, data);
    }

    getCookie(code: string, callback: any): void {
        let data = Laya.LocalStorage.getJSON(code);
        callback && callback(data);
    }

    removeCookie(code: string):void
    {
        Laya.LocalStorage.removeItem(code);
    }

    clearAll():void
    {
        Laya.LocalStorage.clear();
    }
}