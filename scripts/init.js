"use strict";
async function loadDesktop() {
    CSystem.onResourceLoad.push(function () {
        let cover = new CCover(document.body);
        cover.resource = "cover.control";
        CSystem.browserCovers.set("cover2", cover);
    });
}
