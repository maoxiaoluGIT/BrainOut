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
    GameConfig.startScene = "level12.scene";
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
        class level10UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level10UI.uiView);
            }
        }
        level10UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": -95, "width": 940, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 8 }, { "type": "Sprite", "props": { "y": 397, "x": 4, "width": 562, "texture": "guanqia/10/pic_7_1.png", "height": 678 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 571.5, "x": 390, "var": "birdImg0", "texture": "guanqia/10/pic_7_2.png" }, "compId": 5 }, { "type": "Sprite", "props": { "y": 574, "x": 381, "var": "birdImg1", "texture": "guanqia/10/pic_7_3.png" }, "compId": 11 }, { "type": "Box", "props": { "y": 416, "x": 566, "width": 400, "var": "sunImg", "height": 400, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 111, "x": 105, "width": 189, "skin": "guanqia/10/pic_7_4.png", "height": 177 }, "compId": 6 }] }, { "type": "Box", "props": { "width": 750, "var": "blankBox", "mouseEnabled": false, "height": 1334, "bgColor": "#000000", "alpha": 0.75 }, "compId": 9 }, { "type": "Box", "props": { "y": 933, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/10/pic_7_1.png", "guanqia/10/pic_7_2.png", "guanqia/10/pic_7_3.png", "guanqia/10/pic_7_4.png"], "loadList3D": [] };
        ui.level10UI = level10UI;
        REG("ui.level10UI", level10UI);
        class level11UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level11UI.uiView);
            }
        }
        level11UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 896, "x": 166, "width": 420, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,181,0,173", "height": 74 }, "compId": 6 }, { "type": "Button", "props": { "y": 1032, "x": 145, "width": 468, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "sizeGrid": "0,122,0,123", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125 }, "compId": 4 }, { "type": "TextInput", "props": { "y": 906, "x": 218, "width": 318, "var": "shuru", "prompt": "输入答案", "height": 55, "fontSize": 40, "align": "center" }, "compId": 5 }, { "type": "FontClip", "props": { "y": 349, "x": 187, "width": 112, "value": "1", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 8 }, { "type": "FontClip", "props": { "y": 349, "x": 254, "width": 112, "value": "+", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 9 }, { "type": "FontClip", "props": { "y": 349, "x": 323, "width": 112, "value": "2", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 10 }, { "type": "FontClip", "props": { "y": 349, "x": 480, "width": 112, "value": "21", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 363.5, "x": 410, "texture": "guanqia/11/deng.png" }, "compId": 12 }, { "type": "FontClip", "props": { "y": 479, "x": 187, "width": 112, "value": "2", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 13 }, { "type": "FontClip", "props": { "y": 480, "x": 254, "width": 112, "value": "+", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 14 }, { "type": "FontClip", "props": { "y": 480, "x": 323, "width": 112, "value": "3", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 15 }, { "type": "FontClip", "props": { "y": 480, "x": 480, "width": 112, "value": "36", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 16 }, { "type": "Sprite", "props": { "y": 494, "x": 410, "texture": "guanqia/11/deng.png" }, "compId": 17 }, { "type": "FontClip", "props": { "y": 609, "x": 187, "width": 112, "value": "3", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 18 }, { "type": "FontClip", "props": { "y": 611, "x": 254, "width": 112, "value": "+", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 19 }, { "type": "FontClip", "props": { "y": 611, "x": 323, "width": 112, "value": "4", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 20 }, { "type": "FontClip", "props": { "y": 611, "x": 480, "width": 112, "value": "43", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 21 }, { "type": "Sprite", "props": { "y": 625, "x": 410, "texture": "guanqia/11/deng.png" }, "compId": 22 }, { "type": "FontClip", "props": { "y": 738, "x": 187, "width": 112, "value": "4", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 23 }, { "type": "FontClip", "props": { "y": 740, "x": 254, "width": 112, "value": "+", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 24 }, { "type": "FontClip", "props": { "y": 740, "x": 323, "width": 112, "value": "5", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "scaleY": 0.6, "scaleX": 0.6, "height": 79, "align": "center" }, "compId": 25 }, { "type": "Sprite", "props": { "y": 754, "x": 410, "texture": "guanqia/11/deng.png" }, "compId": 26 }, { "type": "Sprite", "props": { "y": 738, "x": 497, "texture": "guanqia/11/wen.png" }, "compId": 27 }, { "type": "Box", "props": { "y": 933, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 28 }], "loadList": ["pubRes/top_yellow.png", "pubRes/btn_2.png", "pubRes/shuzi2.png", "guanqia/11/deng.png", "guanqia/11/wen.png"], "loadList3D": [] };
        ui.level11UI = level11UI;
        REG("ui.level11UI", level11UI);
        class level12UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level12UI.uiView);
            }
        }
        level12UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 452, "x": 23, "width": 175, "var": "item0", "skin": "guanqia/12/pic_03_3.png", "height": 175 }, "compId": 5 }, { "type": "Image", "props": { "y": 442, "x": 274, "width": 176, "var": "item1", "skin": "guanqia/12/pic_.png", "height": 176 }, "compId": 4 }, { "type": "Image", "props": { "y": 433.5, "x": 512.5, "width": 193, "var": "item2", "skin": "guanqia/12/pic_20_1.png", "height": 193 }, "compId": 6 }, { "type": "Image", "props": { "y": 755, "width": 256, "var": "item3", "skin": "guanqia/12/pic_20_2.png", "height": 128 }, "compId": 7 }, { "type": "Image", "props": { "y": 705.5, "x": 274, "width": 227, "var": "item4", "skin": "guanqia/12/pic_20_3_1.png", "height": 227 }, "compId": 8 }, { "type": "Image", "props": { "y": 744, "x": 542, "width": 175, "var": "item5", "skin": "guanqia/12/pic_20_4.png", "height": 175 }, "compId": 9 }, { "type": "Box", "props": { "y": 735, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }, { "type": "FontClip", "props": { "y": 509, "x": -212, "var": "font0", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 11 }, { "type": "FontClip", "props": { "y": 519, "x": -202, "var": "font1", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 20 }, { "type": "FontClip", "props": { "y": 529, "x": -192, "var": "font2", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 21 }, { "type": "FontClip", "props": { "y": 539, "x": -182, "var": "font3", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 22 }, { "type": "FontClip", "props": { "y": 549, "x": -172, "var": "font4", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 23 }, { "type": "FontClip", "props": { "y": 559, "x": -162, "var": "font5", "value": "1", "skin": "pubRes/shuzi3.png", "sheet": "-+09 8765 4321", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 24 }], "loadList": ["guanqia/12/pic_03_3.png", "guanqia/12/pic_.png", "guanqia/12/pic_20_1.png", "guanqia/12/pic_20_2.png", "guanqia/12/pic_20_3_1.png", "guanqia/12/pic_20_4.png", "pubRes/shuzi3.png"], "loadList3D": [] };
        ui.level12UI = level12UI;
        REG("ui.level12UI", level12UI);
        class level13UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level13UI.uiView);
            }
        }
        level13UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 493, "x": 687, "width": 615, "texture": "guanqia/13/pic_37_3.png", "rotation": 90, "height": 615 }, "compId": 4 }, { "type": "Text", "props": { "y": 346, "x": 105, "width": 112, "var": "yaoshishu", "text": "小明：", "height": 47, "fontSize": 46, "runtime": "laya.display.Text" }, "compId": 5 }, { "type": "Text", "props": { "y": 346, "x": 452, "width": 74, "text": "你：", "height": 47, "fontSize": 46, "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Sprite", "props": { "y": 302, "x": 542, "texture": "guanqia/13/quan.jpg" }, "compId": 7 }, { "type": "Sprite", "props": { "y": 306, "x": 241, "texture": "guanqia/13/cha.jpg" }, "compId": 8 }], "loadList": ["guanqia/13/pic_37_3.png", "guanqia/13/quan.jpg", "guanqia/13/cha.jpg"], "loadList3D": [] };
        ui.level13UI = level13UI;
        REG("ui.level13UI", level13UI);
        class level14UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level14UI.uiView);
            }
        }
        level14UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 419, "x": 27, "width": 336, "var": "1", "texture": "guanqia/14/pic_42_1.png", "height": 336 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 315, "x": 399, "width": 348, "var": "2", "texture": "guanqia/14/pic_42_1.png", "height": 348 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 633, "x": 351, "width": 348, "var": "3", "texture": "guanqia/14/pic_42_1.png", "height": 348 }, "compId": 6 }], "loadList": ["guanqia/14/pic_42_1.png"], "loadList3D": [] };
        ui.level14UI = level14UI;
        REG("ui.level14UI", level14UI);
        class level15UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level15UI.uiView);
            }
        }
        level15UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 459, "x": 127, "texture": "guanqia/15/pic_8_1.png" }, "compId": 3 }], "loadList": ["guanqia/15/pic_8_1.png"], "loadList3D": [] };
        ui.level15UI = level15UI;
        REG("ui.level15UI", level15UI);
        class level16UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level16UI.uiView);
            }
        }
        level16UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "16.jpg" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 471, "x": 198, "width": 350, "texture": "guanqia/16/3_pic_24_1.png", "height": 369 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 438, "x": 184, "width": 378, "texture": "guanqia/16/3_pic_24_2.png", "height": 190 }, "compId": 5 }, { "type": "Image", "props": { "y": 884, "x": 165, "width": 420, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,181,0,173", "height": 74 }, "compId": 6 }, { "type": "Button", "props": { "y": 1020, "x": 144, "width": 468, "var": "shi", "stateNum": 1, "skin": "pubRes/btn_2.png", "sizeGrid": "0,122,0,123", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125 }, "compId": 7 }, { "type": "TextInput", "props": { "y": 894, "x": 217, "width": 318, "var": "shuru", "text": "输入答案", "prompt": "输入答案", "height": 55, "fontSize": 40, "align": "center" }, "compId": 8 }], "loadList": ["16.jpg", "guanqia/16/3_pic_24_1.png", "guanqia/16/3_pic_24_2.png", "pubRes/top_yellow.png", "pubRes/btn_2.png"], "loadList3D": [] };
        ui.level16UI = level16UI;
        REG("ui.level16UI", level16UI);
        class level2UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level2UI.uiView);
            }
        }
        level2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 485, "x": 366, "width": 112, "var": "3", "texture": "guanqia/2/pic_157_2.png", "height": 155 }, "compId": 7 }, { "type": "Sprite", "props": { "y": 526, "x": 148, "width": 56, "var": "6", "texture": "guanqia/2/pic_157_1.png", "height": 96 }, "compId": 14 }, { "type": "Sprite", "props": { "y": 608, "x": 509, "width": 186, "var": "1", "texture": "guanqia/2/pic_157_2.png", "height": 257 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 583, "x": 408, "width": 135, "var": "2", "texture": "guanqia/2/pic_157_2.png", "height": 187 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 504, "x": 267, "width": 101, "var": "4", "texture": "guanqia/2/pic_157_2.png", "height": 140 }, "compId": 8 }, { "type": "Sprite", "props": { "y": 553.5, "x": 184, "width": 86, "var": "5", "texture": "guanqia/2/pic_157_2.png", "height": 119 }, "compId": 9 }, { "type": "Sprite", "props": { "y": 509, "x": 97, "width": 56, "var": "7", "texture": "guanqia/2/pic_157_2.png", "height": 77 }, "compId": 10 }, { "type": "Sprite", "props": { "y": 452, "x": 56, "width": 50, "var": "9", "texture": "guanqia/2/pic_157_2.png", "height": 69 }, "compId": 11 }, { "type": "Sprite", "props": { "y": 447, "x": -6, "width": 37, "var": "10", "texture": "guanqia/2/pic_157_2.png", "height": 51 }, "compId": 12 }, { "type": "Sprite", "props": { "y": 438, "x": 165, "width": 50, "var": "8", "texture": "guanqia/2/pic_157_2.png", "scaleX": -1, "height": 69 }, "compId": 13 }, { "type": "Button", "props": { "y": 891, "x": 86, "width": 282, "var": "item0", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "8", "height": 125 }, "compId": 15 }, { "type": "Button", "props": { "y": 1054, "x": 402, "width": 282, "var": "item3", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "11", "height": 125 }, "compId": 16 }, { "type": "Button", "props": { "y": 1054, "x": 93, "width": 282, "var": "item2", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "10", "height": 125 }, "compId": 17 }, { "type": "Button", "props": { "y": 891, "x": 402, "width": 282, "var": "item1", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "9", "height": 125 }, "compId": 18 }], "loadList": ["guanqia/2/pic_157_2.png", "guanqia/2/pic_157_1.png", "pubRes/btn_1.png", "pubRes/btn_2.png"], "loadList3D": [] };
        ui.level2UI = level2UI;
        REG("ui.level2UI", level2UI);
        class level3UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level3UI.uiView);
            }
        }
        level3UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 1003, "x": 478, "width": 178, "var": "item4", "skin": "guanqia/3/pic_12_6.png", "height": 161 }, "compId": 4 }, { "type": "Image", "props": { "y": 873, "x": 82, "width": 270, "var": "item3", "skin": "guanqia/3/pic_23_1.png", "height": 310 }, "compId": 5 }, { "type": "Image", "props": { "y": 427, "x": 431.5, "width": 271, "var": "item2", "skin": "guanqia/3/pic_23_2 2.png", "height": 389 }, "compId": 6 }, { "type": "Image", "props": { "y": 562, "x": 145.5, "width": 143, "var": "item1", "skin": "guanqia/3/pic_38_1 2.png", "height": 161 }, "compId": 7 }, { "type": "Image", "props": { "y": 186, "x": 26, "width": 191, "var": "item0", "skin": "guanqia/3/pic_7_4.png", "height": 179 }, "compId": 8 }], "loadList": ["guanqia/3/pic_12_6.png", "guanqia/3/pic_23_1.png", "guanqia/3/pic_23_2 2.png", "guanqia/3/pic_38_1 2.png", "guanqia/3/pic_7_4.png"], "loadList3D": [] };
        ui.level3UI = level3UI;
        REG("ui.level3UI", level3UI);
        class level4UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level4UI.uiView);
            }
        }
        level4UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 12 }, { "type": "Image", "props": { "y": 987, "x": 617, "width": 181, "var": "img6", "skin": "guanqia/4/pic_watermelon_2.png", "height": 128, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }, { "type": "Image", "props": { "y": 649, "x": 139, "width": 202, "var": "img0", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 649, "x": 375, "width": 202, "var": "img1", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 649, "x": 624, "width": 202, "var": "img2", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 970, "x": 126, "width": 202, "var": "img3", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 970, "x": 375, "width": 202, "var": "img4", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "y": 970, "x": 616, "width": 202, "var": "img5", "skin": "guanqia/4/pic_watermelon_1.png", "height": 162, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }], "loadList": ["guanqia/4/pic_watermelon_2.png", "guanqia/4/pic_watermelon_1.png"], "loadList3D": [] };
        ui.level4UI = level4UI;
        REG("ui.level4UI", level4UI);
        class level5UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level5UI.uiView);
            }
        }
        level5UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 10 }, { "type": "Image", "props": { "y": 999, "x": 180, "width": 268, "var": "item2", "skin": "guanqia/5/pic_03_2.png", "height": 165, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 438, "x": 579, "width": 267, "var": "item1", "skin": "guanqia/5/pic_03_3.png", "height": 271, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 438, "x": 164, "width": 267, "var": "item0", "skin": "guanqia/5/pic_03_4.png", "height": 256, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "y": 1000, "x": 582, "width": 273, "var": "item4", "skin": "guanqia/5/pic_39_2.png", "height": 268, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": 709, "x": 356, "width": 262, "var": "item3", "skin": "guanqia/5/pic_.png", "height": 271, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Box", "props": { "y": 764, "x": 391, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/5/pic_03_2.png", "guanqia/5/pic_03_3.png", "guanqia/5/pic_03_4.png", "guanqia/5/pic_39_2.png", "guanqia/5/pic_.png"], "loadList3D": [] };
        ui.level5UI = level5UI;
        REG("ui.level5UI", level5UI);
        class level6UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level6UI.uiView);
            }
        }
        level6UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 358, "x": 122, "width": 506, "texture": "guanqia/6/pic_31.png", "height": 513 }, "compId": 4 }, { "type": "Image", "props": { "y": 960, "x": 505, "width": 87, "var": "jia", "skin": "pubRes/pic_color_add.png", "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 960, "x": 241, "width": 87, "var": "jian", "skin": "pubRes/pic_color_reduce.png", "scaleX": -1, "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Button", "props": { "y": 1160, "x": 219, "width": 282, "var": "clearBtn", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "清除", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Button", "props": { "y": 1161, "x": 540, "width": 282, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "FontClip", "props": { "y": 920.5, "x": 313, "width": 112, "var": "shuzi", "value": "1", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "height": 79, "align": "center" }, "compId": 10 }, { "type": "Box", "props": { "y": 851, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }], "loadList": ["guanqia/6/pic_31.png", "pubRes/pic_color_add.png", "pubRes/pic_color_reduce.png", "pubRes/btn_1.png", "pubRes/btn_2.png", "pubRes/shuzi2.png"], "loadList3D": [] };
        ui.level6UI = level6UI;
        REG("ui.level6UI", level6UI);
        class level7UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level7UI.uiView);
            }
        }
        level7UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 9 }, { "type": "Image", "props": { "y": 1059, "x": 256, "width": 146, "var": "item3", "skin": "guanqia/7/pic_22_1.png", "height": 209, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 474, "x": 565, "width": 181, "var": "item1", "skin": "guanqia/7/pic_22_1.png", "height": 232, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 842, "x": 538, "width": 203, "var": "item2", "skin": "guanqia/7/pic_22_1.png", "height": 291, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 571, "x": 227, "width": 246, "var": "item0", "skin": "guanqia/7/pic_22_1.png", "height": 352, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["guanqia/7/pic_22_1.png"], "loadList3D": [] };
        ui.level7UI = level7UI;
        REG("ui.level7UI", level7UI);
        class level8UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level8UI.uiView);
            }
        }
        level8UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 234, "x": 25, "width": 700, "visible": false, "var": "box", "height": 1100, "bottom": 0, "bgColor": "#eadfdf" }, "compId": 12 }, { "type": "Image", "props": { "y": 860, "x": 507, "width": 87, "var": "jia", "skin": "pubRes/pic_color_add.png", "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 860, "x": 243, "width": 87, "var": "jian", "skin": "pubRes/pic_color_reduce.png", "scaleX": -1, "height": 106, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Button", "props": { "y": 1060, "x": 221, "width": 282, "var": "clearBtn", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "清除", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Button", "props": { "y": 1061, "x": 542, "width": 282, "var": "sureBtn", "stateNum": 1, "skin": "pubRes/btn_2.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "确定", "height": 125, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "FontClip", "props": { "y": 820, "x": 315, "width": 112, "var": "shuzi", "value": "1", "skin": "pubRes/shuzi2.png", "sheet": "-+09 8765 4321", "height": 79, "align": "center" }, "compId": 8 }, { "type": "Sprite", "props": { "y": 306, "x": 128.5, "width": 493, "texture": "guanqia/8/pic_09_1.png", "height": 493, "alpha": 1 }, "compId": 9 }, { "type": "Image", "props": { "y": 524, "x": 298, "width": 154, "var": "carImg", "skin": "guanqia/8/pic_09_2.png", "height": 110 }, "compId": 10 }, { "type": "Box", "props": { "y": 935, "x": 375, "width": 40, "var": "rightBox", "height": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 13 }], "loadList": ["pubRes/pic_color_add.png", "pubRes/pic_color_reduce.png", "pubRes/btn_1.png", "pubRes/btn_2.png", "pubRes/shuzi2.png", "guanqia/8/pic_09_1.png", "guanqia/8/pic_09_2.png"], "loadList3D": [] };
        ui.level8UI = level8UI;
        REG("ui.level8UI", level8UI);
        class level9UI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(level9UI.uiView);
            }
        }
        level9UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 468, "x": 270, "width": 71, "var": "item0", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 4 }, { "type": "Text", "props": { "y": 486, "x": 345, "width": 95, "var": "yaoshishu", "text": "10分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 5 }, { "type": "Text", "props": { "y": 626, "x": 345, "width": 95, "text": "20分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Text", "props": { "y": 766, "x": 345, "width": 95, "text": "50分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 7 }, { "type": "Text", "props": { "y": 906, "x": 345, "width": 95, "text": "80分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 8 }, { "type": "Text", "props": { "y": 1046, "x": 345, "width": 95, "text": "满分", "height": 38, "fontSize": 40, "runtime": "laya.display.Text" }, "compId": 9 }, { "type": "Image", "props": { "y": 609, "x": 270, "width": 71, "var": "item1", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 10 }, { "type": "Image", "props": { "y": 749, "x": 270, "width": 71, "var": "item2", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 11 }, { "type": "Image", "props": { "y": 889, "x": 270, "width": 71, "var": "item3", "skin": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 12 }, { "type": "Sprite", "props": { "y": 1029, "x": 270, "width": 71, "var": "item4", "texture": "guanqia/9/choice_frame_while_1.png", "height": 72 }, "compId": 13 }], "loadList": ["guanqia/9/choice_frame_while_1.png"], "loadList3D": [] };
        ui.level9UI = level9UI;
        REG("ui.level9UI", level9UI);
        class mainuiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(mainuiUI.uiView);
            }
        }
        mainuiUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 25, "x": 559, "width": 171, "skin": "pubRes/qiandi.png", "sizeGrid": "0,44,0,42", "height": 78 }, "compId": 10 }, { "type": "Image", "props": { "y": 29, "x": 30, "width": 75, "var": "shezhi", "skin": "pubRes/ic_setting_1.png", "height": 73 }, "compId": 3 }, { "type": "Image", "props": { "y": 31, "x": 149, "width": 67, "var": "xuanguan", "skin": "pubRes/ic_list_1.png", "height": 71 }, "compId": 5 }, { "type": "Image", "props": { "y": 34, "x": 268, "width": 64, "var": "shuaxin", "skin": "pubRes/ic_reset_1.png", "height": 64 }, "compId": 6 }, { "type": "Image", "props": { "y": 34, "x": 383, "width": 70, "var": "kuaijin", "skin": "pubRes/ic_skip_1.png", "height": 59 }, "compId": 7 }, { "type": "Image", "props": { "y": 27, "x": 572, "width": 82, "var": "jinyaoshi", "skin": "pubRes/ic_key_1.png", "height": 80 }, "compId": 8 }, { "type": "Text", "props": { "y": 36, "x": 653, "width": 65, "var": "yaoshishu", "text": "2", "height": 60, "fontSize": 60, "runtime": "laya.display.Text" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 157, "x": 300, "texture": "pubRes/dengji.png" }, "compId": 12 }, { "type": "FontClip", "props": { "y": 159, "x": 401, "var": "dengjishuzi", "value": "1", "skin": "pubRes/shuzi.png", "sheet": "01234 56789" }, "compId": 17 }, { "type": "Text", "props": { "y": 249, "x": 34, "wordWrap": true, "width": 678, "var": "titleTxt", "text": "哪个最大？", "height": 96, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 19 }], "loadList": ["pubRes/qiandi.png", "pubRes/ic_setting_1.png", "pubRes/ic_list_1.png", "pubRes/ic_reset_1.png", "pubRes/ic_skip_1.png", "pubRes/ic_key_1.png", "pubRes/dengji.png", "pubRes/shuzi.png"], "loadList3D": [] };
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
        shengliUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "bgColor": "#ffffff", "alpha": 0.75 }, "compId": 20 }, { "type": "Image", "props": { "y": 328, "x": 47, "width": 656, "skin": "pubRes/fram_big.png", "height": 297 }, "compId": 3 }, { "type": "Image", "props": { "y": 375, "x": 192, "width": 366, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,216,0,121", "height": 87 }, "compId": 5 }, { "type": "Button", "props": { "y": 667, "x": 398, "width": 305, "var": "nextAdBtn", "stateNum": 1, "skin": "pubRes/btn_3.png", "labelStrokeColor": "‘", "labelSize": 40, "labelPadding": "10,10,10,40", "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 15, "child": [{ "type": "Sprite", "props": { "y": 25, "x": 48, "width": 69, "var": "ads", "texture": "pubRes/ic_ad_1.png", "height": 74 }, "compId": 10 }, { "type": "Sprite", "props": { "y": -24, "x": 180, "width": 134, "texture": "pubRes/hongyuan.png", "height": 69 }, "compId": 17, "child": [{ "type": "Text", "props": { "y": 16, "x": 6, "width": 127, "text": "+提示", "height": 50, "fontSize": 40, "align": "center", "runtime": "laya.display.Text" }, "compId": 18 }] }] }, { "type": "Text", "props": { "y": 393.5, "x": 248, "width": 254, "var": "zi1", "text": "恭喜你呀！", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Text", "props": { "y": 483, "x": 99, "wordWrap": true, "width": 539, "var": "zi2", "text": "恭喜你呀！", "height": 118, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 7 }, { "type": "Button", "props": { "y": 667, "x": 53, "width": 305, "var": "nextBtn", "stateNum": 1, "skin": "pubRes/btn_1.png", "labelStrokeColor": "‘", "labelSize": 40, "labelColors": "#000000", "label": "下一关", "height": 125 }, "compId": 9 }, { "type": "Image", "props": { "y": 857, "x": 0, "width": 752, "var": "paishou", "skin": "pubRes/pic_hand_1.png", "height": 477 }, "compId": 19 }], "loadList": ["pubRes/fram_big.png", "pubRes/top_yellow.png", "pubRes/btn_3.png", "pubRes/ic_ad_1.png", "pubRes/hongyuan.png", "pubRes/btn_1.png", "pubRes/pic_hand_1.png"], "loadList3D": [] };
        ui.shengliUI = shengliUI;
        REG("ui.shengliUI", shengliUI);
        class tishiUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(tishiUI.uiView);
            }
        }
        tishiUI.uiView = { "type": "View", "props": { "y": 667, "x": 375, "width": 750, "height": 1334, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334, "bgColor": "#ffffff", "alpha": 0.75 }, "compId": 7 }, { "type": "Image", "props": { "y": 352, "x": 47, "width": 656, "skin": "pubRes/fram_big.png", "height": 316 }, "compId": 3 }, { "type": "Image", "props": { "y": 432, "x": 278, "width": 201, "skin": "pubRes/top_yellow.png", "sizeGrid": "0,86,0,87", "height": 87 }, "compId": 4 }, { "type": "Text", "props": { "y": 450.5, "x": 321.5, "width": 107, "var": "zi1", "text": "提示", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 5 }, { "type": "Text", "props": { "y": 553, "x": 109, "width": 539, "var": "zi2", "text": "恭喜你呀！", "height": 50, "fontSize": 46, "align": "center", "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "Image", "props": { "y": 314, "x": 638, "var": "cha", "skin": "pubRes/ic_colse_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }], "loadList": ["pubRes/fram_big.png", "pubRes/top_yellow.png", "pubRes/ic_colse_1.png"], "loadList3D": [] };
        ui.tishiUI = tishiUI;
        REG("ui.tishiUI", tishiUI);
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
    GameEvent.SHOW_TIPS = "SHOW_TIPS";

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
            this.jinyaoshi.on(Laya.Event.CLICK, this, this.onTips);
            this.mouseThrough = true;
        }
        onTips() {
            Game.eventManager.event(GameEvent.SHOW_TIPS);
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
            Game.soundManager.play("right.wav");
        }
    }

    class WrongIcon extends ui.wrongIconUI {
        constructor() { super(); }
        add(parentSpr) {
            parentSpr && parentSpr.addChild(this);
            this.pos(parentSpr.width * 0.5, parentSpr.height * 0.5);
            this.icon.scale(0, 0);
            let t = new Laya.TimeLine();
            t.to(this.icon, { scaleX: 0.4, scaleY: 0.4 }, 100);
            t.to(this.icon, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.backOut);
            t.to(this.icon, { scaleX: 0, scaleY: 0 }, 400);
            t.play();
            Game.soundManager.play("wrong.wav");
        }
    }

    class RightView extends ui.shengliUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            GM.imgEffect.addEffect(this.paishou, 2);
            this.nextBtn.clickHandler = new Laya.Handler(this, this.onNext);
        }
        onNext() {
            this.removeSelf();
            Game.eventManager.event(GameEvent.ON_NEXT);
        }
        onDis() {
            Laya.MouseManager.enabled = true;
            this.paishou.y = 1334;
            Laya.Tween.to(this.paishou, { y: 857 }, 500, null, Laya.Handler.create(this, this.onEff), 600);
        }
        onEff() {
            Game.soundManager.play("win.wav");
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

    class TipsView extends ui.tishiUI {
        constructor() {
            super();
            GM.imgEffect.addEffect(this.cha);
            this.cha.on(Laya.Event.CLICK, this, this.onClose);
        }
        onClose() {
            this.removeSelf();
        }
        setTips(sys) {
            this.zi2.text = sys.stageTips;
        }
    }

    class MainView extends ui.mainViewUI {
        constructor() {
            super();
            this._box = new Laya.Box();
            this._viewMap = {};
            this.addChild(this._box);
            this._mainFace = new MainFace();
            this.addChild(this._mainFace);
            this.showLevel(12);
            RightIcon.ins = new RightIcon();
            WrongIcon.ins = new WrongIcon();
            Game.eventManager.on(GameEvent.SHOW_RIGHT, this, this.showRight);
            Game.eventManager.on(GameEvent.ON_NEXT, this, this.onNext);
            Game.eventManager.on(GameEvent.ON_REFRESH, this, this.onRefresh);
            Game.eventManager.on(GameEvent.SHOW_TIPS, this, this.showTips);
        }
        showTips() {
            if (!this._tipsView) {
                this._tipsView = new TipsView();
            }
            this.addChild(this._tipsView);
            this._tipsView.pos(GameConfig.width * 0.5, GameConfig.height * 0.5);
            MyEffect.popup(this._tipsView, 1, 500, 100);
            this._tipsView.setTips(this.curView.sys);
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
            MyEffect.popup(this._rightView, 1, 500, 250);
            this._rightView.setWin(this.curView.sys);
        }
        onNext() {
            this.curLv++;
            this.showLevel(this.curLv);
        }
        showLevel(lv) {
            this._box.removeChildren();
            this.curLv = lv;
            this.curView = this._viewMap[lv];
            if (!this.curView) {
                let VIEW = Laya.ClassUtils.getClass(lv + "");
                this.curView = new VIEW();
                this._viewMap[lv] = this.curView;
            }
            else {
                this.curView.refresh();
            }
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
            RightIcon.ins.removeSelf();
            WrongIcon.ins.removeSelf();
        }
        addEvent(sprite, func, isDrag = false) {
            func && sprite.on(Laya.Event.CLICK, this, func, [sprite]);
            if (isDrag) {
                sprite.on(Laya.Event.MOUSE_DOWN, this, this.onDown, [sprite]);
                sprite.on(Laya.Event.MOUSE_UP, this, this.onUp, [sprite]);
            }
        }
        onDown(sprite) {
            sprite.startDrag();
        }
        onUp(sprite) {
            sprite.stopDrag();
        }
        setAnswer(sprite, isRight) {
            if (isRight) {
                RightIcon.ins.add(sprite);
                Laya.MouseManager.enabled = false;
                Laya.timer.once(800, this, this.onRight);
            }
            else {
                WrongIcon.ins.add(sprite);
            }
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
            super.refresh();
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
        onClick(img) {
            this.setAnswer(img, img.tag == 1);
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

    class Level_2 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level2UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 4; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item1);
        }
    }

    class Level_3 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level3UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 5; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item0);
        }
    }

    class Level_4 extends BaseLevel {
        constructor() {
            super();
            this.posList = [];
            this._downPos = new Laya.Point();
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level4UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 7; i++) {
                let img = this.ui["img" + i];
                this.addEvent(img, this.onClick, i < 6);
                this.posList.push([img.x, img.y]);
            }
            this.refresh();
        }
        onDown(sprite) {
            this._downPos.x = Laya.stage.mouseX;
            this._downPos.y = Laya.stage.mouseY;
            sprite.off(Laya.Event.CLICK, this, this.onClick);
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            if (Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y) {
                this.onClick(sprite);
            }
            else {
                super.onUp(sprite);
            }
        }
        refresh() {
            super.refresh();
            for (let i = 0; i < 6; i++) {
                let img = this.ui["img" + i];
                img.pos(this.posList[i][0], this.posList[i][1]);
            }
            let index = Math.floor(Math.random() * 6);
            let img = this.ui["img" + index];
            this.ui.img6.pos(img.x + 10, img.y + 16);
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.img6);
        }
    }

    class Level_5 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level5UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 5; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, null, true);
            }
            this.refresh();
        }
        refresh() {
            super.refresh();
            let skins = Level_5.itemskins;
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
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            super.onUp(sprite);
            if (sprite.tag == 1) {
                if (sprite.x < 131 || sprite.x > 619) {
                    this.setAnswer(this.ui.rightBox, true);
                }
            }
        }
    }
    Level_5.itemskins = [
        { skin: "guanqia/5/pic_03_4.png", right: 0, ww: 267, hh: 256 },
        { skin: "guanqia/5/pic_03_3.png", right: 0, ww: 267, hh: 271 },
        { skin: "guanqia/5/pic_03_2.png", right: 0, ww: 268, hh: 165 },
        { skin: "guanqia/5/pic_.png", right: 1, ww: 262, hh: 271 },
        { skin: "guanqia/5/pic_39_2.png", right: 0, ww: 273, hh: 268 },
    ];

    class Level_6 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level6UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.ui.jian.on(Laya.Event.CLICK, this, this.onJian);
            this.ui.jia.on(Laya.Event.CLICK, this, this.onJia);
            this.ui.clearBtn.clickHandler = new Laya.Handler(this, this.refresh);
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onJian() {
            if (this.curValue == 0) {
                return;
            }
            this.curValue--;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onJia() {
            if (this.curValue == 99) {
                return;
            }
            this.curValue++;
            this.ui.shuzi.value = "" + this.curValue;
        }
        refresh() {
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.curValue == 11);
        }
    }

    class Level_7 extends BaseLevel {
        constructor() {
            super();
            this.posList = [];
            this._downPos = new Laya.Point();
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level7UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 4; i++) {
                let img = this.ui["item" + i];
                this.addEvent(img, this.onClick, i < 6);
                this.posList.push([img.x, img.y]);
            }
            this.refresh();
        }
        refresh() {
            super.refresh();
            for (let i = 0; i < 4; i++) {
                let img = this.ui["item" + i];
                img.pos(this.posList[i][0], this.posList[i][1]);
                img.scale(1, 1);
                img.visible = true;
            }
        }
        onClick(img) {
            let count = 0;
            for (let i = 0; i < 4; i++) {
                let timg = this.ui["item" + i];
                if (timg.visible) {
                    count++;
                }
            }
            this.setAnswer(img, count == 1);
        }
        onDown(sprite) {
            this._downPos.x = Laya.stage.mouseX;
            this._downPos.y = Laya.stage.mouseY;
            sprite.off(Laya.Event.CLICK, this, this.onClick);
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            if (Laya.stage.mouseX == this._downPos.x && Laya.stage.mouseY == this._downPos.y) {
                this.onClick(sprite);
            }
            else {
                super.onUp(sprite);
                for (let i = 0; i < 4; i++) {
                    let img = this.ui["item" + i];
                    if (img != sprite) {
                        if (this.hit(sprite, img)) {
                            if (img.width > sprite.width) {
                                sprite.visible = false;
                                Laya.Tween.to(img, { scaleX: img.scaleX + 0.1, scaleY: img.scaleY + 0.1 }, 300, Laya.Ease.backOut);
                            }
                            else {
                                img.visible = false;
                                Laya.Tween.to(sprite, { scaleX: sprite.scaleX + 0.1, scaleY: sprite.scaleY + 0.1 }, 300, Laya.Ease.backOut);
                            }
                        }
                    }
                }
            }
        }
        hit(b0, b1) {
            return b0.x < b1.x + b1.width &&
                b0.x + b0.width > b1.x &&
                b0.y < b1.y + b1.height &&
                b0.y + b0.height > b1.y;
        }
    }

    class Level_8 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level8UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.ui.jian.on(Laya.Event.CLICK, this, this.onJian);
            this.ui.jia.on(Laya.Event.CLICK, this, this.onJia);
            this.ui.clearBtn.clickHandler = new Laya.Handler(this, this.refresh);
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
            this.addEvent(this.ui.carImg, null, true);
            this._startX = this.ui.carImg.x;
            this._startY = this.ui.carImg.y;
        }
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onJian() {
            if (this.curValue == 0) {
                return;
            }
            this.curValue--;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onJia() {
            if (this.curValue == 99) {
                return;
            }
            this.curValue++;
            this.ui.shuzi.value = "" + this.curValue;
        }
        refresh() {
            this.ui.carImg.pos(this._startX, this._startY);
            this.curValue = 0;
            this.ui.shuzi.value = "" + this.curValue;
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.curValue == 9);
        }
    }

    class Level_9 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level9UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 5; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
            }
            this.refresh();
            this.isInit = true;
        }
        refresh() {
            super.refresh();
        }
        onClick(img) {
            this.setAnswer(img, img == this.ui.item4);
        }
    }

    class Level_10 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level10UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.addEvent(this.ui.sunImg, null, true);
            this._startX = this.ui.sunImg.x;
            this._startY = this.ui.sunImg.y;
            this.refresh();
        }
        refresh() {
            super.refresh();
            this.ui.blankBox.visible = false;
            this.ui.birdImg0.visible = true;
            this.ui.birdImg1.visible = false;
            this.ui.sunImg.pos(this._startX, this._startY);
        }
        onDown(sprite) {
            sprite.startDrag(new Laya.Rectangle(this.ui.box.x, this.ui.box.y, this.ui.box.width, this.ui.box.height));
        }
        onUp(sprite) {
            super.onUp(sprite);
            if (this.ui.sunImg.x <= -60 || this.ui.sunImg.x >= GameConfig.width + 75) {
                this.setAnswer(this.ui.rightBox, true);
                this.ui.blankBox.visible = true;
                this.ui.birdImg0.visible = false;
                this.ui.birdImg1.visible = true;
            }
        }
    }

    class Level_11 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level11UI();
            this.addChild(this.ui);
            this.isInit = true;
            this.ui.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
            this.refresh();
        }
        refresh() {
            super.refresh();
            this.ui.shuru.text = "";
        }
        onSure() {
            this.setAnswer(this.ui.rightBox, this.ui.shuru.text == "9");
        }
    }

    class Level_12 extends BaseLevel {
        constructor() {
            super();
            this.clickCount = 0;
            this.fontArr = [];
            this.answerArr = [];
            this.myAnswerArr = [];
        }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level12UI();
            this.addChild(this.ui);
            this.isInit = true;
            for (let i = 0; i < 6; i++) {
                let itemImg = this.ui["item" + i];
                this.addEvent(itemImg, this.onClick);
                this.fontArr.push(this.ui["font" + i]);
            }
            this.refresh();
        }
        refresh() {
            Laya.MouseManager.enabled = true;
            super.refresh();
            this.clickCount = 0;
            let skins = Level_12.itemskins;
            skins.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
            });
            this.answerArr.length = 0;
            this.myAnswerArr.length = 0;
            for (let i = 0; i < skins.length; i++) {
                let obj = skins[i];
                let itemImg = this.ui["item" + i];
                itemImg.skin = obj.skin;
                itemImg.size(obj.ww, obj.hh);
                this.fontArr[i].removeSelf();
                this.fontArr[i].pos(-100, -100);
                if (obj.type == 1) {
                    this.answerArr.push(obj.skin);
                }
            }
            this.answerArr.push("guanqia/12/pic_20_4.png", "guanqia/12/pic_03_3.png", "guanqia/12/pic_.png");
        }
        onClick(img) {
            this.clickCount++;
            let fc = this.fontArr[this.clickCount - 1];
            fc.value = "" + this.clickCount;
            img.addChild(fc);
            fc.pos(20 + 80 * Math.random(), 20 + 80 * Math.random());
            this.myAnswerArr.push(img.skin);
            if (this.clickCount == 5) {
                Laya.MouseManager.enabled = false;
                let isRight = true;
                for (let i = 0; i < 5; i++) {
                    if (this.answerArr[i] != this.myAnswerArr[i]) {
                        isRight = false;
                        break;
                    }
                }
                console.log("======", this.answerArr, this.myAnswerArr);
                this.setAnswer(this.ui.rightBox, isRight);
                if (!isRight) {
                    setTimeout(() => {
                        this.refresh();
                    }, 800);
                }
            }
            else if (this.clickCount == 6) {
                this.setAnswer(this.ui.rightBox, false);
            }
        }
    }
    Level_12.itemskins = [
        { skin: "guanqia/12/pic_03_3.png", type: 2, ww: 175, hh: 175, name: "圆形" },
        { skin: "guanqia/12/pic_.png", type: 2, ww: 176, hh: 176, name: "矩形" },
        { skin: "guanqia/12/pic_20_1.png", type: 1, ww: 193, hh: 193, name: "草莓" },
        { skin: "guanqia/12/pic_20_2.png", type: 1, ww: 256, hh: 128, name: "香蕉" },
        { skin: "guanqia/12/pic_20_3_1.png", type: 3, ww: 227, hh: 227, name: "南瓜" },
        { skin: "guanqia/12/pic_20_4.png", type: 2, ww: 175, hh: 175, name: "六边形" }
    ];

    class Level_13 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level13UI();
            this.addChild(this.ui);
            this.isInit = true;
        }
    }

    class Level_14 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level14UI();
            this.addChild(this.ui);
            this.isInit = true;
        }
    }

    class Level_15 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level15UI();
            this.addChild(this.ui);
            this.isInit = true;
        }
    }

    class Level_16 extends BaseLevel {
        constructor() { super(); }
        onInit() {
            if (this.isInit) {
                return;
            }
            this.ui = new ui.level6UI();
            this.addChild(this.ui);
            this.isInit = true;
        }
    }

    class GameMain {
        constructor() {
        }
        static onInit() {
            let REG = Laya.ClassUtils.regClass;
            REG(ViewID.main, MainView);
            let CLAS = [Level_1, Level_2, Level_3, Level_4, Level_5, Level_6, Level_7, Level_8, Level_9, Level_10, Level_11, Level_12, Level_13, Level_14, Level_15, Level_16];
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
            Game.soundManager.play("bg.mp3", true);
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
            Game.soundManager.pre = "res/sounds/";
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
