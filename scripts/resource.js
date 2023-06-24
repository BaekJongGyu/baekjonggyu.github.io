"use strict";
function loadSystemResource() {
    return new Promise(function (rs) {
        let map = new Map();
        map.set("acc_head_10000.graph", "https://baekjonggyu.github.io/resource/acc_head_10000.graph");
        map.set("line_10000.graph", "https://baekjonggyu.github.io/resource/line_10000.graph");
        map.set("heart_10000.graph", "https://baekjonggyu.github.io/resource/heart_10000.graph");
        map.set("clock_moon.layers", "https://baekjonggyu.github.io/resource/clock_moon.layers");
        map.set("layer_editor_icon_1.layers", "https://baekjonggyu.github.io/resource/layer_editor_icon_1.layers");
        map.set("layer_editor_icon_2.layers", "https://baekjonggyu.github.io/resource/layer_editor_icon_2.layers");
        map.set("texteditor_1.layers", "https://baekjonggyu.github.io/resource/texteditor_1.layers");
        map.set("texteditor_2.layers", "https://baekjonggyu.github.io/resource/texteditor_2.layers");
        map.set("graph_editor_icon_1.layers", "https://baekjonggyu.github.io/resource/graph_editor_icon_1.layers");
        map.set("graph_editor_icon_2.layers", "https://baekjonggyu.github.io/resource/graph_editor_icon_2.layers");
        map.set("scene_open.layers", "https://baekjonggyu.github.io/resource/scene_open.layers");
        map.set("scene_close.layers", "https://baekjonggyu.github.io/resource/scene_close.layers");
        map.set("설명서1.layers", "https://baekjonggyu.github.io/resource/설명서1.layers");
        map.set("설명서2.layers", "https://baekjonggyu.github.io/resource/설명서2.layers");
        map.set("graph_button.control", "https://baekjonggyu.github.io/resource/graph_button.control");
        map.set("shape_button.control", "https://baekjonggyu.github.io/resource/shape_button.control");
        map.set("text_button.control", "https://baekjonggyu.github.io/resource/text_button.control");
        map.set("scene_button.control", "https://baekjonggyu.github.io/resource/scene_button.control");
        map.set("gear_button.control", "https://baekjonggyu.github.io/resource/gear_button.control");
        map.set("desktop_dark2.control", "https://baekjonggyu.github.io/resource/desktop_dark2.control");
        map.set("heart.control", "https://baekjonggyu.github.io/resource/heart.control");
        map.set("button_manual.control", "https://baekjonggyu.github.io/resource/button_manual.control");
        map.forEach(function (v, k) {
            fetchBody(v)
                .then(function (json) {
                CSystem.resources.set(k, JSON.parse(json));
                map.delete(k);
                if (map.size == 0) {
                    rs();
                }
            });
        });
    });
}
async function loadLazyResource() {
    let map = new Map();
    map.set("treeitem_check_small_f20.canvasitems", "https://baekjonggyu.github.io/resource/treeitem_check_small_f20.canvasitems");
    map.set("treeitem_check_small32.canvasitems", "https://baekjonggyu.github.io/resource/treeitem_check_small32.canvasitems");
    map.set("black18.canvasitems", "https://baekjonggyu.github.io/resource/black18.canvasitems");
    map.set("blackGra18.canvasitems", "https://baekjonggyu.github.io/resource/blackGra18.canvasitems");
    map.set("cellL20.canvasitems", "https://baekjonggyu.github.io/resource/cellL20.canvasitems");
    map.set("cellL28.canvasitems", "https://baekjonggyu.github.io/resource/cellL28.canvasitems");
    map.set("listitem24.canvasitems", "https://baekjonggyu.github.io/resource/listitem24.canvasitems");
    map.set("listitem32.canvasitems", "https://baekjonggyu.github.io/resource/listitem32.canvasitems");
    map.set("cellBlue.canvasitems", "https://baekjonggyu.github.io/resource/cellBlue.canvasitems");
    map.set("cellRed.canvasitems", "https://baekjonggyu.github.io/resource/cellRed.canvasitems");
    map.set("blackL.canvasitems", "https://baekjonggyu.github.io/resource/blackL.canvasitems");
    map.set("cellL.canvasitems", "https://baekjonggyu.github.io/resource/cellL.canvasitems");
    map.set("cellL2.canvasitems", "https://baekjonggyu.github.io/resource/cellL2.canvasitems");
    map.set("blackGlass.canvasitems", "https://baekjonggyu.github.io/resource/blackGlass.canvasitems");
    map.set("black.canvasitems", "https://baekjonggyu.github.io/resource/black.canvasitems");
    map.set("selectAreaCursor.control", "https://baekjonggyu.github.io/resource/selectAreaCursor.control");
    map.set("scrollbar24.control", "https://baekjonggyu.github.io/resource/scrollbar24.control");
    map.set("controlSelector_rotation.control", "https://baekjonggyu.github.io/resource/controlSelector_rotation.control");
    map.set("path_controller.control", "https://baekjonggyu.github.io/resource/path_controller.control");
    map.set("hint.control", "https://baekjonggyu.github.io/resource/hint.control");
    map.set("listbox16noMargin.control", "https://baekjonggyu.github.io/resource/listbox16noMargin.control");
    map.set("scrollbar20.control", "https://baekjonggyu.github.io/resource/scrollbar20.control");
    map.set("shape_ellipse.control", "https://baekjonggyu.github.io/resource/shape_ellipse.control");
    map.set("shape_empty.control", "https://baekjonggyu.github.io/resource/shape_empty.control");
    map.set("shape_horn.control", "https://baekjonggyu.github.io/resource/shape_horn.control");
    map.set("shape_poligon.control", "https://baekjonggyu.github.io/resource/shape_poligon.control");
    map.set("shape_rectangle.control", "https://baekjonggyu.github.io/resource/shape_rectangle.control");
    map.set("shape_text.control", "https://baekjonggyu.github.io/resource/shape_text.control");
    map.set("button16_2.control", "https://baekjonggyu.github.io/resource/button16_2.control");
    map.set("scrollbar32.control", "https://baekjonggyu.github.io/resource/scrollbar32.control");
    map.set("textbox24.control", "https://baekjonggyu.github.io/resource/textbox24.control");
    map.set("textbox32.control", "https://baekjonggyu.github.io/resource/textbox32.control");
    map.set("label_center.control", "https://baekjonggyu.github.io/resource/label_center.control");
    map.set("label_left.control", "https://baekjonggyu.github.io/resource/label_left.control");
    map.set("textbox16.control", "https://baekjonggyu.github.io/resource/textbox16.control");
    map.set("button8.control", "https://baekjonggyu.github.io/resource/button8.control");
    map.set("empty.control", "https://baekjonggyu.github.io/resource/empty.control");
    map.set("textboxDarkEditor.control", "https://baekjonggyu.github.io/resource/textboxDarkEditor.control");
    map.set("button_gray_gra.control", "https://baekjonggyu.github.io/resource/button_gray_gra.control");
    map.set("handle_white.control", "https://baekjonggyu.github.io/resource/handle_white.control");
    map.set("colorselector16.control", "https://baekjonggyu.github.io/resource/colorselector16.control");
    map.set("control_position_editor.control", "https://baekjonggyu.github.io/resource/control_position_editor.control");
    map.set("button_donate.control", "https://baekjonggyu.github.io/resource/button_donate.control");
    map.set("graphEditor.frame", "https://baekjonggyu.github.io/resource/graphEditor.frame");
    map.set("window_sky.frame", "https://baekjonggyu.github.io/resource/window_sky.frame");
    map.set("window_sky_dialog.frame", "https://baekjonggyu.github.io/resource/window_sky_dialog.frame");
    map.set("textEditor.frame", "https://baekjonggyu.github.io/resource/textEditor.frame");
    map.set("layerPathEditor.frame", "https://baekjonggyu.github.io/resource/layerPathEditor.frame");
    map.set("chiled_window_20_dialog.frame", "https://baekjonggyu.github.io/resource/chiled_window_20_dialog.frame");
    map.set("sceneEditor.frame", "https://baekjonggyu.github.io/resource/sceneEditor.frame");
    map.set("sceneExample.frame", "https://baekjonggyu.github.io/resource/sceneExample.frame");
    map.set("timeSpeedGraphEditor.frame", "https://baekjonggyu.github.io/resource/timeSpeedGraphEditor.frame");
    map.set("fillEditor.frame", "https://baekjonggyu.github.io/resource/fillEditor.frame");
    map.set("strokeEditor.frame", "https://baekjonggyu.github.io/resource/strokeEditor.frame");
    map.set("gradientEditor.frame", "https://baekjonggyu.github.io/resource/gradientEditor.frame");
    map.set("sticker_moon_하얀달만.frame", "https://baekjonggyu.github.io/resource/sticker_moon_하얀달만.frame");
    map.set("sticker_base.frame", "https://baekjonggyu.github.io/resource/sticker_base.frame");
    map.set("donation.frame", "https://baekjonggyu.github.io/resource/donation.frame");
    map.forEach(function (v, k) {
        fetchBody(v)
            .then(function (json) {
            CSystem.resources.set(k, JSON.parse(json));
            map.delete(k);
            if (map.size == 0) {
                doLoadLazyResource();
            }
        });
    });
}
function doLoadLazyResource() {
    for (let n = 0; n < CSystem.onResourceLazyLoad.length; n++) {
        CSystem.onResourceLazyLoad[n]();
    }
}
