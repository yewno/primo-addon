angular.module('yewnoPrimoFacetAddon', []).value('searchTargets')
  .component('prmFacetAfter', {
    bindings: { parentCtrl: '<' },
    controller: ['yewnoPrimoFacetAddon', function (yewnoPrimoFacetAddon) {
      this.$onInit = function () {
        yewnoPrimoFacetAddon.setController(this.parentCtrl);
        yewnoPrimoFacetAddon.addExtSearch();
      };
    }],
  })
  .component('prmFacetExactAfter', {
    bindings: { parentCtrl: '<' },
    template: '<div ng-if="name === \'Yewno Discover\'">\
                <div ng-hide="$ctrl.parentCtrl.facetGroup.facetGroupCollapsed">\
                  <div id="yewno-widget"></div>\
                </div>\
              </div>',
    controller: ['angularLoad', '$scope', '$location','yewnoPrimoAddonStudioConfig', function (angularLoad, $scope, $location, studioConfig) {
      if (this.parentCtrl.facetGroup.name === 'Yewno Discover') {
        var vm = this;
        vm.config = studioConfig;
        var apikey = studioConfig[0].apikey;
        var ezproxyUrl = studioConfig[0].ezproxy;
        var useSSOLogin = studioConfig[0].ssologin;
        var entityId = studioConfig[0].entityid;
        var definitionCount = studioConfig[0].definitionCount;
        var height = studioConfig[0].height || 400;
    
        if (!apikey) {
          console.error('Yewno Primo Addon: missing required apikey parameter.');
          return;
        } 
        let config = {};
        try {
          if (studioConfig[0].config) {
            config = JSON.parse(studioConfig[0].config);
          }
        } catch (ex) {
          console.error('Yewno Primo Addon: config is not a valid json object');
        }
    
        if (useSSOLogin) {
          config['urlPrefix'] = function (path) {
            var discoUrl = `${this.hrefBase}${path}`;
            var relayState = {redirect: encodeURIComponent(discoUrl)};
            if (ezproxyUrl) {
              relayState['proxy'] = encodeURIComponent(ezproxyUrl);
            }
            var url = `https://auth.yewno.com/auth/saml?RelayState=${JSON.stringify(relayState)}`
            if (entityId) {
              url += "&entityId=" + entityId;
            }
            return url;
          }
        } else {
          config['urlPrefix'] = ezproxyUrl;
        }
    
        function getQuery() {
          var q = $location.search().query;
          if (!q) {
            return false;
          }
          if (Array.isArray(q)) {
            q = q[0];
          }
          var qargs = q.split(',');
          if (qargs.length < 3) {
            return false;
          }
          return qargs[2];
        }
    
        this.$onInit = function () {
          var query = getQuery();
          $scope.hasQuery = !!query;
    
          if (!query) {
            return;
          }
          fetch(`https://neon.yewno.com/institute?host=${window.location.origin}&access_token=${apikey}`)
          .then((r) => { if (r.status !== 200) {
            throw new Error('invalid product key')
          }})
          .then(() => angularLoad.loadScript('https://static.yewno.com/assets/widget/yewno.min.js'))
          .then(function () {
            const yewnoContainer = document.querySelector('#yewno-widget');
            const width = yewnoContainer.offsetWidth - 10;
            var defaultOpts = {
              containerElementSelector: '#yewno-widget',
              urlSearchParams: function urlSearchParams() {
                return query;
              },
              width,
              height,
              languages: ['eng'],
              accessToken: apikey,
              definitionCount,
            }
            var opts = Object.assign({}, defaultOpts, config)
            setTimeout(() => {
              new YewnoRelate(opts);
            }, 150);
          });
          $scope.name = this.parentCtrl.facetGroup.name;
        };
      }
    }],
  })
  .factory('yewnoPrimoFacetAddon', () => ({
    getController() {
      return this.prmFacetCtrl || false;
    },
    setController(controller) {
      this.prmFacetCtrl = controller;
    },
    addExtSearch: function addExtSearch() {
      const xx = this;
      var checkExist = setInterval(() => {
        if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name != 'Yewno Discover') {
          if (xx.prmFacetCtrl.facetService.results.name !== 'Yewno Discover') {
            xx.prmFacetCtrl.facetService.results.unshift({
              name: 'Yewno Discover',
              displayedType: 'exact',
              limitCount: 0,
              facetGroupCollapsed: false,
              values: undefined,
            });
          }
          clearInterval(checkExist);
        }
      }, 100);
    },
  }));
