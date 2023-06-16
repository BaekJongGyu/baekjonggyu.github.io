"use strict";
class CStickersModel extends CWindowModel {
    constructor() {
        super(...arguments);
        this.list = new CListBox(this.body);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "list", this.list.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.list.fromData(CDataClass.getData(data, "list", {}, true));
    }
}
class CStickerModel extends CWindowModel {
    get title() {
        return this._title;
    }
    set title(value) {
        if (this._title != value) {
            this._title = value;
            this.caption.text = value;
        }
    }
    get desc() {
        return this._desc;
    }
    set desc(value) {
        this._desc = value;
        this.txtDesc.text = value;
    }
    get stickerResource() {
        return this._stickerResource;
    }
    set stickerResource(value) {
        if (this._stickerResource != value) {
            this._stickerResource = value;
            this.doStickerResourceSet();
        }
    }
    constructor(parent, name) {
        super(parent, name);
        this._title = "";
        this._desc = "";
        this._stickerResource = "";
        this.txtTitle = new CTextBox(this.caption);
        this.txtDesc = new CTextArea(this.body);
        this.btnSetting = new CButton(this.caption);
        this.btnAddSticker = new CButton(this.caption);
        this.btnWrap = new CSelectBox(this.caption);
        this.stickerId = -1;
        this.isStickerSet = false;
        this.orgWidth = 0;
        this.orgHeight = 0;
        this.orgLeft = 0;
        this.orgTop = 0;
        this.stickerIndex = -1;
        let self = this;
        this.txtTitle.visible = false;
        this.txtTitle.onChangeFocus = function () {
            if (!self.txtTitle.focused) {
                self.title = self.txtTitle.text;
                self.txtTitle.visible = false;
                //self.doChangeSticker()
            }
        };
        this.txtTitle.onKeyDown = function (s, e) {
            if (e.key == "Enter") {
                self.title = self.txtTitle.text;
                self.txtTitle.focused = false;
            }
        };
        this.txtDesc.onChangeText = function () {
            self.desc = self.txtDesc.text;
            //self.doChangeSticker()
        };
        this.txtDesc.onChangeFocus = function () {
            if (self.txtDesc.focused && self.transform.rotateY == 90) {
                CAnimation.animate(200, function (t, v, ct) {
                    self.opacity = 0.5 + (v * 0.5);
                    self.transform.rotateY = 90 - (90 * v);
                });
            }
        };
        this.btnWrap.onChangeSelected = function () {
            if (self.isStickerSet) {
                self.txtDesc.wrap = self.btnWrap.selected;
                self.txtDesc.useHScrollbar = !self.btnWrap.selected;
                //self.doStickerSetting()
            }
        };
        this.btnSetting.onClick = function () {
            if (self.isStickerSet) {
                CSystem.prompt("스티커 리소스", ["Resource"], CSystem.browserCovers.get("cover"), function (arr) {
                    if (arr[0] == "") {
                        self.stickerResource = "sticker_base.frame";
                    }
                    else {
                        self.stickerResource = arr[0];
                    }
                    //self.doStickerSetting()
                });
            }
        };
        this.btnAddSticker.onClick = function () {
            self.doStickerAdd();
        };
        CStickerModel.stickers.add(this);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "txtTitle", this.txtTitle.toData(), {}, true);
        CDataClass.putData(data, "txtDesc", this.txtDesc.toData(), {}, true);
        CDataClass.putData(data, "btnSetting", this.btnSetting.toData(), {}, true);
        CDataClass.putData(data, "btnAddSticker", this.btnAddSticker.toData(), {}, true);
        CDataClass.putData(data, "btnWrap", this.btnWrap.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.txtTitle.fromData(CDataClass.getData(data, "txtTitle", {}, true));
        this.txtDesc.fromData(CDataClass.getData(data, "txtDesc", {}, true));
        this.btnSetting.fromData(CDataClass.getData(data, "btnSetting", {}, true));
        this.btnAddSticker.fromData(CDataClass.getData(data, "btnAddSticker", {}, true));
        this.btnWrap.fromData(CDataClass.getData(data, "btnWrap", {}, true));
        this.txtTitle.visible = false;
    }
    doRemove() {
        CStickerModel.stickers.delete(this);
        super.doRemove();
    }
    doDoubleClick(e) {
        super.doDoubleClick(e);
        this.txtTitle.visible = true;
        this.txtTitle.text = this.caption.text;
        this.txtTitle.focused = true;
    }
    doStickerResourceSet() {
        this.isStickerSet = false;
        let t = this.title;
        let d = this.desc;
        let s = this.btnWrap.selected;
        let l = this.position.left;
        let to = this.position.top;
        let w = this.position.width;
        let h = this.position.height;
        this.resource = this.stickerResource;
        this.title = t;
        this.desc = d;
        this.caption.text = t;
        this.btnWrap.selected = s;
        this.position.left = l;
        this.position.top = to;
        this.position.width = w;
        this.position.height = h;
        this.isStickerSet = true;
    }
    doStickerAdd() {
        /**TITLE, STICKER_DESC, STICKER_LEFT, STICKER_TOP, STICKER_WIDTH, STICKER_HEIGHT */
        /*if(CGlobal.userInfo != undefined && CGlobal.userInfo.ws != undefined && this.isStickerSet) {
            if(this.parent != undefined) {
                let strm = new CStream()
                let l = (this.parent.position.width - 200) / 2
                let t = (this.parent.position.height - 200) / 2
                strm.putString("")
                strm.putString("")
                strm.putNumber(l)
                strm.putNumber(t)
                strm.putNumber(200)
                strm.putNumber(200)
                CGlobal.userInfo.sendSocketData("insertsticker", strm, function(data) {
                    data.getString()
                    data.getString()
                    if(data.getString() == "success") {
                        let o = JSON.parse(data.getString())
                        let id = o[0].NEXT_ID
                        let frm = new CStickerModel(CSystem.desktopList.get(0).applicationLayer)
                        frm.stickerResource = "sticker_base.frame"
                        frm.isStickerSet = false
                        frm.show(l, t, 200, 200, "", "remove")
                        frm.stickerId = id
                        frm.title = ""
                        frm.desc = ""
                        frm.txtDesc.wrap = true
                        frm.txtDesc.useHScrollbar = false
                        frm.btnWrap.selected = true
                        frm.isStickerSet = true
                    }
                })
            }
        }*/
    }
    static showStickers(json) {
        this.stickers.forEach(function (v) {
            v.remove();
        });
        this.stickers.clear();
        let o = JSON.parse(json);
        for (let n = 0; n < o.length; n++) {
            let frm = new CStickerModel(CSystem.desktopList.get(0).applicationLayer);
            if (o[n].RESOURCE_NAME != undefined && o[n].RESOURCE_NAME != "") {
                frm.stickerResource = o[n].RESOURCE_NAME;
            }
            else {
                frm.stickerResource = "sticker_base.frame";
            }
            frm.isStickerSet = false;
            frm.show(o[n].STICKER_LEFT, o[n].STICKER_TOP, o[n].STICKER_WIDTH, o[n].STICKER_HEIGHT, "", "remove");
            frm.stickerId = o[n].ID;
            frm.title = o[n].TITLE;
            frm.desc = o[n].STICKER_DESC;
            if (o[n].WRAP_YN == "Y") {
                frm.txtDesc.wrap = true;
                frm.txtDesc.useHScrollbar = false;
                frm.btnWrap.selected = true;
            }
            frm.isStickerSet = true;
        }
    }
    static stickerPreviewOn(pWidth, pHeight) {
        let cnt = 0;
        let pt = (CSystem.desktopList.get(0).applicationLayer.position.height - pHeight) / 2;
        let dw = CSystem.desktopList.get(0).applicationLayer.position.width / (CStickerModel.stickers.size);
        CStickerModel.stickers.forEach(function (vv) {
            vv.orgLeft = vv.position.left;
            vv.orgTop = vv.position.top;
            vv.orgWidth = vv.position.width;
            vv.orgHeight = vv.position.height;
            vv.stickerIndex = cnt;
            cnt++;
            CAnimation.animate(200, function (t, v, ct) {
                vv.position.top = CCalc.crRange2Value(0, 1, v, vv.orgTop, pt);
                vv.position.width = CCalc.crRange2Value(0, 1, v, vv.orgWidth, pWidth);
                vv.position.height = CCalc.crRange2Value(0, 1, v, vv.orgHeight, pHeight);
                vv.position.left = CCalc.crRange2Value(0, 1, v, vv.orgLeft, vv.stickerIndex * dw);
                vv.transform.rotateY = 90 * v;
                vv.opacity = CCalc.crRange2Value(0, 1, v, 1, 0.5);
            });
        });
        this.isPreview = true;
    }
    static stickerPreviewOff() {
        CStickerModel.stickers.forEach(function (vv) {
            let l = vv.position.left;
            let t = vv.position.top;
            let w = vv.position.width;
            let h = vv.position.height;
            CAnimation.animate(200, function (tt, v, ct) {
                vv.position.top = CCalc.crRange2Value(0, 1, v, t, vv.orgTop);
                vv.position.width = CCalc.crRange2Value(0, 1, v, w, vv.orgWidth);
                vv.position.height = CCalc.crRange2Value(0, 1, v, h, vv.orgHeight);
                vv.position.left = CCalc.crRange2Value(0, 1, v, l, vv.orgLeft);
                vv.transform.rotateY = 90 - (90 * v);
                vv.opacity = CCalc.crRange2Value(0, 1, v, 0.5, 1);
            });
        });
        this.isPreview = false;
    }
}
CStickerModel.stickers = new Set();
CStickerModel.isPreview = false;
