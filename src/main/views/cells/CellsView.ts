import { ui } from "../../../ui/layaMaxUI";
import GM from "../../GM";
import { ViewID } from "../ViewID";
import CellItem from "./CellItem";
import Game from "../../../core/Game";
import SysTitles from "../../sys/SysTitles";

export default class CellsView extends ui.xuanguan1UI{
    
    private list:Laya.List;
    private _dataList:SysTitles[];
    constructor() { 
        super(); 
        GM.imgEffect.addEffect(this.fanhui,3);
        GM.imgEffect.addEffect(this.topImg,2);
        GM.imgEffect.addEffect(this.bottomImg,2);

        this.fanhui.on(Laya.Event.CLICK,this,this.onClick);

        this.list = new Laya.List();
        this.list.itemRender = CellItem;

		this.list.repeatX = 2;
        this.list.repeatY = 3;
        this.list.spaceX = 20;
        this.list.spaceY = 20;
        
		this.list.vScrollBarSkin = "";

        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.addChild(this.list);
        this.list.pos(30,150);
        
        this._dataList = SysTitles.list;
        this._dataList.length = GM.indexNum;
        this._dataList.push(null);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        GM.platform && GM.platform.InsertAd("142905");
        this.list.array = this._dataList;
    }

    private updateItem(cell:CellItem, index:number):void
    {
        cell.update(cell.dataSource);
    }

    private onClick():void
    {
        GM.viewManager.showView(ViewID.main);
    }
}