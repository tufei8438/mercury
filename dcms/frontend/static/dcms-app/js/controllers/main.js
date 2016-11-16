'use strict';

var mainCtrlApp = angular.module('dcmsApp.mainCtrl', []);

mainCtrlApp.controller('MainCtrl', ['$scope', function($scope) {
    this.navigationTemplatePath = 'dcms-app/views/common/navigation.html';
    this.contentTitleTemplatePath = 'dcms-app/views/common/content_title.html';
    this.footerTemplatePath = 'dcms-app/views/common/footer.html';
    this.topnavbarTemplatePath = 'dcms-app/views/common/topnavbar.html';
    this.rightSidebarTemplatePath = 'dcms-app/views/common/right_sidebar.html';

    $scope.createMaterialCategoryTree = function(categories) {
        var treeData = [];
        for (var i = 0; i < categories.length; ++i) {
            var category = categories[i];
            var node = {
                "id": "json" + category.id,
                "parent": category.parent_id == 0 ? "#" : "json" + category.parent_id,
                "text": category.name,
                "state": {
                    "opened": true
                },
                "__uiNodeId": category.id
            };
            treeData.push(node);
        }

        return treeData;
    };
}]);

mainCtrlApp.controller('LoginCtrl', function($scope, Restangular, $state) {
    $scope.loginForm = {
        username: '',
        password: ''
    };

    $scope.doLogin = function() {
        Restangular.all('/api/user/login').post($scope.loginForm).then(function(loginInfo) {
            console.log('loginInfo:' + loginInfo);
            $state.go('home.dashboard');
        }, function(response) {
            alert('用户名密码错误, 请重新登录');
        })
    };
});

