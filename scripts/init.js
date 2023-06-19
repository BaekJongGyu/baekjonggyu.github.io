"use strict";
async function loadDesktop() {
    CSystem.onResourceLoad.push(function () {
        let cover = new CCover(document.body);
        cover.resource = "cover.control";
        CSystem.browserCovers.set("cover2", cover);
        let desktop = CSystem.newDesktop();
        desktop.resource = "desktop_dark2.control";
        CApplication.systemIcon.set("CAppPathEditor", "shape_button.control");
        CApplication.systemIcon.set("CAppLayersSceneEditor", "scene_button.control");
        CApplication.systemIcon.set("CAppGraphEditor", "graph_button.control");
        CApplication.systemIcon.set("CAppSetting", "gear_button.control");
        CTaskbar.fixListLeft.add("CAppPathEditor");
        CTaskbar.fixListLeft.add("CAppLayersSceneEditor");
        CTaskbar.fixListLeft.add("CAppGraphEditor");
        CTaskbar.fixListRight.add("CAppSetting");
        CSystem.setDesktopSize(CSystem.desktopAlignKind);
    });
    CSystem.onResourceLazyLoad.push(function () {
        //CTime.execAfterTimework(function() {
        let sticker = new CStickerModel(CSystem.desktopList.get(0).applicationLayer);
        sticker.resource = "sticker_moon_하얀달만.frame";
        sticker.title = "(C) 2020. (bellground) all rights reserved.";
        sticker.txtDesc.text = "bellground.com@gmail.com";
        sticker.position.left = 600;
        sticker.position.top = 50;
        sticker.position.width = 400;
        sticker.position.height = 150;
        //})
        //CTime.execAfterTimework(function() {
        let sticker2 = new CStickerModel(CSystem.desktopList.get(0).applicationLayer);
        sticker2.resource = "sticker_base.frame";
        sticker2.title = "Notice";
        sticker2.txtDesc.text = "";
        sticker2.position.left = 600;
        sticker2.position.top = 250;
        sticker2.position.width = 400;
        sticker2.position.height = 150;
        //})
    });
}
