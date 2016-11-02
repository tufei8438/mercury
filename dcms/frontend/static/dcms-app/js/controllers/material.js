'use strict';

var materialCtrlApp = angular.module('materialCtrlApp', []);

materialCtrlApp.controller('materialCategoryCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {

    var categoryService = Restangular.all("/api/materials/categories");

    $scope.pageTitle = "原料分类";
    $scope.topNavMenu = "原料管理";
    $scope.subNavMenu = "原料分类";

    $scope.categoryAdd = {
        merchant_code: "1001",
        name: "",
        parent_id: 0
    }

    $scope.addCategory = function() {
        categoryService.post($scope.categoryAdd).then(function() {
            $scope.addAlert('info', "添加分类成功");
            getCategories();
        });
    };

    $scope.categoryTreeConfig = {
        "core" : {
                multiple : false,
                animation: true,
                error : function(error) {
                    $log.error("treeCtrl: error from js tree - " + angular.toJson(error));
                },
                check_callback : true,
                worker : true
         },
        "plugins" : ["types", "dnd"],
        "types" : {
            "default" : {
                "icon" : "fa fa-folder"
            }
        }
    };

    var getCategories = function() {
        categoryService.getList({"merchant_code": "1001"}).then(function(categories) {
            $scope.categoryTreeData = $scope.createMaterialCategoryTree(categories)

            $scope.categories = categories;
            $scope.categories.push({
                "id": 0,
                "name": "根节点"
            });
        });
    };

    $scope.categoryTreeData = [];
    $scope.categoryTreeReadyCB = function() {
        getCategories();
    };

    Restangular.all("/api/depots/test").getList().then(function(dataList) {
        $scope.dataList = dataList;
    });
}]);

materialCtrlApp.controller('materialCtrl', ['$scope', function($scope) {
    $scope.materials = [
        {"name": "红牛", "code": "R001", "consume_unit": "罐", "purchase_unit": "箱", "check_unit": "箱"},
        {"name": "旺仔牛奶", "code": "R002", "consume_unit": "听", "purchase_unit": "箱", "check_unit": "箱"},
        {"name": "红糖", "code": "R003", "consume_unit": "克", "purchase_unit": "包", "check_unit": "包"},
        {"name": "猪肉", "code": "R004", "consume_unit": "克", "purchase_unit": "千克", "check_unit": "千克"},
        {"name": "啤酒", "code": "R005", "consume_unit": "瓶", "purchase_unit": "箱", "check_unit": "箱"}
    ]
}]);