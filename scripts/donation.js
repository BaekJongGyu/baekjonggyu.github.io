"use strict";
class CAppDonation extends CWindowApplication {
    constructor() {
        super(...arguments);
        this.defaultWidth = 300;
        this.defaultHeight = 230;
        this.appName = "Donation";
    }
    doExecute() {
        super.doExecute();
        this._mainWindow.body.layers.get(0).items.get(0).fill.solidColor = "#101026";
        this._mainWindow.body.position.padding.all = 10;
        let btn = new CPanel(this._mainWindow.body);
        btn.resource = "button_gray_gra.control";
        btn.position.height = 30;
        btn.position.align = EPositionAlign.TOP;
        btn.text = "USD 1";
        btn.onClick = async function () {
            window.open("https://linuxstiker.cafe24.com/donation1", "popup", "width=500,height=500");
        };
        btn = new CPanel(this._mainWindow.body);
        btn.resource = "button_gray_gra.control";
        btn.position.margins.top = 5;
        btn.position.height = 30;
        btn.position.align = EPositionAlign.TOP;
        btn.text = "USD 5";
        btn.onClick = async function () {
            window.open("https://linuxstiker.cafe24.com/donation5", "popup", "width=500,height=500");
        };
        btn = new CPanel(this._mainWindow.body);
        btn.resource = "button_gray_gra.control";
        btn.position.margins.top = 5;
        btn.position.height = 30;
        btn.position.align = EPositionAlign.TOP;
        btn.text = "USD 10";
        btn.onClick = async function () {
            window.open("https://linuxstiker.cafe24.com/donation10", "popup", "width=500,height=500");
        };
        btn = new CPanel(this._mainWindow.body);
        btn.resource = "button_gray_gra.control";
        btn.position.margins.top = 5;
        btn.position.height = 30;
        btn.position.align = EPositionAlign.TOP;
        btn.text = "USD 50";
        btn.onClick = async function () {
            window.open("https://linuxstiker.cafe24.com/donation50", "popup", "width=500,height=500");
        };
        btn = new CPanel(this._mainWindow.body);
        btn.resource = "button_gray_gra.control";
        btn.position.margins.top = 5;
        btn.position.height = 30;
        btn.position.align = EPositionAlign.TOP;
        btn.text = "USD 100";
        btn.onClick = async function () {
            window.open("https://linuxstiker.cafe24.com/donation100", "popup", "width=500,height=500");
        };
    }
}
