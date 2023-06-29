"use strict";
async function loadDesktop() {
    let isDesktop = false;
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
        CApplication.systemIcon.set("CAppDonation", "heart.control");
        CTaskbar.fixListLeft.add("CAppPathEditor");
        CTaskbar.fixListLeft.add("CAppLayersSceneEditor");
        CTaskbar.fixListLeft.add("CAppGraphEditor");
        CTaskbar.fixListRight.add("CAppSetting");
        CTaskbar.fixListRight.add("CAppDonation");
        CSystem.setDesktopSize(CSystem.desktopAlignKind);
        isDesktop = true;
        let manual = new CIcon(desktop.iconLayer);
        manual.resource = "button_manual.control";
        manual.position.left = 50;
        manual.position.top = 50;
        manual.linkClassName = "CManual";
    });
    CSystem.onResourceLazyLoad.push(function () {
        let iv = setInterval(function () {
            if (isDesktop) {
                let sticker = new CStickerModel(CSystem.desktopList.get(0).applicationLayer);
                sticker.resource = "sticker_moon_하얀달만.frame";
                sticker.title = "(C) 2023. (bellground) all rights reserved.";
                sticker.txtDesc.text = "bellground.com@gmail.com";
                sticker.position.left = 211;
                sticker.position.top = 30;
                sticker.position.width = 400;
                sticker.position.height = 150;
                let sticker2 = new CStickerModel(CSystem.desktopList.get(0).applicationLayer);
                sticker2.resource = "sticker_base.frame";
                sticker2.title = "Notice";
                sticker2.txtDesc.text = "Test";
                sticker2.position.left = 640;
                sticker2.position.top = 30;
                sticker2.position.width = 400;
                sticker2.position.height = 150;
                /*let app = new CSubtitleEditor()
                app.desktop = CSystem.desktopList.get(0)
                app.execute()*/
                clearInterval(iv);
            }
        }, 100);
    });
}
