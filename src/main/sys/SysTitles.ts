export default class SysTitles{
    static NAME:string = "sys_titles.txt";
    static list:SysTitles[];
    static allData:any = {};

    public id:number = 0;
    public stageLv:number = 0;
    public stageQuestion:string= '';
    public stageTips:string = '';
    public stageWin:string = '';
}