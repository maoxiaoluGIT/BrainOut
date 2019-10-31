import GM from "./GM";
import Session from "./sessions/Session";
import Game from "../core/Game";


export default class Log{
    public static onlyid = Math.random();
    constructor(){
        
    }

    public static init():void{
        
    }

    public static syslog( type:number , content:string = "" ):void {
        var arr:Array<any> = [];
        arr.push( Date.now() );
        arr.push( GM.codeVer );
        arr.push( Session.SKEY );
        arr.push( 0 );
        arr.push( Log.onlyid );
        arr.push( type );
        arr.push( content );
        let str = arr.join( "\t" );
        Game.http( GM.serverIP + "gamex3/log" ,"log=" + str ,"post" );
    }
}