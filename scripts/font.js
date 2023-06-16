"use strict";
class CFontFrame extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.toolbar = new CPanel(this);
        this.lblFontDir = new CPanel(this.toolbar);
        this.btnWindows = new CButton(this.toolbar);
        this.btnMac = new CButton(this.toolbar);
        this.btnLinux = new CButton(this.toolbar);
        this.edtFontDir = new CTextBox(this.toolbar);
        this.btnFontList = new CButton(this.toolbar);
        this.lst = new CObjectListBox(this);
        this.sl = new CSplitter(this);
        this.lClient = new CPanel(this);
        this.lblTest = new CPanel(this.lClient);
        this.txtText = new CTextArea(this.lClient);
        this.txtPathdata = new CTextArea(this.lClient);
        this.btnPath = new CButton(this.lClient);
        let self = this;
        this.btnFontList.onClick = function () {
            let o = { kind: "fontlist", dir: self.edtFontDir.text };
            sendBackendMessage(self, JSON.stringify(o));
        };
        this.lst.onChangeItemIndex = function () {
            if (self.lst.itemIndex != -1) {
                self.lblTest.textSet.fontFamily = self.lst.items.get(self.lst.itemIndex)["text"];
            }
        };
        this.lblTest.textSet.fontSize = 50;
        this.btnWindows.onClick = function () {
            self.edtFontDir.text = "c:/windows/fonts";
        };
        this.btnMac.onClick = function () {
            self.edtFontDir.text = "/Library/Fonts";
        };
        this.btnLinux.onClick = function () {
            self.edtFontDir.text = "/usr/share/fonts";
        };
        this.btnPath.onClick = function () {
            if (self.lst.itemIndex != -1) {
                let o = { kind: "fontpath", text: self.txtText.text, filename: self.lst.items.get(self.lst.itemIndex)["filename"] };
                sendBackendMessage(self, JSON.stringify(o));
            }
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "toolbar", this.toolbar.toData(), {}, true);
        CDataClass.putData(data, "lblFontDir", this.lblFontDir.toData(), {}, true);
        CDataClass.putData(data, "btnWindows", this.btnWindows.toData(), {}, true);
        CDataClass.putData(data, "btnMac", this.btnMac.toData(), {}, true);
        CDataClass.putData(data, "btnLinux", this.btnLinux.toData(), {}, true);
        CDataClass.putData(data, "edtFontDir", this.edtFontDir.toData(), {}, true);
        CDataClass.putData(data, "btnFontList", this.btnFontList.toData(), {}, true);
        CDataClass.putData(data, "lst", this.lst.toData(), {}, true);
        CDataClass.putData(data, "sl", this.sl.toData(), {}, true);
        CDataClass.putData(data, "lClient", this.lClient.toData(), {}, true);
        CDataClass.putData(data, "lblTest", this.lblTest.toData(), {}, true);
        CDataClass.putData(data, "txtText", this.txtText.toData(), {}, true);
        CDataClass.putData(data, "txtPathdata", this.txtPathdata.toData(), {}, true);
        CDataClass.putData(data, "btnPath", this.btnPath.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.toolbar.fromData(CDataClass.getData(data, "toolbar", {}, true));
        this.lblFontDir.fromData(CDataClass.getData(data, "lblFontDir", {}, true));
        this.btnWindows.fromData(CDataClass.getData(data, "btnWindows", {}, true));
        this.btnMac.fromData(CDataClass.getData(data, "btnMac", {}, true));
        this.btnLinux.fromData(CDataClass.getData(data, "btnLinux", {}, true));
        this.edtFontDir.fromData(CDataClass.getData(data, "edtFontDir", {}, true));
        this.btnFontList.fromData(CDataClass.getData(data, "btnFontList", {}, true));
        this.lst.fromData(CDataClass.getData(data, "lst", {}, true));
        this.sl.fromData(CDataClass.getData(data, "sl", {}, true));
        this.lClient.fromData(CDataClass.getData(data, "lClient", {}, true));
        this.lblTest.fromData(CDataClass.getData(data, "lblTest", {}, true));
        this.txtText.fromData(CDataClass.getData(data, "txtText", {}, true));
        this.txtPathdata.fromData(CDataClass.getData(data, "txtPathdata", {}, true));
        this.btnPath.fromData(CDataClass.getData(data, "btnPath", {}, true));
    }
}
let _sender;
function sendBackendMessage(sender, msg) {
    _sender = sender;
    let fn = new Function("msg", `window.api.sendMessage(msg)`);
    fn(msg);
}
function res(message) {
    let o = JSON.parse(message);
    if (o.result == "success") {
        if (o.kind == "fontlist") {
            if (_sender != undefined) {
                _sender.lst.items.clear();
                for (let n = 0; n < o.fonts.length; n++) {
                    _sender.lst.items.add({ text: o.fonts[n].en, filename: o.fonts[n].filename });
                    console.log({ text: o.fonts[n].en, filename: o.fonts[n].filename });
                }
            }
        }
        if (o.kind == "fontpath") {
            if (_sender != undefined) {
                _sender.txtPathdata.text = o.data;
            }
        }
    }
    else {
        alert("Error");
    }
}
let fn2 = new Function("res", `window.api.receiveMessage((reply) => {
    res(reply);
})`);
fn2(res);
