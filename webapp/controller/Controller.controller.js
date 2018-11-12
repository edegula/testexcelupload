/* global XLSX*/
sap.ui.define(
		[
		'sap/m/MessageToast',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/ui/core/format/DateFormat',
		'com/kalayaan/edegula/ExcelUpload/libs/xlsx.full.min'
		],
	function(MessageToast, Controller, JSONModel, DateFormat, xlsx, jszip) {
	"use strict";

	var ControllerController = Controller.extend("com.kalayaan.edegula.ExcelUpload.Controller", {
		
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			MessageToast.show(sResponse);
		},
		
		handleSaveFile: function(oEvent) {
		  
		   var sServiceUrl = "/sap/opu/odata/sap/Z_VMI_SRV"; // ODATA URL

           var oDModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
           
           oDModel.read("ReplenishmentRuleSet?$filter=(SalesOrganization ge '1207' and DistChannel eq 'RO' and Plant eq '1002')", {
           
                    success: function(oRetrievedResult, response) { 
                        /* do something */ 
                        MessageToast.show("Odata Call Success!");
                        
                    },
                    error: function(oError) { /* do something */ 
                        MessageToast.show("Error");
                    }
                }
            );
		    
		},
		
		handleUploadPress: function(oEvent) {

			var fU = this.getView().byId("fileUploader");
    		var domRef = fU.getFocusDomRef();
    		var file = domRef.files[0];
    		
    		var tableDisplay = this.getView().byId("tableDisplay2");
    		
    		var reader = new FileReader();
    		
    		var convertRowObjectArrayToRecords = function(excelData) {
        	    excelData.Sheet1.splice(0,1);
        	    
        	    var items = [];
        	    
        	    for( var i = 0; i < excelData.Sheet1.length; i++) {
        	        items.push({
        	            "Field1" : excelData.Sheet1[i][0],
        	            "Field2" : excelData.Sheet1[i][1],
        	            "Field3" : excelData.Sheet1[i][3],
        	        });
        	    }
        	    
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
