'use strict';

var caseCtrlApp = angular.module('caseCtrlApp', []);

caseCtrlApp.controller('caseRegisterCtrl', ['$scope', '$log', 'Restangular', function($scope, $log, Restangular) {
    $scope.createSubmitCase = function() {
        return {
            code: '20989833',
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

    $scope.submitCaseTabs = [];
    $scope.case = $scope.createSubmitCase();
    $scope.submitCaseTabs = [{
        index: 1,
        title: '案件1',
        submitCase: $scope.case
    }];

    $scope.addSubmitCaseTab = function() {
        $scope.submitCaseTabs.push({
            index: $scope.submitCaseTabs.length+1,
            title: '案件' + ($scope.submitCaseTabs.length+1),
            submitCase: $scope.createSubmitCase()
        });
        $scope.case = $scope.submitCaseTabs[$scope.submitCaseTabs.length-1].submitCase;
    };

    $scope.submitCaseTabChanged = function(index) {
        $scope.case = $scope.submitCaseTabs[index-1].submitCase;
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

    $scope.caseParentCategoryList = [
        {code: '01', name: '市容环境'},
        {code: '02', name: '宣传广告'}
    ];

    $scope.caseCategoryList = [
        {code: '01', name: '私搭烂建'},
        {code: '02', name: '暴露垃圾'}
    ];

    // $scope.objParentCategoryList = [
    //     {id: 1, name: '公用设施'},
    //     {id: 2, name: '道路设施'}
    // ];
    //
    // $scope.objCategoryList = [
    //     {id: 1, name: '上水井盖'},
    //     {id: 2, name: '污水井盖'}
    // ];
}]);