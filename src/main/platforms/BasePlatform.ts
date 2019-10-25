export abstract  class BasePlatform{
    abstract checkUpdate():void;
    abstract getUserInfo(callback):void;
    abstract login(callback):void;
    abstract onShare(callback,isMain):void;
    abstract shake(isRight:boolean):void;
    abstract playAd(codeId:string,type:number):void;
    abstract showBanner(codeId:string):void;
}