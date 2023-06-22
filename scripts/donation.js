"use strict";
class CAppDonation extends CWindowApplication {
    constructor() {
        super(...arguments);
        this.defaultWidth = 300;
        this.defaultHeight = 200;
        this.appName = "Donation";
        this.donationScript = `
    paypal.Buttons({
        createOrder() {
            return fetch("http://locahost:3000/create-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart: [
                {
                    sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
                    quantity: "YOUR_PRODUCT_QUANTITY",
                },
                ],
            }),
            })
            .then((response) => response.json())
            .then((order) => order.id);
        },
        onApprove(data) {
            return fetch("http://locahost:3000/capture-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
            })
            .then((response) => response.json())
            .then((orderData) => {
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                const transaction = orderData.purchase_units[0].payments.captures[0];
                alert("See console for all available details");
            });
        }
    }).render('#paypal-button-container');`;
    }
    doExecute() {
        super.doExecute();
        this._mainWindow.body.layers.get(0).items.get(0).fill.solidColor = "#101026";
        let pan = new CPanel(this._mainWindow.body);
        pan.position.align = EPositionAlign.CLIENT;
        this._mainWindow.body.position.padding.all = 10;
        pan.controlElement.setAttribute("id", "paypal-button-container");
        let fn = new Function(this.donationScript);
        fn();
    }
}
