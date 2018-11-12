sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";
	var Component = UIComponent.extend("sap.ui.unified.edegula.ExcelUpload.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.unified.edegula.ExcelUpload.view.View",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.ui.unified",
					"sap.ui.table",
					"sap.m"
				]
			},
			includes: ["../style.css"],
			config: {
				"sample": {
					"files": [
						"View.view.xml",
						"Controller.controller.js"
					]
				},
				"serviceConfig": {
					"name": "Z_VMI_SRV",
					"serviceUrl": "/sap/opu/odata/sap/Z_VMI_SRV/"
				}
			}
		}
	});
	return Component;
});