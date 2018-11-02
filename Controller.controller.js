/* global XLSX*/
sap.ui.define(
		[
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/ui/core/format/DateFormat',
		'sap/ui/unified/sample/FileUploaderBasic/libs/xlsx.full.min'
		],
	function(MessageToast, Controller, JSONModel, DateFormat, xlsx, jszip) {
	"use strict";

	var ControllerController = Controller.extend("sap.ui.unified.sample.FileUploaderBasic.Controller", {
		
		onInit : function () {
			// set explored app's demo model on this sample
			var oJSONModel = this.initSampleDataModel();
			this.getView().byId("tableDisplay").setModel(oJSONModel);

		},

		initSampleDataModel : function() {
			var oModel = new JSONModel();
			var oDateFormat = DateFormat.getDateInstance({source: {pattern: "timestamp"}, pattern: "dd/MM/yyyy"});

			jQuery.ajax(sap.ui.require.toUrl("sap/ui/demo/mock") + "/products.json", {
				dataType: "json",
				success: function (oData) {
					var aTemp1 = [];
					var aTemp2 = [];
					var aSuppliersData = [];
					var aCategoryData = [];
					for (var i = 0; i < oData.ProductCollection.length; i++) {
						var oProduct = oData.ProductCollection[i];
						if (oProduct.SupplierName && jQuery.inArray(oProduct.SupplierName, aTemp1) < 0) {
							aTemp1.push(oProduct.SupplierName);
							aSuppliersData.push({Name: oProduct.SupplierName});
						}
						if (oProduct.Category && jQuery.inArray(oProduct.Category, aTemp2) < 0) {
							aTemp2.push(oProduct.Category);
							aCategoryData.push({Name: oProduct.Category});
						}
						oProduct.DeliveryDate = (new Date()).getTime() - (i % 10 * 4 * 24 * 60 * 60 * 1000);
						oProduct.DeliveryDateStr = oDateFormat.format(new Date(oProduct.DeliveryDate));
						oProduct.Heavy = oProduct.WeightMeasure > 1000 ? "true" : "false";
						oProduct.Available = oProduct.Status == "Available" ? true : false;
					}

					oData.Suppliers = aSuppliersData;
					oData.Categories = aCategoryData;

					oModel.setData(oData);
				},
				error: function () {
					jQuery.sap.log.error("failed to load json");
				}
			});

			return oModel;
		},
		

	
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			MessageToast.show(sResponse);
		},
		
		handleUploadPress: function(oEvent) {

			var fU = this.getView().byId("fileUploader");
    		var domRef = fU.getFocusDomRef();
    		var file = domRef.files[0];
    		
    		var tableDisplay = this.getView().byId("tableDisplay2");
    		
    		var reader = new FileReader();
    		
    		let convertRowObjectArrayToRecords = function(excelData) {
        	    excelData.Sheet1.splice(0,1);
        	    return excelData;
	        };
    		

    		reader.onload = function(event) {

				var data = reader.result;
    			var workbook = XLSX.read(data, {
        			type: 'binary'
    			});
    			
        		var result = {};
				workbook.SheetNames.forEach(function(sheetName) {
					var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
					if(roa.length) result[sheetName] = roa;
				});
        		
        		convertRowObjectArrayToRecords(result);
        		
        		var oModel = new JSONModel(result);
        		tableDisplay.setModel(oModel);

    		};
    		
    		reader.readAsBinaryString(file);
    		
		}
		

		
	});

	return ControllerController;

});
