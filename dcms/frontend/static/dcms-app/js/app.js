'use strict';

var dcmsApp = angular.module('dcmsApp', [
    'ui.router',                    // Routing
    'oc.lazyLoad',                  // ocLazyLoad
    'ui.bootstrap',                 // Ui Bootstrap
    'ngSanitize',                   // ngSanitize
    'ngCookies',                    // ngCookies
    'restangular',                  // restangular
    'dcmsApp.services',
    'dcmsApp.mainCtrl',
    'dcmsApp.acceptanceCtrl',
    'dcmsApp.basedataCtrl',
    'dcmsApp.collaborationCtrl',
    'dcmsApp.commandCtrl',
    'dcmsApp.evaluationCtrl',
    'dcmsApp.maintenanceCtrl'
]);

dcmsApp.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.when('', '/home/dashboard');

    $urlRouterProvider.otherwise("/404");

    $ocLazyLoadProvider.config({
       debug: false
    });

    var contentTemplatUrl = "dcms-app/views/common/content.html";

    $stateProvider
        .state('home', {
            abstract: true,
            url: '/home',
            templateUrl: contentTemplatUrl
        }).state('home.dashboard', {
            url: '/dashboard',
            templateUrl: 'dcms-app/views/home/dashboard.html'
        }).state('login', {
            url: '/login',
            templateUrl: 'dcms-app/views/account/login.html'
        }).state('404', {
            url: '/404',
            templateUrl: 'dcms-app/views/common/error_404.html'
        }).state('500', {
            url: '/500',
            templateUrl: 'dcms-app/views/common/error_500.html'
        })
        .state('acceptance', {
            abstract: true,
            url: '/acceptance',
            templateUrl: contentTemplatUrl
        }).state('acceptance.caseAcceptance', {
            url: '/caseAcceptance',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'superMap',
                            files: ['map/locate.css']
                        }
                    ]);
                }
            }
        }).state('acceptance.caseQuery', {
            url: '/caseQuery',
            templateUrl: 'dcms-app/views/acceptance/case_query.html'
        }).state('acceptance.mapLocate', {
            url: '/mapLocate',
            templateUrl: 'dcms-app/views/acceptance/map_grid_locate.html'
        }).state('collaboration', {
            abstract: true,
            url: '/collaboration',
            templateUrl: contentTemplatUrl
        }).state('collaboration.taskDispatch', {
            url: '/taskDispatch',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('collaboration.caseSupervise', {
            url: '/caseSupervise',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('collaboration.timing', {
            url: '/timing',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('command', {
            abstract: true,
            url: '/command',
            templateUrl: contentTemplatUrl
        }).state('command.map', {
            url: '/map',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('command.tracking', {
            url: '/tracking',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('command.video', {
            url: '/video',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('evaluation', {
            abstract: true,
            url: '/evaluation',
            templateUrl: contentTemplatUrl
        }).state('evaluation.rule', {
            url: '/rule',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('evaluation.region', {
            url: '/region',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('evaluation.department', {
            url: '/department',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('evaluation.staff', {
            url: '/staff',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('maintenance', {
            abstract: true,
            url: '/maintenance',
            templateUrl: contentTemplatUrl
        }).state('maintenance.workflowModel', {
            url: '/workflowModel',
            templateUrl: 'dcms-app/views/maintenance/workflow_models.html'
        }).state('maintenance.workflowGroup', {
            url: '/workflowGroup',
            templateUrl: 'dcms-app/views/maintenance/workflow_groups.html'
        }).state('maintenance.orgStructure', {
            url: '/orgStructure',
            templateUrl: 'dcms-app/views/maintenance/departments.html',
            resolve: {
                 loadPlugin: function ($ocLazyLoad) {
                     return $ocLazyLoad.load([
                         {
                             files: ['dcms-app/js/lib/bower_components/jstree/dist/themes/default/style.css',
                                 'dcms-app/js/lib/bower_components/jstree/dist/jstree.js']
                         },
                         {
                             name: 'ngJsTree',
                             files: ['dcms-app/js/lib/bower_components/ng-js-tree/dist/ngJsTree.js']
                         }
                     ]);
                 }
             }
        }).state('maintenance.permission', {
            url: '/permission',
            templateUrl: 'dcms-app/views/maintenance/permissions.html'
        }).state('basedata', {
            abstract: true,
            url: '/basedata',
            templateUrl: contentTemplatUrl
        }).state('basedata.component', {
            url: '/component',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('basedata.category', {
            url: '/category',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        }).state('basedata.configuration', {
            url: '/configuration',
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
        })

});

dcmsApp.config(function(RestangularProvider) {
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (operation === "getList") {
            if (data.constructor == Array) {
                return data;
            } else {
                return data['data'];
            }
        }

        return data;
    });
});

dcmsApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.alerts = [];
    $rootScope.bgImageClass = '';

    $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
        // to be used for back button. won't work when page is reloaded.
        $rootScope.previousState_name = fromState.name;
        $rootScope.previousState_params = fromParams;
    });

    $rootScope.stateGoBack = function() {
        $state.go($rootScope.previousState_name, $rootScope.previousState_params);
    };

    /**
     * addAlert, closeAlert  - used to manage alerts in Notifications and Tooltips view
     */
    $rootScope.addAlert = function(msgType, message) {
        this.alerts.push({type: msgType, msg: message});
    };

    $rootScope.closeAlert = function(index) {
        this.alerts.splice(index, 1);
    };

    $rootScope.$on('$stateChangeError', function(event) {
        console.log("$stateChangeError: " + event);
        $state.go('404');
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        if (toState.name == 'login') {
            $rootScope.bgImageClass = 'bg-image';
        } else {
            $rootScope.bgImageClass = '';
        }
    });
})
.run(function($rootScope, Restangular, $state, $cookies) {
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status == 400 || response.status == 500) {
            $rootScope.addAlert('danger', response.data.message);
            return false;
        } else if (response.status == 403) {
            $state.go('login');
            return false;
        }
        return true; // error not handled
    });

    $rootScope.currentUser = {};
    $rootScope.currentPermissions = [];

    Restangular.all('/api/user/info').customGET().then(function(user) {
        $rootScope.currentUser = user;
    });

    Restangular.all('/api/user/permissions').getList().then(function(permissions) {
        $rootScope.currentPermissions = permissions;
    });
});