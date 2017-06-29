# mia-google-picker-angular

Directiva para AngularJS que interactua con Google Picker API:
* [Google Picker API Overview](https://developers.google.com/picker/)
* [Google Picker API Docs](https://developers.google.com/picker/docs/)

**Requirements:** AngularJS 1.2+

## Installation

1. Usando Bower (recomendado)

  ```Bash
  bower install mia-google-picker --save
  ```

3. Manualmente

Descargar [https://github.com/MobileIA/mia-google-picker-angular/archive/0.1.1.zip](https://github.com/MobileIA/mia-google-picker-angular/archive/0.1.1.zip)

## Como usar

1. Incluir script de google en tu html:

```html
    <script type="text/javascript" src="https://apis.google.com/js/api.js"></script>
```

2. Incluir script de mia-google-picker en el html:

```html
    <script type="text/javascript" src="bower_components/mia-google-picker/dist/mia-google-picker.min.js"></script>
```

2. Incluir el modulo como dependencia de tu app:

```js
    angular.module('myApp', ['miaGooglePicker'])
```

3. Configurar plugin:

Para usar Google Picker se necesita crear un proyecto en Google API y tener credenciales que permitan la conexión. Para mas información dirigirse a: [https://developers.google.com/drive/web/](https://developers.google.com/drive/web/)

Setear los datos necesarios:

```js
angular.module('myApp', ['miaGooglePicker'])

.config(['miaGooglePickerSettingProvider', function (miaGooglePickerSettingProvider) {

  miaGooglePickerSettingProvider.configure({
    apiKey   : 'YOUR_API_KEY',
    clientId : 'YOUR_CLIENT_ID',
    scopes   : ['https://www.googleapis.com/auth/drive.file', 'another_scope', 'and_another'],
    locale   : 'es',
    features : ['..', '..'],
    views    : ['..', '..']
  });
}])
```

4. Crear en el Scope las funciones que se encargaran de los eventos del picker:

```js
  angular.module('myApp', ['miaGooglePicker'])

  .controller('ExampleCtrl', ['$scope', function ($scope) {
     $scope.files = [];

     $scope.onLoaded = function () {
       console.log('Google Picker loaded!');
     }

     $scope.onPicked = function (docs) {
       angular.forEach(docs, function (file, index) {
         $scope.files.push(file);
       });
     }

     $scope.onCancel = function () {
       console.log('Google picker close/cancel!');
     }
  }]);
```

5. Agregar la directiva en tu elemento HTML:

  ```html
  <a href="javascript:;" mia-google-picker on-picked="onPicked(docs)" on-loaded="onLoaded()" on-cancel="onCancel()">Abrir desde Google Drive</a>
  ```

6. Esto es todo, ya tienes todo para que funcione.

7. Aqui te dejamos un ejemplo del objeto de un archivo:

  ```json
  [
    {
      "id": "0B50DHrsuMky6UFlSQloxYGBxT2M",
      "serviceId": "docs",
      "mimeType": "image/jpeg",
      "name": "DSC01845.JPG",
      "type": "photo",
      "lastEditedUtc": 1409023514905,
      "iconUrl": "https://ssl.gstatic.com/docs/doclist/images/icon_11_image_list.png",
      "description": "",
      "url": "https://docs.google.com/file/d/0B50DHrsuMky6UFlSQloxYGBxT2M/edit?usp=drive_web",
      "sizeBytes": 1570863,
      "parentId": "0B50DHrsuMkx6cWhrSXpTR1cyYW8"
    },
    {
      ...
    }
  ]
  ```

## License
Licensed under the MIT license
