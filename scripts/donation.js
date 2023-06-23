"use strict";
class CDonationFrameModel extends CPanel {
    constructor(parent, name) {
        super(parent, name);
        this.btn1 = new CButton(this);
        this.btn5 = new CButton(this);
        this.btn10 = new CButton(this);
        this.btn50 = new CButton(this);
        this.btn100 = new CButton(this);
        this.btn1.onClick = function () {
            window.open("https://linuxstiker.cafe24.com/donation1", "popup", "width=500,height=500");
        };
        this.btn5.onClick = function () {
            window.open("https://linuxstiker.cafe24.com/donation5", "popup", "width=500,height=500");
        };
        this.btn10.onClick = function () {
            window.open("https://linuxstiker.cafe24.com/donation10", "popup", "width=500,height=500");
        };
        this.btn50.onClick = function () {
            window.open("https://linuxstiker.cafe24.com/donation50", "popup", "width=500,height=500");
        };
        this.btn100.onClick = function () {
            window.open("https://linuxstiker.cafe24.com/donation100", "popup", "width=500,height=500");
        };
    }
    doToData(data) {
        super.doToData(data);
        CDataClass.putData(data, "btn1", this.btn1.toData(), {}, true);
        CDataClass.putData(data, "btn5", this.btn5.toData(), {}, true);
        CDataClass.putData(data, "btn10", this.btn10.toData(), {}, true);
        CDataClass.putData(data, "btn50", this.btn50.toData(), {}, true);
        CDataClass.putData(data, "btn100", this.btn100.toData(), {}, true);
    }
    doFromData(data) {
        super.doFromData(data);
        this.btn1.fromData(CDataClass.getData(data, "btn1", {}, true));
        this.btn5.fromData(CDataClass.getData(data, "btn5", {}, true));
        this.btn10.fromData(CDataClass.getData(data, "btn10", {}, true));
        this.btn50.fromData(CDataClass.getData(data, "btn50", {}, true));
        this.btn100.fromData(CDataClass.getData(data, "btn100", {}, true));
    }
}
class CAppDonation extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 516;
        this.defaultHeight = 366;
        this.appName = "Donate";
        this.frame = new CDonationFrameModel(this.mainWindow.body);
        this.frame.resource = "donation.frame";
        this.frame.position.align = EPositionAlign.CLIENT;
        this.frame.filter.filterSet.hueRotate = true;
        this.frame.filter.hueRotateValue = Math.random() * 360;
    }
}
