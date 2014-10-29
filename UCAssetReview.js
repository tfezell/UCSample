var UC =
{
    componentStore: null,
    serviceReturnInfo: null,
    //
    //http://win7frankvm/GTDWS/Dialog/208?pType=Review
    //KMB was here....
    //
    AssetReview: function () {

        var assetReviewWindow = Ext.getCmp("AssetReviewWindow");
        if (assetReviewWindow != null) {
            assetReviewWindow.destroy();
        }

        AssetReviewWindow = new Ext.Window({
            id: "AssetReviewWindow",
            width: 550,
            height: 650,
            plain: true,
            resizable: true,
            title: 'U&C Asset Review',
            closeAction: 'hide',
            collapsible: true,
            border: true
        });


        var AssetReviewPanel = new Ext.Panel({
            labelWidth: 50,
            width: 550,
            height: 650,
            layout: 'border',
            items: [
                     { id: 'AttributeValuesRegion',
                         title: 'Attribute Values',
                         region: 'center',
                         collapsible: false,
                         split: true
                     },
                     {
                         id: 'leftReviewRegion',
                         region: 'west',
                         width: 175,
                         split: true
                     },
                     {
                         title: 'Feature Information',
                         id: 'topReviewRegion',
                         region: 'north',
                         height: 100,
                         split: true,
                         layout: 'column',
                         items: [{ id: 'topColumn1',
                             columnWidth: .50,
                             margins: '0 0 0 0'
                         },
                                  { id: 'topColumn2',
                                      columnWidth: .50,
                                      margins: '0 0 0 0'
                                  }]
                     }
                     ]
        });

        var AssetReviewInsidePanel = new Ext.Panel({
            labelWidth: 75,
            width: 175,
            height: 650,
            layout: 'border',
            items: [
            { id: 'ComponentsRegion',
                title: 'Components',
                region: 'center',
                collapsible: false,
                split: true,
                border: true
            },
            { id: 'RelatedFeaturesRegion',
                title: 'Related Features',
                region: 'south',
                height: 300,
                split: true,
                border: true
            }

            ]
        });

        var leftReviewRegion = Ext.getCmp("leftReviewRegion");
        leftReviewRegion.add(AssetReviewInsidePanel);

        AssetReviewWindow.add(AssetReviewPanel);
        var attributeValuesRegion = Ext.getCmp("AttributeValuesRegion");


        var attributeValuesGrid = new Ext.grid.PropertyGrid({ source: { "a": "b"} });
        attributeValuesGrid.title = 'Attribute Values';
        attributeValuesGrid.autoHeight = true;
        attributeValuesGrid.width = 375;
        attributeValuesRegion.add(attributeValuesGrid);
        attributeValuesGrid.source['c'] = 'd';

        var componentsRegion = Ext.getCmp("ComponentsRegion");

        UC.componentStore = new Ext.data.SimpleStore({
            fields: ['value']
        });
        //        var componentRecords = new Array();
        //        var componentRecord = null;

        //        for (var i = 0; i < 4; ++i) {
        //            var r = {};
        //            r.value = 'Alpha' + i;
        //            componentRecord = new Ext.data.Record(r);
        //            componentRecords[i] = componentRecord;

        //        }
        //        componentStore.add(componentRecords);

        var componentGrid = new Ext.grid.GridPanel({ store: UC.componentStore, columns: [{ width: 175, dataIndex: 'value'}],
            width: 175, height: 650
        });

        componentsRegion.add(componentGrid);
        //        var numComponents = 4;
        //        var componentButton = null;
        //        for (var i = 0; i < numComponents; ++i) {

        //            componentButton = new Ext.Button({ style: 'color: #FFFFFF' });
        //            componentButton.text = 'Component ' + i;
        //            componentsRegion.add(componentButton);
        //        }

        var topColumn1 = Ext.getCmp("topColumn1");
        var topColumn2 = Ext.getCmp("topColumn2");

        var fieldSetLeft = new Ext.form.FieldSet();
        fieldSetLeft.columnWidth = .5;
        fieldSetLeft.collapsible = false;
        fieldSetLeft.autoHeight = false;
        fieldSetLeft.height = 100;
        topColumn1.add(fieldSetLeft);

        var fieldSetRight = new Ext.form.FieldSet();
        fieldSetRight.columnWidth = .5;
        fieldSetRight.collapsible = false;
        fieldSetRight.autoHeight = false;
        fieldSetRight.height = 100;
        topColumn2.add(fieldSetRight);

        this.fnoField = new Ext.form.NumberField();
        this.fnoField.id = 'FnoFieldID';
        this.fnoField.name = 'fno';
        this.fnoField.fieldLabel = 'FNO';
        this.fnoField.hideLabel = false;
        this.fnoField.width = 125;
        fieldSetLeft.add(this.fnoField);

        var fidField = new Ext.form.NumberField();
        fidField.id = 'FidFieldID';
        fidField.name = 'fid';
        fidField.fieldLabel = 'FID';
        fidField.hideLabel = false;
        fidField.width = 125;
        fieldSetLeft.add(fidField);

        var retrieveButton = new Ext.Button();
        retrieveButton.text = 'Retrieve';
        retrieveButton.on('click', UC.RetrieveButtonHandler);

        fieldSetRight.add(retrieveButton);

        AssetReviewWindow.show();

    },

    RetrieveButtonHandler: function (button, e, eOpts) {
        var fnoField = Ext.get("FnoFieldID");
        var fno = fnoField.getValue();
        var fidField = Ext.get("FidFieldID");
        var fid = fidField.getValue();


        Ext.Ajax.request({ url: 'http://win7frankvm/GTDWS/Dialog/208?pType=Review',
//            useDefaultXhrHeader: false,
//            cors: false,
                    success: function (response, opts) {
                        var dialogInfo = Ext.decode(response.responseText);


                        UC.componentStore.removeAll();
                        var componentRecords = new Array();
                        var componentRecord = null;

                        for (var i = 0; i < dialogInfo.items.length; ++i) {
                            var r = {};
                            r.value = dialogInfo.items[i].G3E_USERNAME;
                            componentRecord = new Ext.data.Record(r);
                            componentRecords[i] = componentRecord;

                        }
                        UC.componentStore.add(componentRecords);

                        console.log(dialogInfo);
                    },
                    failure: function (response, opts) {
                        console.log('GTDWS Failure - ' + response.status);
                    }
                });

        //
        //  Name: Access-Control-Allow-Origin
        //  Value: *
        //
//        var httpRequest;
//        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
//            httpRequest = new XMLHttpRequest();
//        } else if (window.ActiveXObject) { // IE 8 and older
//            httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
//        }

//        httpRequest.onreadystatechange = getReturnInformation;
//        httpRequest.open('GET', "http://win7frankvm/GTDWS/Dialog/208?pType=Review");
//        httpRequest.send();

//        function getReturnInformation() {
//            if (httpRequest.readyState === 4) {
//                if (httpRequest.status === 200) {
//                    console.log(httpRequest.responseText);
//                    var dialogInfo = Ext.decode(httpRequest.responseText);

//                    
//                    UC.componentStore.removeAll();
//                    var componentRecords = new Array();
//                    var componentRecord = null;

//                    for (var i = 0; i < dialogInfo.items.length; ++i) {
//                        var r = {};
//                        r.value = dialogInfo.items[i].G3E_USERNAME;
//                        componentRecord = new Ext.data.Record(r);
//                        componentRecords[i] = componentRecord;

//                    }
//                    UC.componentStore.add(componentRecords);

//                    console.log(dialogInfo);
//                } else {
//                    console.log('GTDWS Failure');
//                }
//            }
//        }

        //
        //    http://win7frankvm/GTDWS/Dialog/208?pType=Review
        //

    }

}

