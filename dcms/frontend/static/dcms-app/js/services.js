'use strict';

var services = angular.module('dcmsApp.services', ['restangular']);

services.factory('MapService', function() {
    var currentGrid = {
        code: '22021107010701',
        x: '',
        y: ''
    };

    return {
        getCurrentGrid: function() {
            return currentGrid;
        },

        setCurrentGrid: function(code, x, y) {
            currentGrid.code = code;
            currentGrid.x = x;
            currentGrid.y = y;
        }
    };
});


services.factory('ActivitiService', function (Restangular) {
    return {
        queryCaseTasks: function() {
            var params = {

            };
        }
    }
});