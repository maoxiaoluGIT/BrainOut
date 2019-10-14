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
    GameConfig.startScene = "shengli.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = false;
    GameConfig.init();

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
                dataList.sort((a, b) => {
                    return a.id - b.id;
                });
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
        class level1UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level1UI.uiView);
            }
        }
        level1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 454, "x": 123.5, "width": 184, "var": "item0", "skin": "guanqia/1/3_pic_3_1.png", "height": 173 }, "compId": 6 }, { "type": "Image", "props": { "y": 860, "x": 397, "width": 282, "var": "item3", "skin": "guanqia/1/apple.png", "height": 282, "alpha": 1 }, "compId": 7 }, { "type": "Image", "props": { "y": 794, "x": 92.5, "width": 215, "var": "item2", "skin": "guanqia/1/pic_20_1.png", "height": 256 }, "compId": 8 }, { "type": "Image", "props": { "y": 543.5, "x": 443, "width": 222, "var": "item1", "skin": "guanqia/1/pic_20_2.png", "height": 167 }, "compId": 9 }], "loadList": ["guanqia/1/3_pic_3_1.png", "guanqia/1/apple.png", "guanqia/1/pic_20_1.png", "guanqia/1/pic_20_2.png"], "loadList3D": [] };
        ui.level1UI = level1UI;
        REG("ui.level1UI", level1UI);
        class level2UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level2UI.uiView);
            }
        }
        level2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "2.jpg" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 485, "x": 366, "width": 112, "var": "3", "texture": "guanqia/2/pic_157_2.png", "height": 155 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 526, "x": 148, "width": 56, "var": "6", "texture": "guanqia/2/pic_157_1.png", "height": 96 }, "compId": 14 }, { "type": "Sprite", "props": { "y": 608, "x": 509, "width": 186, "var": "1", "texture": "guanqia/2/pic_157_2.png", "height": 257 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 583, "x": 408, "width": 135, "var": "2", "texture": "guanqia/2/pic_157_2.png", "height": 187 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 504, "x": 267, "width": 101, "var": "4", "texture": "guanqia/2/pic_157_2.png", "height": 140 }, "compId": 8 }, { "type": "Sprite", "props": { "y": 553.5, "x": 184, "width": 86, "var": "5", "texture": "guanqia/2/pic_157_2.png", "height": 119 }, "compId": 9 }, { "type": "Sprite", "props": { "y": 509, "x": 97, "width": 56, "var": "7", "texture": "guanqia/2/pic_157_2.png", "height": 77 }, "compId": 10 }, { "type": "Sprite", "props": { "y": 452, "x": 56, "width": 50, "var": "9", "texture": "guanqia/2/pic_157_2.png", "height": 69 }, "compId": 11 }, { "type": "Sprite", "props": { "y": 447, "x": -6, "width": 37, "var": "10", "texture": "guanqia/2/pic_157_2.png", "height": 51 }, "compId": 12 }, { "type": "Sprite", "props": { "y": 438, "x": 165, "width": 50, "var": "8", "texture": "guanqia/2/pic_157_2.png", "scaleX": -1, "height": 69 }, "compId": 13 }, { "type": "Button", "props": { "y": 891, "x": 86, "width": 282, "var": "ba", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "8", "height": 125 }, "compId": 15 }, { "type": "Button", "props": { "y": 1054, "x": 402, "width": 282, "var": "shiyi", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "11", "height": 125 }, "compId": 16 }, { "type": "Button", "props": { "y": 1054, "x": 93, "width": 282, "var": "shi", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "10", "height": 125 }, "compId": 17 }, { "type": "Button", "props": { "y": 891, "x": 402, "width": 282, "var": "jiu", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "9", "height": 125 }, "compId": 18 }], "loadList": ["2.jpg", "guanqia/2/pic_157_2.png", "guanqia/2/pic_157_1.png", "pubRes/btn_1.png", "pubRes/btn_2.png"], "loadList3D": [] };
        ui.level2UI = level2UI;
        REG("ui.level2UI", level2UI);
        class level3UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level3UI.uiView);
            }
        }
        level3UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 1003, "x": 478, "width": 178, "var": "5", "texture": "guanqia/3/pic_12_6.png", "height": 161 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 873, "x": 82, "width": 270, "var": "4", "texture": "guanqia/3/pic_23_1.png", "height": 310 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 427, "x": 431.5, "width": 271, "var": "3", "texture": "guanqia/3/pic_23_2 2.png", "height": 389 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 562, "x": 145.5, "width": 143, "var": "2", "texture": "guanqia/3/pic_38_1 2.png", "height": 161 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 186, "x": 26, "width": 191, "var": "1", "texture": "guanqia/3/pic_7_4.png", "height": 179 }, "compId": 8 }], "loadList": ["guanqia/3/pic_12_6.png", "guanqia/3/pic_23_1.png", "guanqia/3/pic_23_2 2.png", "guanqia/3/pic_38_1 2.png", "guanqia/3/pic_7_4.png"], "loadList3D": [] };
        ui.level3UI = level3UI;
        REG("ui.level3UI", level3UI);
        class mainuiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mainuiUI.uiView);
            }
        }
        mainuiUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 25, "x": 559, "width": 171, "skin": "pubRes/qiandi.png", "sizeGrid": "0,44,0,42", "height": 78 }, "compId": 10 }, { "type": "Image", "props": { "y": 29, "x": 30, "width": 75, "var": "shezhi", "skin": "pubRes/ic_setting_1.png", "height": 73 }, "compId": 3 }, { "type": "Image", "props": { "y": 31, "x": 149, "width": 67, "var": "xuanguan", "skin": "pubRes/ic_list_1.png", "height": 71 }, "compId": 5 }, { "type": "Image", "props": { "y": 34, "x": 268, "width": 64, "var": "shuaxin", "skin": "pubRes/ic_reset_1.png", "height": 64 }, "compId": 6 }, { "type": "Image", "props": { "y": 34, "x": 383, "width": 70, "var": "kuaijin", "skin": "pubRes/ic_skip_1.png", "height": 59 }, "compId": 7 }, { "type": "Image", "props": { "y": 27, "x": 572, "width": 82, "var": "jinyaoshi", "skin": "pubRes/ic_key_1.png", "height": 80 }, "compId": 8 }, { "type": "Text", "props": { "y": 36, "x": 653, "width": 65, "var": "yaoshishu", "text": "2", "height": 60, "fontSize": 60, "runtime": "laya.display.Text" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 157, "x": 300, "texture": "pubRes/dengji.png" }, "compId": 12 }, { "type": "FontClip", "props": { "y": 159, "x": 401, "var": "dengjishuzi", "value": "1", "skin": "pubRes/shuzi.png", "sheet": "01234 56789" }, "compId": 17 }, { "type": "Text", "props": { "y": 249, "x": 34, "width": 678, "var": "titleTxt", "text": "哪个最大？", "height": 96, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 19 }], "loadList": ["pubRes/qiandi.png", "pubRes/ic_setting_1.png", "pubRes/ic_list_1.png", "pubRes/ic_reset_1.png", "pubRes/ic_skip_1.png", "pubRes/ic_key_1.png", "pubRes/dengji.png", "pubRes/shuzi.png"], "loadList3D": [] };
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
        class rightIconUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(rightIconUI.uiView);
            }
        }
        rightIconUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "var": "icon", "skin": "pubRes/ic_choice.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["pubRes/ic_choice.png"], "loadList3D": [] };
        ui.rightIconUI = rightIconUI;
        REG("ui.rightIconUI", rightIconUI);
        class shengliUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(shengliUI.uiView);
            }
        }
        shengliUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "bgColor": "#ffffff", "alpha": 0.75 }, "compId": 20 }, { "type": "Image", "props": { "y": 328, "x": 47, "width": 656, "skin": "pubRes/fram_big.png", "height": 297 }, "compId": 3 }, { "type": "Image", "props": { "y": 398, "x": 192, "width": 366, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,216,0,121", "height": 87 }, "compId": 5 }, { "type": "Button", "props": { "y": 667, "x": 398, "width": 305, "stateNum": 1, "skin": "pubRes/btn_3.png", "labelStrokeColor": "‘", "labelSize": 40, "labelPadding": "10,10,10,40", "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 15, "child": [{ "type": "Sprite", "props": { "y": 25, "x": 48, "width": 69, "var": "ads", "texture": "pubRes/ic_ad_1.png", "height": 74 }, "compId": 10 }, { "type": "Sprite", "props": { "y": -24, "x": 180, "width": 134, "texture": "pubRes/hongyuan.png", "height": 69 }, "compId": 17, "child": [{ "type": "Text", "props": { "y": 16, "x": 6, "width": 127, "text": "+提示", "height": 50, "fontSize": 40, "align": "center", "runtime": "laya.display.Text" }, "compId": 18 }] }] }, { "type": "Text", "props": { "y": 416.5, "x": 248, "width": 254, "var": "zi1", "text": "恭喜你呀！", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Text", "props": { "y": 513, "x": 99, "width": 539, "var": "zi2", "text": "恭喜你呀！", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 7 }, { "type": "Button", "props": { "y": 667, "x": 53, "width": 305, "var": "ba", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 9 }, { "type": "Image", "props": { "y": 857, "x": 0, "width": 752, "var": "paishou", "skin": "pubRes/pic_hand_1.png", "height": 477 }, "compId": 19 }], "loadList": ["pubRes/fram_big.png", "pubRes/top_yellow.png", "pubRes/btn_3.png", "pubRes/ic_ad_1.png", "pubRes/hongyuan.png", "pubRes/btn_1.png", "pubRes/pic_hand_1.png"], "loadList3D": [] };
        ui.shengliUI = shengliUI;
        REG("ui.shengliUI", shengliUI);
        class wrongIconUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(wrongIconUI.uiView);
            }
        }
        wrongIconUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 10, "x": 10, "var": "icon", "skin": "pubRes/ic_wrong.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["pubRes/ic_wrong.png"], "loadList3D": [] };
        ui.wrongIconUI = wrongIconUI;
        REG("ui.wrongIconUI", wrongIconUI);
    })(ui || (ui = {}));

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

    class ImageEffect {
        constructor() {
            this.arr = [];
        }
        start() {
            Laya.timer.loop(300, this, this.onUpdate);
        }
        onUpdate() {
            let vo;
            let img;
            let arr1;
            let s1;
            let s2;
            for (let i = 0; i < this.arr.length; i++) {
                vo = this.arr[i];
                img = vo.spr;
                arr1 = img.skin.split(".");
                if (arr1.length == 2) {
                    s1 = arr1[0];
                    s2 = arr1[1];
                    s1 = s1.substr(0, s1.length - 1);
                    img.skin = s1 + vo.curTimes + "." + s2;
                    vo.curTimes++;
                    if (vo.curTimes > vo.times) {
                        vo.curTimes = 1;
                    }
                }
            }
        }
        addEffect(spr, times = 3) {
            let vo = new EffectVO();
            vo.spr = spr;
            vo.times = times;
            vo.curTimes = 1;
            spr.on(Laya.Event.DISPLAY, this, this.onDis, [vo]);
            spr.on(Laya.Event.UNDISPLAY, this, this.onUndis, [vo]);
        }
        onDis(vo) {
            this.arr.push(vo);
        }
        onUndis(vo) {
            for (let i = 0; i < this.arr.length; i++) {
                let tvo = this.arr[i];
                if (tvo && tvo == vo) {
                    this.arr[i] = null;
                    this.arr.splice(i, 1);
                }
            }
        }
    }
    class EffectVO {
    }

    class GM {
        static log(message, ...optionalParams) {
            if (GM.isConsoleLog == 1) {
                console.log(message, optionalParams);
            }
        }
    }
    GM.viewManager = new ViewManager();
    GM.imgEffect = new ImageEffect();

    class GameEvent {
    }
    GameEvent.SHOW_RIGHT = "SHOW_RIGHT";
    GameEvent.ON_NEXT = "ON_NEXT";
    GameEvent.ON_REFRESH = "ON_REFRESH";

    class MainFace extends ui.mainuiUI {
        constructor() {
            super();
            this.shezhi.on(Laya.Event.CLICK, this, this.onClick, [1]);
            this.xuanguan.on(Laya.Event.CLICK, this, this.onClick, [2]);
            this.shuaxin.on(Laya.Event.CLICK, this, this.onClick, [3]);
            this.kuaijin.on(Laya.Event.CLICK, this, this.onClick, [4]);
            GM.imgEffect.addEffect(this.shezhi);
            GM.imgEffect.addEffect(this.xuanguan);
            GM.imgEffect.addEffect(this.shuaxin);
            GM.imgEffect.addEffect(this.kuaijin);
            GM.imgEffect.addEffect(this.jinyaoshi);
            this.mouseThrough = true;
        }
        setTitle(sys) {
            this.titleTxt.text = sys.stageQuestion;
            this.dengjishuzi.value = "" + sys.id;
        }
        onClick(type) {
            if (type == 1) ;
            else if (type == 2) ;
            else if (type == 3) {
                Game.eventManager.event(GameEvent.ON_REFRESH);
            }
        }
    }

    class RightIcon extends ui.rightIconUI {
        constructor() {
            super();
        }
        add(parentSpr) {
            parentSpr && parentSpr.addChild(this);
            this.pos(parentSpr.width * 0.5, parentSpr.height * 0.5);
            this.icon.scale(0, 0);
            let t = new Laya.TimeLine();
            t.to(this.icon, { scaleX: 0.4, scaleY: 0.4 }, 100);
            t.to(this.icon, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.backOut);
            t.play();
        }
    }

    class WrongIcon extends ui.wrongIconUI {
        constructor() { super(); }
        add(parentSpr) {
            parentSpr && parentSpr.addChild(this);
            this.pos(parentSpr.width * 0.5, parentSpr.height * 0.5);
            this.icon.scale(0, 0);
            this.icon.scale(0, 0);
            let t = new Laya.TimeLine();
            t.to(this.icon, { scaleX: 0.4, scaleY: 0.4 }, 100);
            t.to(this.icon, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.backOut);
            t.to(this.icon, { scaleX: 0, scaleY: 0 }, 400);
            t.play();
        }
    }

    class RightView extends ui.shengliUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            GM.imgEffect.addEffect(this.paishou, 2);
        }
        onDis() {
            this.paishou.y = 1334;
            Laya.Tween.to(this.paishou, { y: 857 }, 500, null, Laya.Handler.create(this, this.onEff), 600);
        }
        onEff() {
        }
        setWin(sys) {
            this.zi2.text = sys.stageWin;
        }
    }

    class MyEffect {
        constructor() {
        }
        static light(sp) {
            let obj = {};
            obj.v = 100;
            let t = new Laya.Tween();
            let f = new Laya.ColorFilter();
            let farr = [f];
            t.to(obj, { v: 0, update: new Laya.Handler(null, () => {
                    f.reset();
                    f.adjustBrightness(obj.v);
                    sp.filters = farr;
                }) }, 1000);
        }
        static rotation(a, time = 100) {
            let t = new Laya.Tween();
            t.repeat = 0;
            a.once(Laya.Event.DISPLAY, null, () => {
                t.to(a, { rotation: 360 }, time);
            });
            a.once(Laya.Event.UNDISPLAY, null, () => {
                Laya.Tween.clearTween(a);
            });
        }
        static initBtnEffect() {
            Laya.stage.on(Laya.Event.CLICK, null, MyEffect.clickFun);
        }
        static clickFun(e) {
            if (e.target instanceof Laya.Button) {
                if (e.target.anchorX == 0.5 && e.target.anchorY == 0.5) {
                    MyEffect.clickEffect(e.target);
                }
            }
        }
        static clickEffect(sp) {
            let t = new Laya.Tween();
            let s = ((sp.scaleX > 0) ? 1 : -1);
            t.from(sp, { scaleX: 0.9 * s, scaleY: 0.9 }, 80);
        }
        static hide(e, time = 500) {
            let t = new Laya.Tween();
            t.to(e, { alpha: 0 }, time);
        }
        static show(e, time = 500) {
            let t = new Laya.Tween();
            t.to(e, { alpha: 1 }, time);
        }
        static flash(e, time = 500) {
            e.alpha = 0;
            let t = new Laya.TimeLine();
            t.to(e, { alpha: 1 }, time);
            t.to(e, { alpha: 0 }, time);
            t.play(0, true);
            MyEffect.clearTween(e);
        }
        static clearTween(e) {
            e.once(Laya.Event.UNDISPLAY, null, () => {
                Laya.Tween.clearAll(e);
            });
        }
        static scaleEffect(sp) {
            let t = new Laya.TimeLine();
            t.to(sp, { scaleX: 0.7, scaleY: 0.7 }, 100);
            t.to(sp, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.backOut);
            t.play();
        }
        static bigSmall(sp, big, small) {
            let t = new Laya.TimeLine();
            t.to(sp, { scaleX: big, scaleY: big }, 100);
            t.to(sp, { scaleX: small, scaleY: small }, 300, Laya.Ease.backOut);
            t.play();
        }
        static popup(v, s, time, delay) {
            let t = new Laya.Tween();
            v.scale(0, 0);
            t.to(v, { scaleX: s, scaleY: s }, time, Laya.Ease.backOut, null, delay);
        }
    }

    class MainView extends ui.mainViewUI {
        constructor() {
            super();
            this._box = new Laya.Box();
            this.addChild(this._box);
            this._mainFace = new MainFace();
            this.addChild(this._mainFace);
            this.showLevel(1);
            RightIcon.ins = new RightIcon();
            WrongIcon.ins = new WrongIcon();
            Game.eventManager.on(GameEvent.SHOW_RIGHT, this, this.showRight);
            Game.eventManager.on(GameEvent.ON_NEXT, this, this.onNext);
            Game.eventManager.on(GameEvent.ON_REFRESH, this, this.onRefresh);
        }
        onRefresh() {
            this.curView.refresh();
        }
        showRight() {
            if (!this._rightView) {
                this._rightView = new RightView();
            }
            this.addChild(this._rightView);
            this._rightView.anchorX = this._rightView.anchorY = 0.5;
            this._rightView.pos(GameConfig.width * 0.5, GameConfig.height * 0.5);
            MyEffect.popup(this._rightView, 1, 500, 100);
            this._rightView.setWin(this.curView.sys);
        }
        onNext() {
            this.curLv++;
            this.showLevel(this.curLv);
        }
        showLevel(lv) {
            this._box.removeChildren();
            this.curLv = lv;
            let VIEW = Laya.ClassUtils.getClass(lv + "");
            this.curView = new VIEW();
            this.curView.onShow(lv, this._box);
            this._mainFace.setTitle(this.curView.sys);
        }
    }

    var ViewID;
    (function (ViewID) {
        ViewID[ViewID["main"] = 1001] = "main";
    })(ViewID || (ViewID = {}));

    class SysTitles {
        constructor() {
            this.id = 0;
            this.stageLv = 0;
            this.stageQuestion = '';
            this.stageTips = '';
            this.stageWin = '';
        }
    }
    SysTitles.NAME = "sys_titles.txt";

    class BaseLevel extends Laya.Box {
        constructor() {
            super();
        }
        onInit() {
        }
        refresh() {
        }
        onRight() {
            Game.eventManager.event(GameEvent.SHOW_RIGHT, this.sys);
        }
        onShow(level, parentBox) {
            this.sys = Game.tableManager.getDataByNameAndId(SysTitles.NAME, level);
            parentBox && parentBox.addChild(this);
            Laya.loader.load("res/atlas/guanqia/" + level + ".atlas", Laya.Handler.create(this, this.onInit));
        }
    }

    class Level_1 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level1UI();
            this.addChild(this.ui);
            for (let i = 0; i < 4; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            let skins = Level_1.itemskins;
            skins.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
            });
            for (let i = 0; i < skins.length; i++) {
                let obj = skins[i];
                let itemImg = this.ui["item" + i];
                itemImg.skin = obj.skin;
                itemImg.tag = obj.right;
                itemImg.size(obj.ww, obj.hh);
            }
        }
        addEvent(img, func) {
            img.on(Laya.Event.CLICK, this, func, [img]);
        }
        onClick(img) {
            if (img.tag == 1) {
                RightIcon.ins.add(img);
                Laya.MouseManager.enabled = false;
                Laya.timer.once(500, this, this.onRight);
            }
            else {
                WrongIcon.ins.add(img);
            }
        }
    }
    Level_1.itemskins = [
        { skin: "guanqia/1/3_pic_3_1.png", right: 1, ww: 184, hh: 173 },
        { skin: "guanqia/1/pic_20_2.png", right: 0, ww: 222, hh: 167 },
        { skin: "guanqia/1/pic_20_1.png", right: 0, ww: 215, hh: 256 },
        { skin: "guanqia/1/apple.png", right: 0, ww: 282, hh: 282 }
    ];

    var Handler = Laya.Handler;
    var Loader = Laya.Loader;
    class ZipLoader {
        constructor() {
            this.handler = null;
            this.fileNameArr = [];
            this.resultArr = [];
        }
        static load(fileName, handler) {
            this.instance.loadFile(fileName, handler);
        }
        loadFile(fileName, handler) {
            this.handler = handler;
            Laya.loader.load(fileName, new Handler(this, this.zipFun), null, Loader.BUFFER);
        }
        zipFun(ab, handler) {
            this.handler = handler;
            Laya.Browser.window.JSZip.loadAsync(ab).then((jszip) => {
                this.analysisFun(jszip);
            });
        }
        analysisFun(jszip) {
            this.currentJSZip = jszip;
            for (var fileName in jszip.files) {
                this.fileNameArr.push(fileName + "");
            }
            this.exeOne();
        }
        exeOne() {
            this.currentJSZip.file(this.fileNameArr[0]).async('text').then((content) => {
                this.over(content);
            });
        }
        over(content) {
            var fileName = this.fileNameArr.shift();
            this.resultArr.push(fileName);
            this.resultArr.push(content);
            if (this.fileNameArr.length != 0) {
                this.exeOne();
            }
            else {
                this.handler.runWith([this.resultArr]);
            }
        }
    }
    ZipLoader.instance = new ZipLoader();

    class GameMain {
        constructor() {
        }
        static onInit() {
            let REG = Laya.ClassUtils.regClass;
            REG(ViewID.main, MainView);
            let CLAS = [Level_1];
            let index = 1;
            for (let i = 0; i < CLAS.length; i++) {
                REG(index, CLAS[i]);
                index++;
            }
            let arr = [{ url: "res/atlas/pubRes.atlas", type: Laya.Loader.ATLAS }, { url: "res/tables.zip", type: Laya.Loader.BUFFER }];
            Laya.loader.load(arr, Laya.Handler.create(this, GameMain.onCom));
        }
        static onCom() {
            ZipLoader.instance.zipFun(Laya.loader.getRes("res/tables.zip"), new Laya.Handler(this, this.zipFun));
        }
        static zipFun(arr) {
            Game.tableManager.register(SysTitles.NAME, SysTitles);
            Game.tableManager.onParse(arr);
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
            GM.imgEffect.start();
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
