import Game from "../Game";
import GameSoundManager from "./GameSoundManager";

/*
* name;
*/
export default class SoundManager{
    public pre:string = "";
    private _sm:GameSoundManager = new GameSoundManager();
    constructor(){
    }

    public setMusicVolume(value:number):void
    {
        Laya.SoundManager.setMusicVolume( value );
        Laya.SoundManager.musicMuted = value == 0;
    }

    public setSoundVolume(value:number):void
    {
        Laya.SoundManager.setSoundVolume( value );
        Laya.SoundManager.soundMuted = value == 0;
    }

    
    public soundName:string;
    public isMusic:boolean;
    public play(soundName:string,isMusic:boolean = false):void
    {
        this.soundName = soundName;
        this.isMusic = isMusic;
        var url:string = this.pre + soundName;
        if( isMusic ){
            this._sm.playBgm( url );
        }else{
            this._sm.playEffect( url );
        }
        // if(Laya.loader.getRes(url))
        // {
        //     this.onLoadCom(url,isMusic);
        // }
        // else
        // {
        //     Laya.loader.load(url,new Laya.Handler(this,this.onLoadCom,[url,isMusic]));
        // }
    }

    private onLoadCom(url,isMusic):void
    {
        if(isMusic)
        {
            Laya.SoundManager.playMusic(url,0);
        }
        else
        {
            Laya.SoundManager.playSound(url,1);
        }
    }

}