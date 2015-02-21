var mdLoginApp = angular.module('mdLoginApp', ['ui.bootstrap'])
	.controller('loginCtrl', function ($scope, $http, $location, $window) {
		$scope.alerts = [];
		$scope.buttonLabel = "Entrar";
		$scope.inProgress  = false;

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);

			// delete on prod
			$scope.buttonLabel = "Entrar";
			$scope.inProgress  = false;
		};

		$scope.login = function() {
			var url = '';
			$scope.inProgress  = true;
			$scope.buttonLabel = "Entrando...";

			$http.post($location.absUrl(), { username: $scope.username, password: $scope.password }).
				success(function(response, status) {
					if(response.data.redirect != null) {
						$window.location.href = response.data.redirect + '?client_id=' + response.data.client_id + '&redirect_uri=' + response.data.redirect_uri;
					} else {
						$window.location.href = '/home';
					}
				}).
				error(function(response, status) {
					$scope.inProgress  = false;
					$scope.buttonLabel = "Entrar";

					$scope.alerts.push({ type: 'danger', msg: 'El usuario o la contraseña que ingresaste son incorrectos.' });
				});

		};
	});
