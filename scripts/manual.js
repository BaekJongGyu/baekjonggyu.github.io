"use strict";
class CManualViewer extends CIFrame {
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
        let self = this;
        this.mainWindow.body.layers.get(0).items.get(0).fill.solidColor = "#000000";
        this.list = new CObjectTreeListBox(this.mainWindow.body);
        this.list.resource = "treelist_blue.control";
        this.list.position.align = EPositionAlign.LEFT;
        let sl = new CSplitter(this.mainWindow.body);
        sl.position.width = 5;
        sl.position.align = EPositionAlign.LEFT;
        this.viewer = new CManualViewer(this.mainWindow.body);
        this.viewer.position.align = EPositionAlign.CLIENT;
        this.list.onSelectItem = function () {
            if (self.list.selectItems.length > 0 && self.list.selectItems[0].value.asObject["id"] != "") {
                self.viewer.src = "https://www.youtube.com/embed/" + self.list.selectItems[0].value.asObject["id"];
            }
        };
        this.refresh();
    }
    refresh() {
        this.list.items.clear();
        function add(treedata, item) {
            let ti = treedata.addItem({ text: item.name, id: item.id });
            for (let n = 0; n < item.childs.length; n++) {
                add(ti.items, item.childs[n]);
            }
        }
        for (let n = 0; n < CManual.manualList.length; n++) {
            add(this.list.items, CManual.manualList[n]);
        }
        this.list.items.expandAll();
    }
}
CManual.manualList = new Array();
{
    let simpleCategory = new CManualItem("Simple example", "");
    CManual.manualList.push(simpleCategory);
    simpleCategory.addItem(new CManualItem("Ball bounce", "0GZAFKbbJ6g"));
    simpleCategory.addItem(new CManualItem("Spaceship", "kpMg7eVyQJ8"));
}
