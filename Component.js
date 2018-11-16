jQuery.sap.declare("mgmtPRConfing.Component");
sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"   
], function (UIComponent, JSONModel, ResourceModel) {
    "use strict";
    return UIComponent.extend("mgmtPRConfing.Component", {    
    init : function () {
    	UIComponent.prototype.init.apply(this, arguments); 
    },
    createContent : function(){    
	    var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
	    var i18nModel = new sap.ui.model.resource.ResourceModel({
	        bundleUrl: "../i18n/i18n.properties",
	        locale: sLocale
	    });
	    this.setModel(i18nModel, "i18n");
		
	    var oBundle = i18nModel.getResourceBundle();
//	    
	    var conListData =[];			
	    var conListModel = new sap.ui.model.json.JSONModel(conListData);
	    this.setModel(conListModel, "conListData");
	    
	    var zData ={
	    	"tmp_item":{},
	    	"type":""
	    };			
	    var zModel = new sap.ui.model.json.JSONModel(zData);
	    this.setModel(zModel, "ZData");
	    
        var oView= sap.ui.view({
 			viewName : "mgmtPRConfing.view.main",
 			type : sap.ui.core.mvc.ViewType.XML,
 			viewData : { component : this }
 		});
		return oView;	
    }   
    });
});
