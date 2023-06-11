"use strict";
class CTextEditorModel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.toolbar = new CPanel(this);
        this.btnSave = new CButton(this.toolbar);
        this.btnOpen = new CButton(this.toolbar);
        this.btnJsonAlign = new CButton(this.toolbar);
        this.btnJsonNotAlign = new CButton(this.toolbar);
        this.textArea = new CTextArea(this);
        let self = this;
        this.btnSave.onClick = function () {
            self.saveFile();
        };
        this.btnOpen.onClick = function () {
            self.loadFile();
        };
        this.btnJsonAlign.onClick = function () {
            let o = JSON.parse(self.textArea.text);
            self.textArea.text = JSON.stringify(o, undefined, 4);
        };
        this.btnJsonNotAlign.onClick = function () {
            let o = JSON.parse(self.textArea.text);
            self.textArea.text = JSON.stringify(o);
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "toolbar", this.toolbar.toData(), {}, true);
        CDataClass.putData(data, "btnSave", this.btnSave.toData(), {}, true);
        CDataClass.putData(data, "btnOpen", this.btnOpen.toData(), {}, true);
        CDataClass.putData(data, "btnJsonAlign", this.btnJsonAlign.toData(), {}, true);
        CDataClass.putData(data, "btnJsonNotAlign", this.btnJsonNotAlign.toData(), {}, true);
        CDataClass.putData(data, "textArea", this.textArea.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.toolbar.fromData(CDataClass.getData(data, "toolbar", {}, true));
        this.btnSave.fromData(CDataClass.getData(data, "btnSave", {}, true));
        this.btnOpen.fromData(CDataClass.getData(data, "btnOpen", {}, true));
        this.btnJsonAlign.fromData(CDataClass.getData(data, "btnJsonAlign", {}, true));
        this.btnJsonNotAlign.fromData(CDataClass.getData(data, "btnJsonNotAlign", {}, true));
        this.textArea.fromData(CDataClass.getData(data, "textArea", {}, true));
    }
    async loadFile() {
        let self = this;
        CSystem.loadFromFile(function (f) {
            f.text().then(function (s) {
                self.textArea.text = s;
            });
        });
    }
    async saveFile() {
        let self = this;
        CSystem.prompt("Save File", ["File name"], CSystem.browserCovers.get("cover"), function (arr) {
            CSystem.saveAsFile(self.textArea.text, arr[0] + ".txt");
        });
    }
}
class CTextEditorFrame extends CTextEditorModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "textEditor.frame";
    }
}
class CTextEditor extends CWindowBlue {
    constructor(parent, name) {
        super(parent, name);
        this.editor = new CTextEditorFrame(this.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
class CTextAreaFrameModel extends CPanel {
    constructor() {
        super(...arguments);
        this.btnOk = new CButton(this);
        this.textArea = new CTextArea(this);
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "btnOk", this.btnOk.toData(), {}, true);
        CDataClass.putData(data, "textArea", this.textArea.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.btnOk.fromData(CDataClass.getData(data, "btnOk", {}, true));
        this.textArea.fromData(CDataClass.getData(data, "textArea", {}, true));
    }
}
class CTextAreaFrame extends CTextAreaFrameModel {
    constructor(parent, name) {
        super(parent, name);
        this.resource = "textArea.frame";
    }
}
class CAppTextEditor extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 1200;
        this.defaultHeight = 600;
        this.appName = "Text editor";
        //this.mainWindow.resource = "windowBlue.frame"
        this.editor = new CTextEditorFrame(this.mainWindow.body);
        this.editor.position.align = EPositionAlign.CLIENT;
    }
}
