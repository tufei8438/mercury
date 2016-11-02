'use strict';

var dcmsApp = angular.module('dcmsApp', [
    'ui.router',                    // Routing
    'oc.lazyLoad',                  // ocLazyLoad
    'ui.bootstrap',                 // Ui Bootstrap
    'ngSanitize',                   // ngSanitize
    'restangular',                  // restangular
    'mainCtrlApp',
    'acceptanceCtrlApp',
    'basedataCtrlApp',
    'collaborationCtrlApp',
    'commandCtrlApp',
    'evaluationCtrlApp',
    'maintenanceCtrlApp'
]);

dcmsApp.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/acceptance/caseAcceptance");

    $ocLazyLoadProvider.config({
       debug: false
    });

    var contentTemplatUrl = "views/common/content.html";

    $stateProvider
        // .state('material', {
        //     abstract: true,
        //     url: "/material",
        //     templateUrl: contentTemplatUrl
        // })
        // .state('material.category', {
        //     url: "/category",
        //     templateUrl: "view/material/categories.html",
        //     data: {pageTitle: "原料分类"},
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     files: ['js/lib/bower_components/jstree/dist/themes/default/style.css',
        //                         'js/lib/bower_components/jstree/dist/jstree.js']
        //                 },
        //                 {
        //                     name: 'ngJsTree',
        //                     files: ['js/lib/bower_components/ng-js-tree/dist/ngJsTree.js']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('material.material', {
        //     url: "/material",
        //     templateUrl: "view/material/materials.html"
        // }).state('case', {
        //     abstract: true,
        //     url: "/case",
        //     templateUrl: contentTemplatUrl
        // }).state('case.register', {
        //     url: "/register",
        //     templateUrl: "view/case/register.html"
        // })
        .state('acceptance', {
            abstract: true,
            url: '/acceptance',
            templateUrl: contentTemplatUrl
        }).state('acceptance.caseAcceptance', {
            url: '/caseAcceptance',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('collaboration', {
            abstract: true,
            url: '/collaboration',
            templateUrl: contentTemplatUrl
        }).state('collaboration.taskDispatch', {
            url: '/taskDispatch',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('collaboration.caseSupervise', {
            url: '/caseSupervise',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('collaboration.timing', {
            url: '/timing',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('command', {
            abstract: true,
            url: '/command',
            templateUrl: contentTemplatUrl
        }).state('command.map', {
            url: '/map',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('command.tracking', {
            url: '/tracking',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('command.video', {
            url: '/video',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('evaluation', {
            abstract: true,
            url: '/evaluation',
            templateUrl: contentTemplatUrl
        }).state('evaluation.rule', {
            url: '/rule',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('evaluation.region', {
            url: '/region',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('evaluation.department', {
            url: '/department',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('evaluation.staff', {
            url: '/staff',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('maintenance', {
            abstract: true,
            url: '/workflow',
            templateUrl: contentTemplatUrl
        }).state('maintenance.orgStructure', {
            url: '/orgStructure',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('maintenance.permission', {
            url: '/permission',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('basedata', {
            abstract: true,
            url: '/basedata',
            templateUrl: contentTemplatUrl
        }).state('basedata.component', {
            url: '/component',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('basedata.category', {
            url: '/category',
            templateUrl: 'views/acceptance/case_acceptance.html'
        }).state('basedata.configuration', {
            url: '/configuration',
            templateUrl: 'views/acceptance/case_acceptance.html'
        })

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