function Spotify () {
/**
 * API Base URL
 */
settings.apiBase = 'https://api.spotify.com/v1';

this.$get = ['$q', '$http', '$window', function ($q, $http, $window) {

  function NgSpotify () {
    this.clientId = settings.clientId;
    this.redirectUri = settings.redirectUri;
    this.apiBase = settings.apiBase;
    this.scope = settings.scope;
    this.authToken = settings.authToken;
    this.toQueryString = utils.toQueryString;
  }

  function openDialog (uri, name, options, cb) {
    var win = window.open(uri, name, options);
    var interval = window.setInterval(function () {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) {}
    }, 1000);
    return win;
  }

  NgSpotify.prototype = {
    api: function (endpoint, method, params, data, headers) {
      var deferred = $q.defer();

      $http({
        url: this.apiBase + endpoint,
        method: method ? method : 'GET',
        params: params,
        data: data,
        headers: headers,
        withCredentials: false
      })
      .then(function (data) {
        deferred.resolve(data);
      })
      .catch(function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    },

    _auth: function (isJson) {
      var auth = {
        'Authorization': 'Bearer ' + this.authToken
      };
      if (isJson) {
        auth['Content-Type'] = 'application/json';
      }
      return auth;
    },
}
