export default class ImageEffect{

    private arr:EffectVO[] = [];
    constructor() {
        
    }

    start():void
    {
        Laya.timer.loop(300,this,this.onUpdate);
    }

    private onUpdate():void
    {
        let vo:EffectVO;
        let img:Laya.Image;
        let arr1:string[];
        let s1:string;
        let s2:string;
        for(let i = 0; i < this.arr.length; i++)
        {
            vo = this.arr[i];
            img = vo.spr;
            arr1 = img.skin.split(".");//pubRes/ic_setting_1.png
            if(arr1.length == 2)
            {
                s1 = arr1[0];
                s2 = arr1[1];
                s1 = s1.substr(0, s1.length - 1);

                img.skin = s1 + vo.curTimes + "." + s2;
                vo.curTimes++;
                if(vo.curTimes > vo.times)
                {
                    vo.curTimes = 1;
                }
            }
        }
    }

    addEffect(spr:Laya.Image,times:number = 3):void
    {
        // let vo = new EffectVO();
        // vo.spr = spr;
        // vo.times = times;
        // vo.curTimes = 1;
        // spr.on(Laya.Event.DISPLAY,this,this.onDis,[vo]);
        // spr.on(Laya.Event.UNDISPLAY,this,this.onUndis,[vo]);
    }

    addEffect2(spr:Laya.Image,times:number = 3):void
    {
        let vo = new EffectVO();
        vo.spr = spr;
        vo.times = times;
        vo.curTimes = 1;
        this.arr.push(vo);
    }

    removeEffect2(spr:Laya.Image):void
    {
        for(let i = 0; i < this.arr.length; i++)
        {
            let tvo:EffectVO = this.arr[i];
            if(tvo && tvo.spr == spr)
            {
                this.arr[i] = null;
                this.arr.splice(i,1);
            }
        }
    }

    private onDis(vo:EffectVO):void
    {
        this.arr.push(vo);
    }

    private onUndis(vo:EffectVO):void
    {
        for(let i = 0; i < this.arr.length; i++)
        {
            let tvo:EffectVO = this.arr[i];
            if(tvo && tvo == vo)
            {
                this.arr[i] = null;
                this.arr.splice(i,1);
            }
        }
    }
}

export class EffectVO{
    spr:Laya.Image;
    times:number;
    curTimes:number;
}