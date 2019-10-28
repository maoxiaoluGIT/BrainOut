import Game from "./core/Game";
import GM from "./main/GM";
import Session from "./main/sessions/Session";

export default class Log{
    public static onlyid = Math.random();
    constructor(){
        
    }

    public static init():void{
        
    }

    public static syslog( type:LOG_TYPE , content:string = "" ):void {
        var arr:Array<any> = [];
        arr.push( Date.now() );
        arr.push( GM.codeVer );
        arr.push( Session.SKEY );
        arr.push( 0 );
        arr.push( Log.onlyid );
        arr.push( type );
        arr.push( content );
        let str = arr.join( "\t" );
        Game.http( GM.serverIP + "gamex3/gamelog" ,"log=" + str ,"post" );
    }
}

export enum LOG_TYPE{
    REG = 0,
    LOGIN = 1
}