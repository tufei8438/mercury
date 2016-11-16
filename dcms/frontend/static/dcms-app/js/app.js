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
        }).state('maintenance.workflow', {
            url: '/workflow',
            templateUrl: 'dcms-app/views/maintenance/workflow_models.html'
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
            templateUrl: 'dcms-app/views/acceptance/case_acceptance.html'
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
})
.run(function($rootScope, Restangular, $state, $cookies) {
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status == 400 || response.status == 500) {
            $rootScope.addAlert('danger', response.data.message);
            return false;
        } else if (response.status == 403) {
            //$state.go('login');
            return false;
        }
        console.log('response:' + angular.toJson(response));
        return true; // error not handled
    });

    // Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
    //     var sessionid = $cookies.get('sessionid');
    //     if (sessionid) {
    //         headers['SESSIONID'] = sessionid;
    //     }
    //     console.log('headers:' + angular.toJson(headers));
    //     return {
    //         headers: headers
    //     }
    // });

    Restangular.all('/api/user/info').customGET().then(function(user) {
        console.log('user:' + angular.toJson(user));
    });
});