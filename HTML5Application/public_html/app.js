

/* global angular */

// App
var app = angular.module('myApp', ['appServices']);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: 'home.html',
                    controller: IndexController
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]);

// App services
angular.module('appServices', [])
        .factory('User', function ($rootScope, $http) {
            var userBeingEdited = null;
            var userList = [
                {_id: 125, username: 'Tom'},
                {_id: 224, username: 'Dick'},
                {_id: 314, username: 'Harry'},
                {_id: 451, username: 'Bob'},
                {_id: 515, username: 'George'},
                {_id: 653, username: 'Sally'}
            ];

            return {
                editUser:
                        function (id) {
                            if (id === 'new') {
                                userBeingEdited = null;
                            }
                            else {
                                userBeingEdited = id;
                            }
                            $rootScope.$broadcast('user:edit');
                        },
                getEditUser:
                        function () {
                            if (userBeingEdited) {
                                for (var i in userList) {
                                    if (userList[i]._id === userBeingEdited) {
                                        return userList[i];
                                    }
                                }
                            }
                            else {
                                return {};
                            }
                        },
                getUserList:
                        function () {
                            return userList;
                        }
            };
        });


// Controllers
function IndexController($scope, User) {
    $scope.user = User;
    $scope.userList = User.getUserList();

    $scope.editUser = function (uid) {
        $scope.user.editUser(uid);
    };
}
;


app.controller('UserEditModalController', function ($scope, $rootScope, User) {
    $scope.user = User;
    $scope.newUser = false;
    $scope.uid = '';
    $scope.username = '';
    $scope.pw1 = '';
    $scope.pw2 = '';
    $scope.pwError = false;
    $scope.incomplete = false;

    $rootScope.$on('user:edit', function () {
        var editUser = User.getEditUser();
        if (editUser._id) {
            $scope.newUser = false;
            $scope.uid = editUser._id;
            $scope.username = editUser.username;
        }
        else {
            $scope.newUser = true;
            $scope.incomplete = true;
            $scope.uid = '';
            $scope.username = '';
        }
    });

    $scope.$watch('pw1', function () {
        if ($scope.pw1 !== $scope.pw2) {
            $scope.pwError = true;
        }
        else {
            $scope.pwError = false;
        }
        $scope.incompleteTest();
    });
    $scope.$watch('pw2', function () {
        if ($scope.pw1 !== $scope.pw2) {
            $scope.pwError = true;
        }
        else {
            $scope.pwError = false;
        }
        $scope.incompleteTest();
    });
    $scope.$watch('username', function () {
        $scope.incompleteTest();
    });

    $scope.incompleteTest = function () {
        if ($scope.newUser) {
            if (!$scope.username.length ||
                    !$scope.pw1.length ||
                    !$scope.pw2.length) {

                $scope.incomplete = true;
            }
            else {
                $scope.incomplete = false;
            }
        }
        else {
            $scope.incomplete = false;
        }
    };
});
