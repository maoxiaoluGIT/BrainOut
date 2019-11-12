export class BasePlatform{
    checkUpdate():void{};
    getUserInfo(callback):void{};
    login(callback):void{};
    onShare(callback,isMain):void{};
    shake(isRight:boolean):void{};
    playAd(codeId:string,type:number):void{};
    showBanner():void{};
    helpMe(index:number):void{}
}