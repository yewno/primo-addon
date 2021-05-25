const right = `<div class="yewno-widget-right"></div>`

const left = `<div class="yewno-widget-left"></div>`

app.component("yewnoPrimoAddon", {
  bindings: { parentCtrl: '<' },
  controller: 'yewnoPrimoAddonController',
  template: `<div class="yewno-widget-container">${left}<div class="yewno-widget" id="yewno-widget"></div><div ng-if="hasQuery" class="yewno-widget-description"><span class="yewno-widget-text">Visualize your research with a Knowledge Map and make unexpected connections. Click here and use Yewno Discover to carry out your research more efficiently and find links to relevant high quality documents. Yewno Discover can help you with topic exploration, hypothesis creation, and redirect research that has reached a dead end.</span></div>${right}</div>`
});

app.controller('yewnoPrimoAddonController', ['angularLoad', 'yewnoPrimoAddonStudioConfig', '$scope', function (angularLoad, studioConfig, $scope) {
  var vm = this;
  vm.config = studioConfig;
  var apikey = studioConfig[0].apikey;
  var ezproxyUrl = studioConfig[0].ezproxy;
  var useSSOLogin = studioConfig[0].ssologin;
  var entityId = studioConfig[0].entityid;

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
    var q = vm.parentCtrl.$stateParams.query;
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
      var defaultOpts = {
        containerElementSelector: '#yewno-widget',
        urlSearchParams: function urlSearchParams() {
          return query;
        },
        width: Math.min(500, window.innerWidth),
        height: 250,
        languages: ['eng'],
        accessToken: apikey,
      }
      var opts = Object.assign({}, defaultOpts, config)
      new YewnoDiscoverWidget(opts);
    });
  };
}]);