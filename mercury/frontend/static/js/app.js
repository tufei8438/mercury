'use strict';

var dcmsApp = angular.module('dcmsApp', [
    'ui.router',                    // Routing
    'oc.lazyLoad',                  // ocLazyLoad
    'ui.bootstrap',                 // Ui Bootstrap
    'ngSanitize',                   // ngSanitize
    'restangular',                  // restangular
    'mainCtrlApp',
    'caseCtrlApp',
    'materialCtrlApp'
]);

dcmsApp.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/material/category");

    $ocLazyLoadProvider.config({
       debug: false
    });

    var contentTemplatUrl = "view/common/content.html";

    $stateProvider
        .state('material', {
            abstract: true,
            url: "/material",
            templateUrl: contentTemplatUrl
        })
        .state('material.category', {
            url: "/category",
            templateUrl: "view/material/categories.html",
            data: {pageTitle: "原料分类"},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/lib/bower_components/jstree/dist/themes/default/style.css',
                                'js/lib/bower_components/jstree/dist/jstree.js']
                        },
                        {
                            name: 'ngJsTree',
                            files: ['js/lib/bower_components/ng-js-tree/dist/ngJsTree.js']
                        }
                    ]);
                }
            }
        })
        .state('material.material', {
            url: "/material",
            templateUrl: "view/material/materials.html"
        }).state('case', {
            abstract: true,
            url: "/case",
            templateUrl: contentTemplatUrl
        }).state('case.register', {
            url: "/register",
            templateUrl: "view/case/register.html"
        });

});

dcmsApp.run(function($rootScope, $state) {
    $rootScope.$state = $state;
    $rootScope.alerts = [];

    /**
     * addAlert, closeAlert  - used to manage alerts in Notifications and Tooltips view
     */
    $rootScope.addAlert = function(msgType, message) {
        this.alerts.push({type: msgType, msg: message});
    };

    $rootScope.closeAlert = function(index) {
        this.alerts.splice(index, 1);
    };
})
.run(function($rootScope, Restangular) {
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status == 400 || response.status == 500) {
            $rootScope.addAlert('danger', response.data.message);
            return false;
        }
        return true; // error not handled
    });
});