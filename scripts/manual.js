"use strict";
class CManualViewer extends CIFrame {
    constructor(parent, name) {
        super(parent, name);
        this.element.src = "https://www.youtube.com/embed/0GZAFKbbJ6g";
    }
}
class CManualItem {
    constructor(name, id) {
        this.name = "";
        this.childs = new Array();
        this.id = "";
        this.name = name;
        this.id = id;
    }
    addItem(item) {
        this.childs.push(item);
    }
}
class CManual extends CWindowApplication {
    constructor() {
        super();
        this.defaultWidth = 700;
        this.defaultHeight = 500;
        this.appName = "Manual";
        this.mainWindow.body.layers.get(0).items.get(0).fill.solidColor = "#000000";
        this.list = new CObjectTreeListBox(this.mainWindow.body);
        this.list.position.align = EPositionAlign.LEFT;
        this.viewer = new CManualViewer(this.mainWindow.body);
        this.viewer.position.align = EPositionAlign.CLIENT;
    }
}
CManual.manualList = new Array();
{
    let simpleCategory = new CManualItem("Simple example", "");
    CManual.manualList.push(simpleCategory);
    simpleCategory.addItem(new CManualItem("Ball bounce", ""));
}
