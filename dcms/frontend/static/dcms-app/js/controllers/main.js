'use strict';

var mainCtrlApp = angular.module('mainCtrlApp', []);

mainCtrlApp.controller('MainCtrl', ['$scope', function($scope) {
    this.navigationTemplatePath = 'views/common/navigation.html';
    this.contentTitleTemplatePath = 'views/common/content_title.html';
    this.footerTemplatePath = 'views/common/footer.html';
    this.topnavbarTemplatePath = 'views/common/topnavbar.html';
    this.rightSidebarTemplatePath = 'views/common/right_sidebar.html';

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

