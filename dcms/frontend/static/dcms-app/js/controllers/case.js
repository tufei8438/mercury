'use strict';

var caseCtrlApp = angular.module('caseCtrlApp', []);

caseCtrlApp.controller('caseRegisterCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {
    var caseService = Restangular.all("/api/cases");

    var createSubmitCase = function() {
        return {
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
    };

    $scope.tabActive = 0;
    $scope.submitCase = null;
    $scope.submitCaseTabs = [];

    $scope.addSubmitCaseTab = function() {
        $scope.submitCaseTabs.push({
            title: '案件' + ($scope.submitCaseTabs.length+1),
            submitCase: createSubmitCase()
        });
        $scope.tabActive = $scope.submitCaseTabs.length-1;
        $scope.submitCase = $scope.submitCaseTabs[$scope.tabActive].submitCase;

        getCaseCode();
        getParentCategoryList();
        getCategoryList();
    };

    var getCaseCode = function() {
        caseService.all('/codes').post().then(function(caseCode) {
            $scope.submitCase.code = caseCode.code;
        });
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

    $scope.submitCaseTabChanged = function(index) {
        $scope.submitCase = $scope.submitCaseTabs[index].submitCase;
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

    $scope.categoryTypeChanged = function(categoryTypeId) {
        getParentCategoryList();
        getCategoryList();
    };

    $scope.caseParentCategoryChanged = function(parentCategoryCode) {
        getCategoryList();
    };

    $scope.submit = function() {
        caseService.post($scope.submitCase).then(function(caseObj) {
            alert('提交成功');
        });
    };
}]);


caseCtrlApp.controller('caseMapCtrl', ['$scope', function($scope) {
    var map, layer, vectorLayer, vectorLayer1, gridLayer, markerLayer, marker, drawPoint,
        style = {
            strokeColor: "#FF6733",
            strokeWidth: 1,
            fillColor: "#FF6733",
            fillOpacity: "0.6",
            pointRadius: 5
        },
        url="http://www.supermapol.com/iserver/services/map_dcmsdata1/rest/maps/grid";
    SuperMap.Credential.CREDENTIAL = new SuperMap.Credential("YDh73kj7PiITCckyKlxJqR9i", "ak");
    $scope.init = function(){
        gridLayer = new SuperMap.Layer.TiledDynamicRESTLayer("grid", url, {transparent: true, cacheEnabled: true});
        gridLayer.setOpacity(0.6);
        gridLayer.events.on({"layerInitialized": addGridLayer});
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
            allOverlays:true
        });

        layer = new SuperMap.Layer.Baidu();
        map.addLayer(layer);
        map.setCenter(new SuperMap.LonLat(14090326, 5404960), 13);
        markerLayer = new  SuperMap.Layer.Markers("markerLayer");
        addMarker();
    };

    function addGridLayer(){
        map.addLayers([gridLayer, markerLayer, vectorLayer, vectorLayer1]);
    }

    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return  r[2];
    }

    function addMarker(){
        markerLayer.removeMarker(marker);
        var size = new SuperMap.Size(44,33);
        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        var icon = new SuperMap.Icon("map/images/marker.png", size, offset);
        marker =new SuperMap.Marker(new SuperMap.LonLat(GetQueryString('x') , GetQueryString('y')),icon) ;
        marker.events.on({
            "click":openInfoWin,
            "scope": marker
        });
        markerLayer.addMarker(marker);

        console.log("addMarker completed");
    }

    var infowin = null;
    function openInfoWin()
    {
        closeInfoWin();
        var marker = this;
        var lonlat = marker.getLonLat();
        var size = new SuperMap.Size(0, 33);
        var offset = new SuperMap.Pixel(11, -25);
        var icon = new SuperMap.Icon("map/images/marker.png", size, offset);
        var popup = new SuperMap.Popup.FramedCloud(
            "popwin",
            new SuperMap.LonLat(lonlat.lon,lonlat.lat),
            null,
            "<div><input type='button' value='返回' onclick='goback()'></input></div>",
            icon,
            true
        );
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
    function removeMarker(){
        markerLayer.removeMarker(marker);
    }

    function queryByPoint(){
        clearStatus();
        drawPoint.activate();
    }
    function drawPointCompleted(drawGeometryArgs) {
        var feature = new SuperMap.Feature.Vector();
        feature.geometry = drawGeometryArgs.feature.geometry, feature.style = style;
        vectorLayer.addFeatures(feature);

        var queryParam, queryByGeometryParameters, queryService;
        queryParam = new SuperMap.REST.FilterParameter({name: "grid@jl_grid"});
        queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
            queryParams: [queryParam],
            geometry: drawGeometryArgs.feature.geometry,
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new SuperMap.REST.QueryByGeometryService(url, {
            eventListeners: {
                "processCompleted": processCompleted,
                "processFailed": processFailed
            }
        });
        queryService.processAsync(queryByGeometryParameters);
    }

    function processCompleted(queryEventArgs) {
        console.log("processCompleted");
        clearFeatures();
        //drawPoint.deactivate();
        var i, j, result = queryEventArgs.result;
        var recordsets, len;
        if (result && result.recordsets) {
            for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
                if (recordsets[i].features) {
                    for (j = 0; j < recordsets[i].features.length; j++) {
                        var feature = recordsets[i].features[j];
                        var point = feature.geometry;
                        document.getElementById('code').innerHTML=feature.attributes['code'];
                        if(point.CLASS_NAME == SuperMap.Geometry.Point.prototype.CLASS_NAME){
                            var size = new SuperMap.Size(44, 33),
                                offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                                icon = new SuperMap.Icon("map/images/marker.png", size, offset);
                            markerLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                        }else{
                            feature.style = style;
                            vectorLayer1.addFeatures(feature);
                        }
                    }
                }
            }
        }
    }
    function processFailed(e) {
        alert(e.error.errorMsg);
    }
    function clearFeatures() {
        vectorLayer.removeAllFeatures();
        vectorLayer1.removeAllFeatures();
        markerLayer.clearMarkers();
    }
    function clearStatus(){
        vectorLayer.removeAllFeatures();
        vectorLayer1.removeAllFeatures();
        markerLayer.clearMarkers();
    }
    function stopquery(){
        drawPoint.deactivate();
        clearStatus();
    }
    function goback(){
        window.history.back();
    }

}]);