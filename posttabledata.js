var items = [];// intializing an array

var aTableData = oTable.getModel().getData();// getting table data

for (i = 0; i < oTableData.length; i++) {

items.push( {

“ItemKey”: aTableData[i].Item,

“ItempartGrp”: oTableData[i].itemcodegroup,

  “ItempartCod”: oTableData[i].itemcode,

  “ItemdefectGrp”: oTableData[i].problemcodegroup,

  “ItemdefectCod”: oTableData[i].problemcode,

  “ItemdefectShtxt”: oTableData[i].problemdescription,

  “CauseGrp”: oTableData[i].causegroup,

  “CauseCod”: oTableData[i].causecode,

  “CauseShtxt”: oSel[i].causedescription,

  });

}

// oEntry is the main object to send data using batch operation.

//Pushing table data with some other values(i,e NotifType,FunctionLoc).

  var oEntry = {

  “NotifType”: xtitle,

  “Qmnum”: ” “,

  “NotifShorttxt”: shrttext,

  “FunctionLoc”: FuncLocation,

  “Equipment”: Equipmentno,

“NavNotifItems”: JSON.parse(JSON.stringify(items)),

  //  converting data into json format

// string type will converted into json object by parsing it.

};

  var sServiceUrl = “http://your url SRV/”; // ODATA URL

  var oDModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

//creating batch operation

  oDModel.create(“/url”, oEntry, null, function(oData, oResponse)

  {

  //function openDialog() {

  var oDialog1 = new sap.m.Dialog();

  oDialog1.setTitle(“Success Message”);

  var ovalue = new sap.m.Text({

  text: “Notification” + oData.Qmnum + ” is Created”

  });

  var oVmain = new sap.m.FlexBox(“Dialog”, {

  items: [ovalue]

  });

  oDialog1.addContent(oVmain);

  oDialog1.addButton(new sap.m.Button({

  text: “OK”,

  press: function() {

  oDialog1.close();

  }

  }));

  oDialog1.open();

  // };

  console.log(oResponse);

                sap.ui.getCore().byId(“detailPage”).rerender();

  },

  function(err) {

     //Error Callback

   jQuery.sap.require(“sap.m.MessageBox”);

      sap.m.MessageBox.show((JSON.parse(err.response.body).error.message.value));

    }