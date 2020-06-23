

  app.component("yewnoPrimoAddon", {
    bindings: {parentCtrl: '<'},
    controller: 'yewnoPrimoAddonController',
    template: '<div class="yewno-widget-container"><div class="yewno-widget" id="yewno-widget"></div></div>'
    }
  );

  app.controller('yewnoPrimoAddonController', ['angularLoad', function (angularLoad) {
      this.$onInit = function () {
        angularLoad.loadScript('https://static.yewno.com/assets/widget/yewno.min.js').then(function () {
          new YewnoDiscoverWidget({
            containerElementSelector: '#yewno-widget',
            urlSearchParams: function() {
              const urlSearchParams = new URLSearchParams(window.location.search);
              const q = urlSearchParams.get('query');
              return q.split(',')[2];
            },
            width: Math.min(400, window.innerWidth),
            height: 250,
            languages: ['eng'],
          });
        });
      };
    }]);

