'use strict';

var maintenanceCtrlApp = angular.module('dcmsApp.maintenanceCtrl', []);

maintenanceCtrlApp.controller('DepartmentCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {

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
        "version": 1,
        "plugins" : ["types", "dnd"],
        "types" : {
            "default" : {
                "icon" : "fa fa-folder"
            }
        }
    };

    $scope.reCreateDepartmentTree = function() {
        departmentService.getList().then(function(departments) {
            $scope.departments = departments;
            $scope.departmentTreeData = $scope.getTreeData(departments);
            $scope.departmentTreeConfig.version++;
        });
    };

    $scope.getTreeData = function(departments) {
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
            treeData.push(treeNode);

            if (department.parent_id == 0) {
                $scope.selectedDept = department;
            }
        }
        return treeData;
    };

    $scope.departmentTypeList = [
        {id: 1, name: '城管系统部门'},
        {id: 2, name: '城管专业部门'}
    ];

    $scope.departmentStatusList = [
        {id: 1, name: '正常'},
        {id: 0, name: '停用'}
    ];

    // $scope.districtList = [
    //     {id: 1, name: '丰满区'},
    //     {id: 2, name: '西城区'},
    //     {id: 3, name: '朝阳区'},
    //     {id: 4, name: '海淀区'}
    // ];

    // $scope.selectedDept = {
    //     name: '城管办公室',
    //     code: '00001',
    //     region_id: 3,
    //     create_time: '2016-09-09',
    //     status: 1,
    //     type: 1,
    //     description: '监督处理的核心部门'
    // };

    $scope.departmentTreeData = [];
    $scope.departmentTreeReadyCB = function() {

    };

    $scope.treeNodeChangedCB = function() {
        var selectedNode = $scope.treeInstance.jstree(true).get_selected();
        for (var i = 0; i < $scope.departments.length; ++i) {
            var department = $scope.departments[i];
            if (department.id == selectedNode[0]) {
                $scope.selectedDept = department;
                break;
            }
        }
    };

    $scope.districtList = departmentService.all('districts').getList().$object;

    $scope.getDepartmentUsers = function(departmentId) {
        $scope.departmentName = $scope.departments;
        departmentService.all('users').getList({'department_id': departmentId}).then(function(deptUsers) {
            $scope.deptUsers = deptUsers;
        });
    };

}]);

// maintenanceCtrlApp.controller('modalDepartmentUpdateCtrl', ['$scope', '$modalInstance', 'department', 'Restangular', function ($scope, $modalInstance, department, Restangular) {
//     $scope.department = department;
//
//     $scope.modalSubmit = function() {
//         Restangular.angular
//         $modalInstance.close();
//     };
//
//     $scope.modalCancel = function() {
//         $modalInstance.dismiss('cancel');
//     };
// }]);

maintenanceCtrlApp.controller('ModalNewModelCtrl', function($scope, $uibModalInstance, $state, Restangular) {
    $scope.model = {
        name: '',
        description: '',
        version: 1,
        metaInfo: ''
    };

    $scope.modalSubmit = function() {
        $scope.model.metaInfo = JSON.stringify({
            name: $scope.model.name,
            description: $scope.model.description,
            version: $scope.model.version
        });
        delete $scope.model.description;
        Restangular.all('/api/workflow/service/repository/models').post($scope.model).then(function(newModel) {
            $uibModalInstance.close(newModel);
        }, function(response) {
            $scope.addAlert('danger', response.data.message);
            console.log("Error with status code", response.status);
        });

    };

    $scope.modalCancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});

maintenanceCtrlApp.controller('ActivitiModelCtrl', function($scope, $uibModal, Restangular) {
    var modelService = Restangular.all('/api/workflow/repository/models');
    $scope.models = modelService.getList({'size': 20}).$object;

    $scope.createModel = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'modalNewModel.html',
            controller: 'ModalNewModelCtrl'
        });

        modalInstance.result.then(function(newModel) {
            $scope.models = modelService.getList({'size': 20}).$object;
            window.location.href='modeler.html?modelId=' + newModel.id;
        });
    };

    $scope.editModel = function(model) {
        window.location.href='modeler.html?modelId=' + model.id;
    };

    $scope.deleteModel = function(model) {
        modelService.one(model.id).remove().then(function() {
            $scope.addAlert('info', '设计模型：【' + model.name + '】删除成功');
            $scope.models = modelService.getList({'size': 20}).$object;
        }, function(resonse) {
            $scope.addAlert('danger', response.data.message);
            console.log("Error with status code", response.status);
        });
    };

    $scope.deployModel = function(model) {
        Restangular.all('/api/workflow/service/repository/deployments').
        customPOST(undefined, undefined, {modelId: model.id}, {'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"}).
        then(function() {
            $scope.addAlert('info', '设计模型：【' + model.name + '】部署成功');
        }, function(response) {
            $scope.addAlert('danger', response.data.message);
        });
    };

    $scope.exportModel = function(model) {
        window.location.href = '/api/workflow/service/repository/models/' + model.id + '/xml';
    }
});