(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "mainui.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = false;
    GameConfig.init();

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class initViewUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(initViewUI.uiView);
            }
        }
        initViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Label", "props": { "y": 642, "x": 225, "width": 300, "var": "txt", "text": "0%", "height": 50, "fontSize": 36, "color": "#000000", "bold": true, "align": "center" }, "compId": 3 }], "loadList": [], "loadList3D": [] };
        ui.initViewUI = initViewUI;
        REG("ui.initViewUI", initViewUI);
        class mainuiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mainuiUI.uiView);
            }
        }
        mainuiUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 25, "x": 559, "width": 171, "skin": "pubRes/qiandi.png", "sizeGrid": "0,44,0,42", "height": 78 }, "compId": 10 }, { "type": "Image", "props": { "y": 29, "x": 30, "width": 75, "var": "shezhi", "skin": "pubRes/ic_setting_1.png", "height": 73 }, "compId": 3 }, { "type": "Image", "props": { "y": 31, "x": 149, "width": 67, "var": "xuanguan", "skin": "pubRes/ic_list_1.png", "height": 71 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 34, "x": 268, "width": 64, "var": "shuaxin", "texture": "pubRes/ic_reset_1.png", "height": 64 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 34, "x": 383, "width": 70, "var": "kuaijin", "texture": "pubRes/ic_skip_1.png", "height": 59 }, "compId": 7 }, { "type": "Image", "props": { "y": 27, "x": 572, "width": 82, "var": "jinyaoshi", "skin": "pubRes/ic_key_1.png", "height": 80 }, "compId": 8 }, { "type": "Text", "props": { "y": 36, "x": 653, "width": 65, "var": "yaoshishu", "text": "2", "height": 60, "fontSize": 60, "runtime": "laya.display.Text" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 157, "x": 300, "texture": "pubRes/dengji.png" }, "compId": 12 }, { "type": "FontClip", "props": { "y": 159, "x": 401, "var": "dengjishuzi", "value": "1", "skin": "pubRes/shuzi.png", "sheet": "01234 56789" }, "compId": 17 }], "loadList": ["pubRes/qiandi.png", "pubRes/ic_setting_1.png", "pubRes/ic_list_1.png", "pubRes/ic_reset_1.png", "pubRes/ic_skip_1.png", "pubRes/ic_key_1.png", "pubRes/dengji.png", "pubRes/shuzi.png"], "loadList3D": [] };
        ui.mainuiUI = mainuiUI;
        REG("ui.mainuiUI", mainuiUI);
        class mainViewUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mainViewUI.uiView);
            }
        }
        mainViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "loadList": [], "loadList3D": [] };
        ui.mainViewUI = mainViewUI;
        REG("ui.mainViewUI", mainViewUI);
    })(ui || (ui = {}));

    class MainFace extends ui.mainuiUI {
        constructor() { super(); }
    }

    class MainView extends ui.mainViewUI {
        constructor() {
            super();
            this._mainFace = new MainFace();
            this.addChild(this._mainFace);
        }
    }

    var ViewID;
    (function (ViewID) {
        ViewID[ViewID["main"] = 1001] = "main";
    })(ViewID || (ViewID = {}));

    var Sprite = Laya.Sprite;
    class LayerManager extends Sprite {
        constructor() {
            super();
            this.viewLayer = new Sprite();
            this.faceLayer = new Sprite();
            this.alertLayer = new Sprite();
            this.guideLayer = new Sprite();
            this.addChild(this.viewLayer);
            this.addChild(this.faceLayer);
            this.addChild(this.alertLayer);
            this.addChild(this.guideLayer);
        }
    }

    class TableManager {
        constructor() {
            this.map = {};
            this.mapList = {};
        }
        register(fileName, cla) {
            this.map[fileName] = cla;
        }
        getOneByName(fileName) {
            return this.map[fileName];
        }
        getTable(tabelId) {
            return this.mapList[tabelId];
        }
        getDataByNameAndId(tabelId, id) {
            var arr = this.getTable(tabelId);
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].id == id) {
                    return arr[i];
                }
            }
        }
        onParse(arr) {
            for (var i = 0; i < arr.length; i += 2) {
                var keyname = arr[i];
                var Cla = this.getOneByName(keyname);
                console.log(keyname);
                if (Cla == null) {
                    console.error("没有注册表-------" + keyname);
                    continue;
                }
                var contente = arr[i + 1];
                var strary = contente.split("\n");
                var tmp = strary[strary.length - 1];
                if (tmp === "") {
                    strary.pop();
                }
                var head = String(strary[0]).replace("\r", "");
                var headary = head.split("\t");
                var contentary = strary.slice(1);
                var dataList = [];
                for (var k = 0; k < contentary.length; k++) {
                    var propstr = String(contentary[k]).replace("\r", "");
                    var propary = propstr.split("\t");
                    var clazz = new Cla();
                    for (var j = 0, len2 = propary.length; j < len2; j++) {
                        var now = clazz[headary[j]];
                        var value = propary[j];
                        if (typeof now === 'number') {
                            now = parseInt(value + "");
                            if ((now + "") != value) {
                                now = parseFloat(value + "");
                            }
                        }
                        else {
                            now = value;
                        }
                        clazz[headary[j]] = now;
                    }
                    dataList.push(clazz);
                }
                this.mapList[keyname] = dataList;
            }
        }
    }

    class SoundManager {
        constructor() {
            this.pre = "";
        }
        setMusicVolume(value) {
            Laya.SoundManager.setMusicVolume(value);
            Laya.SoundManager.musicMuted = value == 0;
        }
        setSoundVolume(value) {
            Laya.SoundManager.setSoundVolume(value);
            Laya.SoundManager.soundMuted = value == 0;
        }
        play(soundName, isMusic = false) {
            this.soundName = soundName;
            this.isMusic = isMusic;
            var url = this.pre + soundName;
            if (Laya.loader.getRes(url)) {
                this.onLoadCom(url, isMusic);
            }
            else {
                Laya.loader.load(url, new Laya.Handler(this, this.onLoadCom, [url, isMusic]));
            }
        }
        onLoadCom(url, isMusic) {
            if (isMusic) {
                Laya.SoundManager.playMusic(url, 0);
            }
            else {
                Laya.SoundManager.playSound(url, 1);
            }
        }
    }

    class DialogManager {
        constructor() {
            this.dialogMap = {};
        }
        register(dialogName, dialogClass, res = null) {
            this.dialogMap[dialogName] = [dialogClass, res];
        }
        open(dialogName) {
            let arr = this.dialogMap[dialogName];
            Laya.loader.load(arr[1], new Laya.Handler(this, this.loaderFun, [dialogName]));
        }
        loaderFun(dialogName) {
            let arr = this.dialogMap[dialogName];
            let dc = arr[0];
            let a = new dc();
            a.popup(true, a.isShowEffect);
            a.once(Laya.Event.UNDISPLAY, this, this.undisFun, [a]);
        }
        undisFun(a) {
            a.destroy(true);
        }
    }

    class Game {
        static init() {
            Game.layerManager = new LayerManager();
            Laya.stage.addChild(Game.layerManager);
            Game.tableManager = new TableManager();
            Game.soundManager = new SoundManager();
        }
        static RandomByArray(arr, deleteArr = false) {
            let value = Math.random() * arr.length;
            let index = Math.floor(value);
            let resvalue = arr[index];
            if (deleteArr) {
                arr.splice(index, 1);
            }
            return resvalue;
        }
        static http(url, data, method, caller = null, listener = null, args = null) {
            var http = new Laya.HttpRequest();
            let arr = [];
            let str = "";
            if (typeof data === 'string') {
                str = data;
            }
            else {
                for (let k in data) {
                    arr.push(k + "=" + data[k]);
                }
                str = arr.join("&");
            }
            if (method == "GET") {
                url = url + "?" + str;
                data = null;
            }
            http.send(url, str, method);
            if (caller && listener) {
                http.once(Laya.Event.COMPLETE, caller, listener, args);
            }
            return http;
        }
    }
    Game.platformId = 0;
    Game.layerManager = null;
    Game.tableManager = null;
    Game.soundManager = null;
    Game.eventManager = new Laya.EventDispatcher();
    Game.dialogManager = new DialogManager();

    class ViewManager {
        constructor() {
            this.allView = {};
        }
        showView(viewId) {
            let curView = this.allView[viewId];
            if (curView == null) {
                let VIEW = Laya.ClassUtils.getClass(viewId + "");
                if (VIEW) {
                    this.allView[viewId] = new VIEW();
                }
            }
            curView = this.allView[viewId];
            Game.layerManager.viewLayer.removeChildren();
            Game.layerManager.viewLayer.addChild(curView);
        }
    }

    class GM {
        static log(message, ...optionalParams) {
            if (GM.isConsoleLog == 1) {
                console.log(message, optionalParams);
            }
        }
    }
    GM.viewManager = new ViewManager();

    class GameMain {
        constructor() {
        }
        static onInit() {
            let REG = Laya.ClassUtils.regClass;
            REG(ViewID.main, MainView);
            Laya.loader.load("res/atlas/pubRes.atlas", Laya.Handler.create(this, GameMain.onCom));
        }
        static onCom() {
            GM.viewManager.showView(ViewID.main);
        }
    }

    class Main {
        constructor() {
            Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.stage.bgColor = "#ffffff";
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.stat)
                Laya.Stat.show();
            Game.init();
            this._initView = new ui.initViewUI();
            Game.layerManager.addChild(this._initView);
            this._initView.txt.text = "0%";
            Laya.loader.load(["res/config.json"], Laya.Handler.create(this, this.onCom), new Laya.Handler(this, this.onProgress));
        }
        onProgress(value) {
            value = value * 100;
            this._initView.txt.text = value + "%";
        }
        onCom() {
            this._initView.removeSelf();
            let config = Laya.loader.getRes("res/config.json");
            GM.isConsoleLog = config.isConsoleLog;
            GameMain.onInit();
        }
    }
    new Main();

}());
