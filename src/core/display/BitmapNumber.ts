export default class BitmapNumber extends Laya.FontClip {
    static TAG:string = "BitmapNumber";
    constructor() { 
        super(); 
    }

    imgUrl:string;
    onInit(skin:string,sheet:string):void
    {
        if(this.imgUrl)
        {
            return;
        }
        this.imgUrl = skin;
        this.skin = skin;
        this.sheet = sheet;
        this.anchorX = this.anchorY = 0.5;
    }

    static getFontClip(tScale:number = 1,skin:string = "main/clipshuzi.png",sheet?:string):BitmapNumber
    {
        let bn:BitmapNumber = Laya.Pool.getItemByClass(BitmapNumber.TAG + skin,BitmapNumber);
        bn.onInit(skin,sheet ? sheet : "123456 7890-+ /:cdef");
        bn.scale(tScale ? tScale : 1,tScale ? tScale : 1);
        return bn;
    }

    recover():void
    {
        this.removeSelf();
        Laya.Pool.recover(BitmapNumber.TAG + this.imgUrl,this);
    }

}