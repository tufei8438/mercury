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