import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthSpotify provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GoSpotify {
  data: any;
  // clientId: any;
  settings = {
    "clientId": null,
    "redirectUri": null,
    "scope": null,
    "authToken": null,
    "apiBase": "https://api.spotify.com/v1",
  };
  // settings.clientId = null;
  // settings.redirectUri = null;
  // settings.scope = null;
  // settings.authToken = null;
  utils = {};

  constructor(public http: Http) {
    // console.log('Hello AuthSpotify Provider');
  }

  setClientId (clientId) {
    this.settings.clientId = clientId;
    return this.settings.clientId;
  };

  getClientId () {
    return this.settings.clientId;
  };

  setAuthToken (authToken) {
    this.settings.authToken = authToken;
    return this.settings.authToken;
  };

  setRedirectUri (redirectUri) {
    this.settings.redirectUri = redirectUri;
    return this.settings.redirectUri;
  };

  getRedirectUri () {
    return this.settings.redirectUri;
  };

  setScope (scope) {
    this.settings.scope = scope;
    return this.settings.scope;
  };

  // toQueryString (obj) {
  //   var parts = [];
  //   obj.forEach(function (value, key) {
  //     this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  //   }, parts);
  //   return parts.join('&');
  // };

  toQueryString (obj) {
    var parts = [];
    for(var k in obj){
        parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]));
    }
    return parts.join('&');
  };

  /**
   * API Base URL
   */
  // settings.apiBase = 'https://api.spotify.com/v1';

  $get = ['$q', '$http', '$window', function ($q, $http, $window) {

    function NgSpotify () {
      this.clientId = this.settings.clientId;
      this.redirectUri = this.settings.redirectUri;
      this.apiBase = this.settings.apiBase;
      this.scope = this.settings.scope;
      this.authToken = this.settings.authToken;
      this.toQueryString = this.utils.toQueryString;
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
      /**
        ====================== Albums =====================
       */

      /**
       * Gets an album
       * Pass in album id or spotify uri
       */
      getAlbum: function (album) {
        album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

        return this.api('/albums/' + album);
      },

      /**
       * Gets an album
       * Pass in comma separated string or array of album ids
       */
      getAlbums: function (albums) {
        albums = albums.isString(albums) ? albums.split(',') : albums;
        albums.forEach( function (value, index) {
          albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/albums', 'GET', {
          ids: albums ? albums.toString() : ''
        });
      },

      /**
       * Get Album Tracks
       * Pass in album id or spotify uri
       */
      getAlbumTracks: function (album, options) {
        album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

        return this.api('/albums/' + album + '/tracks', 'GET', options);
      },


      /**
        ====================== Artists =====================
       */

      /**
       * Get an Artist
       */
      getArtist: function (artist) {
        artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

        return this.api('/artists/' + artist);
      },

      /**
       * Get multiple artists
       */
      getArtists: function (artists) {
        artists = artists.isString(artists) ? artists.split(',') : artists;
        artists.forEach( function (value, index) {
          artists[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/artists/', 'GET', {
          ids: artists ? artists.toString() : ''
        });
      },

      //Artist Albums
      getArtistAlbums: function (artist, options) {
        artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

        return this.api('/artists/' + artist + '/albums', 'GET', options);
      },

      /**
       * Get Artist Top Tracks
       * The country: an ISO 3166-1 alpha-2 country code.
       */
      getArtistTopTracks: function (artist, country) {
        artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

        return this.api('/artists/' + artist + '/top-tracks', 'GET', {
          country: country
        });
      },

      getRelatedArtists: function (artist) {
        artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

        return this.api('/artists/' + artist + '/related-artists');
      },


      /**
        ====================== Browse =====================
       */
      getFeaturedPlaylists: function (options) {
        return this.api('/browse/featured-playlists', 'GET', options, null, this._auth());
      },

      getNewReleases: function (options) {
        return this.api('/browse/new-releases', 'GET', options, null, this._auth());
      },

      getCategories: function (options) {
        return this.api('/browse/categories', 'GET', options, null, this._auth());
      },

      getCategory: function (category_id, options) {
        return this.api('/browse/categories/' + category_id, 'GET', options, null, this._auth());
      },

      getCategoryPlaylists: function (category_id, options) {
        return this.api('/browse/categories/' + category_id + '/playlists', 'GET', options, null, this._auth());
      },

      getRecommendations: function (options) {
        return this.api('/recommendations', 'GET', options, null, this._auth());
      },

      getAvailableGenreSeeds: function () {
        return this.api('/recommendations/available-genre-seeds', 'GET', null, null, this._auth());
      },


      /**
        ====================== Following =====================
       */
      following: function (type, options) {
        options = options || {};
        options.type = type;
        return this.api('/me/following', 'GET', options, null, this._auth());
      },

      follow: function (type, ids) {
        return this.api('/me/following', 'PUT', { type: type, ids: ids }, null, this._auth());
      },

      unfollow: function (type, ids) {
        return this.api('/me/following', 'DELETE', { type: type, ids: ids }, null, this._auth());
      },

      userFollowingContains: function (type, ids) {
        return this.api('/me/following/contains', 'GET', { type: type, ids: ids }, null, this._auth());
      },

      followPlaylist: function (userId, playlistId, isPublic) {
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', 'PUT', null, {
          public: isPublic || null
        }, this._auth(true));
      },

      unfollowPlaylist: function (userId, playlistId) {
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers', 'DELETE', null, null, this._auth());
      },

      playlistFollowingContains: function(userId, playlistId, ids) {
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/followers/contains', 'GET', {
          ids: ids.toString()
        }, null, this._auth());
      },


      /**
        ====================== Library =====================
       */
      getSavedUserTracks: function (options) {
        return this.api('/me/tracks', 'GET', options, null, this._auth());
      },

      userTracksContains: function (tracks) {
        tracks = tracks.isString(tracks) ? tracks.split(',') : tracks;
        tracks.forEach(tracks, function (value, index) {
          tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/me/tracks/contains', 'GET', {
          ids: tracks.toString()
        }, null, this._auth());
      },

      saveUserTracks: function (tracks) {
        tracks = tracks.isString(tracks) ? tracks.split(',') : tracks;
        tracks.forEach(tracks, function (value, index) {
          tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/me/tracks', 'PUT', {
          ids: tracks.toString()
        }, null, this._auth());
      },

      removeUserTracks: function (tracks) {
        tracks = tracks.isString(tracks) ? tracks.split(',') : tracks;
        tracks.forEach(tracks, function (value, index) {
          tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/me/tracks', 'DELETE', {
          ids: tracks.toString()
        }, null, this._auth(true));
      },

      saveUserAlbums: function (albums) {
        albums = albums.isString(albums) ? albums.split(',') : albums;
        albums.forEach(albums, function (value, index) {
          albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/me/albums', 'PUT', {
          ids: albums.toString()
        }, null, this._auth());
      },

      getSavedUserAlbums: function (options) {
        return this.api('/me/albums', 'GET', options, null, this._auth());
      },

      removeUserAlbums: function (albums) {
        albums = albums.isString(albums) ? albums.split(',') : albums;
        albums.forEach(albums, function (value, index) {
          albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/me/albums', 'DELETE', {
          ids: albums.toString()
        }, null, this._auth(true));
      },

      userAlbumsContains: function (albums) {
        albums = albums.isString(albums) ? albums.split(',') : albums;
        albums.forEach(albums, function (value, index) {
          albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/me/albums/contains', 'GET', {
          ids: albums.toString()
        }, null, this._auth());
      },


      /**
        ====================== Personalization =====================
       */
       getUserTopArtists: function (options) {
         options = options || {};
         return this.api('/me/top/artists', 'GET', options, null, this._auth());
       },

       getUserTopTracks: function (options) {
         options = options || {};
         return this.api('/me/top/tracks', 'GET', options, null, this._auth());
       },


      /**
        ====================== Playlists =====================
       */
      getUserPlaylists: function (userId, options) {
        return this.api('/users/' + userId + '/playlists', 'GET', options, null, {
          'Authorization': 'Bearer ' + this.authToken
        });
      },

      getPlaylist: function (userId, playlistId, options) {
        return this.api('/users/' + userId + '/playlists/' + playlistId, 'GET', options, null, this._auth());
      },

      getPlaylistTracks: function (userId, playlistId, options) {
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'GET', options, null, this._auth());
      },

      createPlaylist: function (userId, options) {
        return this.api('/users/' + userId + '/playlists', 'POST', null, options, this._auth(true));
      },

      addPlaylistTracks: function (userId, playlistId, tracks, options) {
        tracks = tracks.isArray(tracks) ? tracks : tracks.split(',');
        tracks.forEach(tracks, function (value, index) {
          tracks[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
        });
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'POST', {
          uris: tracks.toString(),
          position: options ? options.position : null
        }, null, this._auth(true));
      },

      removePlaylistTracks: function (userId, playlistId, tracks) {
        tracks = tracks.isArray(tracks) ? tracks : tracks.split(',');
        var track;
        tracks.forEach(tracks, function (value, index) {
          track = tracks[index];
          tracks[index] = {
            uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
          };
        });
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'DELETE', null, {
          tracks: tracks
        }, this._auth(true));
      },

      reorderPlaylistTracks: function (userId, playlistId, options) {
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'PUT', null, options, this._auth(true));
      },

      replacePlaylistTracks: function (userId, playlistId, tracks) {
        tracks = tracks.isArray(tracks) ? tracks : tracks.split(',');
        var track;
        tracks.forEach(tracks, function (value, index) {
          track = tracks[index];
          tracks[index] = track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
        });
        return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'PUT', {
          uris: tracks.toString()
        }, null, this._auth(true));
      },

      updatePlaylistDetails: function (userId, playlistId, options) {
        return this.api('/users/' + userId + '/playlists/' + playlistId, 'PUT', null, options, this._auth(true));
      },

      /**
        ====================== Profiles =====================
       */

      getUser: function (userId) {
        return this.api('/users/' + userId);
      },

      getCurrentUser: function () {
        return this.api('/me', 'GET', null, null, this._auth());
      },



      /**
       * Search Spotify
       * q = search query
       * type = artist, album or track
       */
      search: function (q, type, options) {
        options = options || {};
        options.q = q;
        options.type = type;

        return this.api('/search', 'GET', options);
      },


      /**
        ====================== Tracks =====================
       */
      getTrack: function (track) {
        track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

        return this.api('/tracks/' + track);
      },

      getTracks: function (tracks) {
        tracks = tracks.isString(tracks) ? tracks.split(',') : tracks;
        tracks.forEach(tracks, function (value, index) {
          tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/tracks/', 'GET', {
          ids: tracks ? tracks.toString() : ''
        });
      },

      getTrackAudioFeatures: function (track) {
        track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];
        return this.api('/audio-features/' + track, 'GET', null, null, this._auth());
      },

      getTracksAudioFeatures: function (tracks) {
        tracks = tracks.isString(tracks) ? tracks.split(',') : tracks;
        tracks.forEach(tracks, function (value, index) {
          tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });
        return this.api('/audio-features/', 'GET', {
          ids: tracks ? tracks.toString() : ''
        }, null, this._auth());
      },


      /**
        ====================== Login =====================
       */
      setAuthToken: function (authToken) {
        this.authToken = authToken;
        return this.authToken;
      },

      login: function () {
        var deferred = $q.defer();
        var that = this;

        var w = 400,
            h = 500,
            left = (screen.width / 2) - (w / 2),
            top = (screen.height / 2) - (h / 2);

        var params = {
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          scope: this.scope || '',
          response_type: 'token'
        };

        var authCompleted = false;
        var authWindow = openDialog(
          'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
          'Spotify',
          'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
          function () {
            if (!authCompleted) {
              deferred.reject();
            }
          }
        );

        function storageChanged (e) {
          if (e.key === 'spotify-token') {
            if (authWindow) { authWindow.close(); }
            authCompleted = true;

            that.setAuthToken(e.newValue);
            $window.removeEventListener('storage', storageChanged, false);

            deferred.resolve(e.newValue);
          }
        }

        $window.addEventListener('storage', storageChanged, false);

        return deferred.promise;
      }
    };

    return new NgSpotify();
  }];

}
