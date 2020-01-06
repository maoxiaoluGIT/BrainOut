export class BasePlatform{
    banner;
    checkUpdate():void{};
    getUserInfo(callback):void{};
    login(callback):void{};
    onShare(callback,isMain):void{};
    shake(isRight:boolean):void{};
    playAd(codeId:string,type:number):void{};
    showBanner(bannerId?:string):void{};
    helpMe(index:number):void{};
    recorder():void{}
    stopRecorder(hand?:Laya.Handler):void{}
    showBanner2():void{}
    hideBanner():void{}

    InsertAd(codeId?):void{}
}