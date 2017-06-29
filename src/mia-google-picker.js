/**
 * Libreria para usar Google Picker facilmente desde AngularJS
 * @version v0.1.1
 * @link https://github.com/MobileIA/mia-google-picker-angular
 * @author Matias Camiletti <matiascamiletti@mobileia.com> 
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function() {
    'use strict';

    angular
            .module('miaGooglePicker', [])
            .provider('miaGooglePickerSetting', miaGooglePickerSettingProvider)
            .directive('miaGooglePicker', miaGooglePicker);
    
    function miaGooglePickerSettingProvider(){
        this.apiKey   = null;
        this.clientId = null;
        this.scopes   = ['https://www.googleapis.com/auth/drive.file'];
        this.features = ['MULTISELECT_ENABLED'];
        this.views    = ['DocsView().setIncludeFolders(true)','DocsUploadView().setIncludeFolders(true)'];
        this.locale   = 'en'; // Default to English
        /**
         * Configura con todos los parametros seteados
         * @param Object config
         */
        this.configure = function (config) {
            for (var key in config) {
                this[key] = config[key];
            }
        };
        
        this.$get = miaGooglePickerSetting;
        
        miaGooglePickerSetting.$inject = ['$window'];
        
        function miaGooglePickerSetting($window) {
            var service = {
                apiKey: this.apiKey,
                clientId: this.clientId,
                scopes: this.scopes,
                features: this.features,
                views: this.views,
                locale: this.locale,
                origin: this.origin || $window.location.protocol + '//' + $window.location.host
            };
            return service;
        };
    };
    
    miaGooglePicker.$inject = ['miaGooglePickerSetting'];
    
    function miaGooglePicker(miaGooglePickerSetting){
        return {
            restrict: 'A',
            scope: {
                onLoaded: '&',
                onCancel: '&',
                onPicked: '&'
            },
            link: function (scope, element) {
                /**
                 * Variable que almacena el Token obtenido del usuario
                 * @type String
                 */
                var accessToken = null;
                /**
                 * Funcion que inicia el proceso de Autenticación
                 */
                function instanciate() {
                    gapi.load('auth', {'callback': onApiAuthLoad});
                    gapi.load('picker');
                }
                /**
                 * Funcion que se encarga de la Autenticación OAuth
                 */
                function onApiAuthLoad() {
                    // Buscamos un token ya creado
                    var authToken = gapi.auth.getToken();
                    // Verificamos si es valido el token
                    if (authToken) {
                        // Llamamos a la funcion que procesa el Token
                        handleAuthResult(authToken);
                    } else {
                        // Iniciamos proceso de pedido de permisos
                        gapi.auth.authorize({
                            'client_id': miaGooglePickerSetting.clientId,
                            'scope': miaGooglePickerSetting.scopes,
                            'immediate': false
                        }, handleAuthResult);
                    }
                }
                /**
                 * Callback que se encarga de verificar si se aceptaron los permisos
                 * @param Result result
                 */
                function handleAuthResult(result) {
                    // Verificamos que la respuesta sea correcta
                    if (result && !result.error) {
                        // Guardamos el token del usuario
                        accessToken = result.access_token;
                        // Abrimos el picker
                        openPicker();
                    }
                }
                /**
                 * Funcion que se encarga de crear el Picker con las opciones de configuración
                 */
                function openPicker() {
                    // Creamos el picker
                    var picker = new google.picker.PickerBuilder()
                            .setLocale(miaGooglePickerSetting.locale)
                            .setDeveloperKey(miaGooglePickerSetting.apiKey)
                            .setOAuthToken(accessToken)
                            .setCallback(pickerResponse)
                            .setOrigin(miaGooglePickerSetting.origin);
                    // Asignamos los Features
                    if (miaGooglePickerSetting.features.length > 0) {
                        angular.forEach(miaGooglePickerSetting.features, function (feature, key) {
                            picker.enableFeature(google.picker.Feature[feature]);
                        });
                    }
                    // Asignamos los Views
                    if (miaGooglePickerSetting.views.length > 0) {
                        angular.forEach(miaGooglePickerSetting.views, function (view, key) {
                            view = eval('new google.picker.' + view);
                            picker.addView(view);
                        });
                    }
                    // Mostramos el picker
                    picker.build().setVisible(true);
                }
                /**
                 * Funcion que es invocada al terminar el picker.
                 * @param Data data
                 */
                function pickerResponse(data) {
                    // Verificamos si se cargo el picker
                    if (data.action == google.picker.Action.LOADED && scope.onLoaded) {
                        (scope.onLoaded || angular.noop)();
                    }
                    // Verificamos si se cancelo el picker
                    if (data.action == google.picker.Action.CANCEL && scope.onCancel) {
                        (scope.onCancel || angular.noop)();
                    }
                    // Analizamos si se ha seleccionado uno o varios archivos
                    if (data.action == google.picker.Action.PICKED && scope.onPicked) {
                        (scope.onPicked || angular.noop)({docs: data.docs});
                    }
                    scope.$apply();
                }
                /**
                 * Seteamos el evento para que se abra el picker al hacer click
                 */
                element.bind('click', function (e) {
                    instanciate();
                });
            }
        };
    };
})();

