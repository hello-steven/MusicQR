import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { Spotify } from '../../providers/auth-spotify';

// @Component({
//   templateUrl: 'spotify-details.html',
// })
// export class HomeDetailsPage {
//   spotify_lists = [];
//   constructor(params: NavParams) {
//     // this.spotify_lists = params.data.spotify_lists;
//     this.spotify_lists.push(params.data.spotify_lists);
//     // console.log(params);
//     // console.log(params.get('spotify_lists'));
//     console.log(this.spotify_lists);
//     // alert(this.spotify_list.name);
//   }
// }

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Spotify],
})
export class HomePage {

  oauth_results = [];
  clientId = 'your-spotify-app-client-id';
  constructor(public navCtrl: NavController, public spotify: Spotify) {
  // constructor(public navCtrl: NavController, public callSpotify: CallSpotify) {
    // this.performLogin();
  }

  @ViewChild(Slides) slides: Slides;

  performLogin () {
    $cordovaOauth.spotify(this.clientId, ['user-read-private', 'playlist-read-private']).then(function(result) {
      window.localStorage.setItem('spotify-token', result.access_token);
      this.spotify.setAuthToken(result.access_token);
      this.updateInfo();
    }, function(error) {
        console.log("Error -> " + error);
    });
  };

  updateInfo () {
    this.spotify.$get.getCurrentUser().then(function (data) {
      this.getUserPlaylists(data.id);
    }, function(error) {
      this.performLogin();
    });
  };

  getUserPlaylists (userid) {
    this.spotify.$get.getUserPlaylists(userid).then(function (data) {
      this.playlists = data.items;
    });
  };

}
