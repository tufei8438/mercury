'use strict';

var services = angular.module('dcmsApp.services', []);

services.factory('MapService', [function() {
    var currentGrid = {
        code: '',
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
}]);