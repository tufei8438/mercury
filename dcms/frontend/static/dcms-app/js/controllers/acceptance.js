'use strict';

var acceptanceCtrlApp = angular.module('acceptanceCtrlApp', []);

acceptanceCtrlApp.controller('caseAcceptanceCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {
    var caseService = Restangular.all("/api/cases");

    $scope.submitCase = {
        code: '',
        name: '',
        source: 1,
        category_type: 1,
        parent_category_code: '01',
        category_code: '01',
        grid_code: '',
        address: '',
        description: '',
        reporter_name: '',
        reporter_phone: '',
        reporter_address: '',
        remark: ''
    };

    var getParentCategoryList = function() {
        var params = {"category_type": $scope.submitCase.category_type};
        caseService.all('/categories').getList(params).then(function(categoryList) {
            $scope.caseParentCategoryList = categoryList;
            $scope.submitCase.parent_category_code = categoryList[0].longcode;
        });
    };

    var getCategoryList = function() {
        var params = {
            "parent_code": $scope.submitCase.parent_category_code,
            "category_type": $scope.submitCase.category_type
        };
        caseService.all('/categories').getList(params).then(function(categoryList) {
            $scope.caseCategoryList = categoryList;
            $scope.submitCase.category_code = categoryList[0].longcode;
        });
    };

    $scope.caseSourceList = [
        {id: 1, name: '新闻网站'},
        {id: 2, name: 'APP'},
        {id: 3, name: '市长'}
    ];

    $scope.caseCategoryTypeList = [
        {id: 1, name: '事件上报'},
        {id: 2, name: '部件上报'}
    ];

    $scope.categoryTypeChanged = function() {
        getParentCategoryList();
        getCategoryList();
    };

    $scope.caseParentCategoryChanged = function() {
        getCategoryList();
    };

    $scope.submit = function() {
        caseService.post($scope.submitCase).then(function(caseObj) {
            alert('提交成功');
        });
    };

}]);

acceptanceCtrlApp.controller('mapLocateCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {
    var map, layer, vectorLayer, vectorLayer1,drawPoint, style = {
            strokeColor: "#FF6733",
            strokeWidth: 1,
            fillColor: "#FF6733",
            fillOpacity: "0.6",
            pointRadius: 5
        };
    $scope.init = function(){
        vectorLayer = new SuperMap.Layer.Vector("Vector Layer");
        vectorLayer1 = new SuperMap.Layer.Vector("Vector Layer1");

        drawPoint = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.Point);
        drawPoint.events.on({"featureadded": drawPointCompleted});


        map = new SuperMap.Map("map",{controls: [
            new SuperMap.Control.LayerSwitcher(),
            new SuperMap.Control.MousePosition(),
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.Zoom(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                }}),
            drawPoint],
            allOverlays:true,
            projection:"EPSG:3857"
        });
        var matrixIds = [];
        //当前图层的分辨率数组信息,和matrixIds一样，需要用户从wmts服务获取并明确设置,resolutions数组和matrixIds数组长度相同
        var scales=[5.91657527591555E8,2.9582876379577696E8,1.4791438189788896E8,7.395719094894399E7,3.6978595474471994E7,1.8489297737235997E7,9244648.868617998,
            4622324.434308999,2311162.2171549997,1155581.108577,577790.5542889999,288895.27714399993,144447.63857199997,72223.81928599998,36111.90964299999,18055.954822,
            9027.977411,4513.988704999999,2256.994353,1128.4971759999999,];
        var temp,resolutions=[];
        for (var i = 0; i < scales.length; i++) {
            temp = SuperMap.Util.getResolutionFromScaleDpi(scales[i], 96, "degree", 6378137);
            resolutions.push(temp);
            matrixIds[i] = {identifier: "EPSG:3857_jilin:" + i};//这个就很奇怪，一般来说identifier都是0开始的整数
        }
        //新建图层
        layer = new SuperMap.Layer.WMTS({name: "底图",
            url: "http://182.48.115.38:28088/geowebcache/service/wmts",
            layer: "jilin",
            style: "default",
            matrixSet: "EPSG:3857_jilin",
            format: "image/png",
            //dpi:96,
            //resolutions:resolutions,
            matrixIds:matrixIds,
            opacity: 1,
            maxExtent:new SuperMap.Bounds(-20037508.342787,-20037508.342787,20037508.342787,20037508.342787),
            requestEncoding:"KVP"});
        //wms
        var wms= new SuperMap.Layer.WMS("traffic", "http://182.48.115.38:8060/geoserver/jilinCity/wms", {
                layers: "jilinCity:jilin_traffic", version: '1.3.0',transparent:true },
            {projection:"EPSG:3857",maxExtent: new SuperMap.Bounds(-20037508.34 , -20037508.34,20037508.34 , 20037508.34 )});
        var wms1 = new SuperMap.Layer.WMS("网格", "http://182.48.115.38:8060/geoserver/jilinCity/wms",
            { layers: "jilinCity:jilin_grid", version: '1.1.0',transparent:true }, {projection:"EPSG:3857",maxExtent: new SuperMap.Bounds(-20037508.34 , -20037508.34,20037508.34 , 20037508.34 )});
        //图层添加并显示指定级别
        wms1.setOpacity(0.5);
        wms.setOpacity(0.2);
        wms.isBaseLayer=false;
        wms1.isBaseLayer=false;

        map.addLayers([layer,wms1,wms,vectorLayer, vectorLayer1]);
        map.setCenter(new SuperMap.LonLat(14090709.823160334 , 5436394.693706188), 12);

        queryByPoint();
    };

    var infowin = null;
    function openInfoWin()
    {
        closeInfoWin();
        var marker = this;
        var lonlat = marker.getLonLat();
        var size = new SuperMap.Size(0, 33);
        var offset = new SuperMap.Pixel(11, -25);
        var icon = new SuperMap.Icon("map/images/marker.png", size, offset);
        var popup = new SuperMap.Popup.FramedCloud("popwin",
            new SuperMap.LonLat(lonlat.lon,lonlat.lat),
            null,
            "<div><input type='button' value='test'></input><p>鼠标点击事件<p></div>",
            icon,
            true);
        infowin = popup;
        map.addPopup(popup);
    }
    //关闭信息框
    function closeInfoWin(){
        if(infowin){
            try{
                infowin.hide();
                infowin.destroy();
            }
            catch(e){}
        }
    }


    function queryByPoint(){
        clearStatus();
        drawPoint.activate();
    }
    var x, y;
    function drawPointCompleted(drawGeometryArgs) {
        var feature = new SuperMap.Feature.Vector();
        feature.geometry = drawGeometryArgs.feature.geometry;
        feature.style = style;
        x = feature.geometry.x;
        y = feature.geometry.y;
        vectorLayer.addFeatures(feature);

        Restangular.one('/api/cases/grid').get({'x':x, 'y':y}).then(function(data) {
            if(data.flag) {
                clearFeatures();
                console.log(data);
                var bgcode = data.code;
                var point_list = data.point_list;
                var gridFeature = new SuperMap.Feature.Vector();

                closeInfoWin();
                var points = [point_list.length - 1];
                for (var i = 0; i < point_list.length; i++) {
                    points[i] = new SuperMap.Geometry.Point(point_list[i].x, point_list[i].y);
                }
                var linearRings = new SuperMap.Geometry.LinearRing(points);
                var region = new SuperMap.Geometry.Polygon([linearRings]);

                gridFeature.geometry = region;
                gridFeature.style = style;
                vectorLayer1.addFeatures(gridFeature);

                var lonlat = new SuperMap.LonLat(x, y);
                var size = new SuperMap.Size(0, 33);
                var offset = new SuperMap.Pixel(0, 0);
                var icon = new SuperMap.Icon("map/images/marker.png", size, offset);
                var popup = new SuperMap.Popup.FramedCloud(
                    "popwin",
                    new SuperMap.LonLat(lonlat.lon, lonlat.lat),
                    null,
                    "<div><a id='code'>" + bgcode + "</a><br><input type='button' value='确定' onclick='bg_ok()'></input></div>",
                    icon,
                    true
                );
                infowin = popup;
                map.addPopup(popup);
            }
            else {
                alert(data.message);
                vectorLayer.removeAllFeatures();
            }
        });


    }

    function clearFeatures() {
        vectorLayer.removeAllFeatures();
        vectorLayer1.removeAllFeatures();
        // markerLayer.clearMarkers();
    }
    function clearStatus(){
        vectorLayer.removeAllFeatures();
        vectorLayer1.removeAllFeatures();

    }
    function stopquery(){
        drawPoint.deactivate();
        clearStatus();
    }
    function bg_ok(){
        sessionStorage["bg_code"] = document.getElementById('code').innerHTML;
        sessionStorage["point_x"] = x;
        sessionStorage["point_y"] = y;
        window.history.back();
    }
}]);

