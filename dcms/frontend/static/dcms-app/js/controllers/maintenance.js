'use strict';

var maintenanceCtrlApp = angular.module('maintenanceCtrlApp', []);

maintenanceCtrlApp.controller('departmentCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {

    var departmentService = Restangular.all('/api/departments');

    $scope.departmentTreeConfig = {
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

    var getDepartments = function() {
        // departmentService.getList().then(function(departments) {
        //     $scope.departmentTreeData = $scope.createDepartmentTree(departments);
        //
        //     $scope.departments = departments;
        //     $scope.departments.push({
        //         "id": 0,
        //         "name": "根节点"
        //     });
        // });
        $scope.departmentTreeData =  [ { "id": "ajson1", "parent": "#", "text": "Simple root node", "state": { "opened": true }, "__uiNodeId": 9 }, { "id": "ajson2", "parent": "#", "text": "Root node 2", "state": { "opened": true }, "__uiNodeId": 10 }, { "id": "ajson3", "parent": "ajson2", "text": "Child 1", "state": { "opened": true }, "__uiNodeId": 11 }, { "id": "ajson4", "parent": "ajson2", "text": "Child 2", "state": { "opened": true }, "__uiNodeId": 12 }, { "id": "1", "parent": "ajson1", "text": "Async Loaded", "__uiNodeId": 13 } ];
    };

    $scope.createDepartmentTree = function(departments) {
        var treeData = [];
        for (var i = 0; i < departments.length; ++i) {
            var department = departments[i];
            var treeNode = {
                "id": '' + department.id,
                "parent": department.parent_id == 0 ? '#' : '' + department.parent_id,
                "text": department.name,
                "state": {
                    "opened": department.parent_id == 0
                },
                "__uiNodeId": department.id
            };
            $log.error('treeNode:' + angular.toJson(treeNode));
            treeData.push(treeNode);
        }
        return treeData;
    };

    $scope.departmentTreeData = [];
    $scope.departmentTreeReadyCB = function() {
        getDepartments();
    };

}]);