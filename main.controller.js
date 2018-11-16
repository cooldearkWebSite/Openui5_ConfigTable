sap.ui.define([
   "sap/ui/core/mvc/Controller",   
   "sap/ui/model/resource/ResourceModel",
   "sap/m/MessageToast"
], function (Controller,ResourceModel,MessageToast) {
   "use strict";
   return Controller.extend("mgmtPRConfing.controller.main", {	
	   onInit:function(oEvent){
	   
       },
       onAfterRendering:function(){   
    	   this.getPRList();
       },
       getPRList:function(){
          var oCom=this.getOwnerComponent();
          var conListModel=oCom.getModel('conListData');
       	  var conListData=conListModel.getData();  
       	  $.ajax({
   	    	type: "get",
   		    async: false,
               contentType : "application/json",
               url : "/coe.com.sap~ca_promotion~web/rest/PR/findallPRConfig_ApplyDate",   
               dataType : "json",
               cache: false, 
               success :function(data,textStatus,jqXHR) {
       		  			conListModel.setData(data);
               },
               error:function(data,textStatus,jqXHR){
            	   sap.m.MessageToast.show("配置信息獲取失敗");
               }
           });
       },
       change:function(oEvent){
    	   var oView=this.getView();
    	   var oTable=oView.byId('level_table');
    	   if(oTable.getSelectedItem()==null || oTable.getSelectedItem()==undefined){
    		   sap.m.MessageToast.show("請選擇欲修改項目");
    	   }else{
    	   var oItem=oTable.getSelectedItem();
    	   var index=oTable.indexOfItem(oItem);
    	   oTable.removeSelections();
    	   var oCom=this.getOwnerComponent();
    	   var zDataModel=oCom.getModel('ZData');
           var zData=zDataModel.getData();  
           var conListModel=oCom.getModel('conListData');
           var conListData=conListModel.getData();  
           zData.tmp_item=conListData[index];
           zDataModel.setData(zData);
           this.ValueCheckInput(zData.tmp_item.ConfigValue);
    	   var oApp = this.getView().byId("mainApp");
	   	   oApp.to(this.getView().byId("page_add"));
    	   }
       },
       submit:function(){
    	   var oController=this;
    	   var oView=this.getView();
    	   var oCom=this.getOwnerComponent();
    	   var zDataModel=oCom.getModel('ZData');
           var zData=zDataModel.getData(); 
           if(zData.tmp_item.ConfigValue==undefined||zData.tmp_item.ConfigValue==""){
        	   sap.m.MessageToast.show("請輸入數值");
        	   return;
           }else if(zData.tmp_item.ConfigValue>28 ||zData.tmp_item.ConfigValue<0){
        	   sap.m.MessageToast.show("輸入數值需在0~28區間");
        	   return;
           }
           var input=zData.tmp_item;
           var dialog = new sap.m.Dialog({
				title: "確認",
				type: 'Message',
				content: [
					new sap.m.Text({text:"是否確認提交修改的内容？"})
				],
				beginButton: new sap.m.Button({
					text: "確認",
					press: function () {
					    var result=oController._submit(input);						    
					    dialog.close();
					    if(result){
					    	oController.getPRList();
				    	    var oApp = oView.byId("mainApp");
					   		oApp.to(oView.byId("page_display"));
					    }
					}
				}),
				endButton: new sap.m.Button({
					text:  "取消",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});	   		
	   		dialog.open(); 
       },
       _submit:function(input){
    	   var result=true;
           var url="/coe.com.sap~ca_promotion~web/rest/PR/updatePRConfig_ApplyDate";
    	   $.ajax({
	 	    	type: "post",
	 		    async: false,
	 	        contentType : "application/json",
	 	        url :url,
	 	        data:JSON.stringify(input),
	 	        dataType : "json",
	 	        cache: false, 
	 	        success : function(data,textStatus,jqXHR) {	 			        
	 			    if(data!=null&&data!=undefined){
	 			    	if(data.type=="s"){
	 			    		sap.m.MessageToast.show("提交成功"); 
	 			    	}else{
	 			    		sap.m.MessageToast.show(data.msg); 
	 			    		result=false;
	 			    	}
	 			    }else{
	 			    	sap.m.MessageToast.show("提交失敗"); 
	 			    	result=false;
	 			    }
	 	        },
	 	        error:function(data,textStatus,jqXHR){
	 	        	sap.m.MessageToast.show("提交失敗"); 
	 	        	result=false;
	 	        }
	       });	
    	   return result;
       },
       checkInput:function(oEvent){
    	   var Input = oEvent.getSource();
    	   var getValue = Input.getValue();
    	   getValue = getValue.replace(/[^\d]/g, '');
    	   Input.setValue(getValue);
    	   this.ValueCheckInput(getValue);
       },
       cancel:function(){
    	   var oApp = this.getView().byId("mainApp");
	   	   oApp.to(this.getView().byId("page_display"));
       },
       ValueCheckInput:function(value){
    	   var checkInput=this.getView().byId("saveButton");
    	   var empty;
    	   var that=this;
    	   function checkText(){
    		   var textValue=new sap.ui.model.json.JSONModel(empty);
    		   that.getView().setModel(textValue,"textValue");
    	   }
    	   if(value=="" || value==undefined || value.trim()==""){
    		   empty={"status":"Error","string":"請輸入數值"};
    		   checkText();
    		   checkInput.setEnabled(false);
    	   }else if(value>28 || value<0){
    		   empty={"status":"Error","string":"輸入數值需在0~28區間"};
    		   checkText();
    		   checkInput.setEnabled(false);
    	   }else{
    		   empty={"status":"None"};
    		   checkText();
    		   checkInput.setEnabled(true);
    	   }
       },
       handleHintSpecial:function(){
       }
   });
});
