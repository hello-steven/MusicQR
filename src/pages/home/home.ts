import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { GoSpotify } from '../../providers/auth-spotify';
import {Spotify} from "ng2-cordova-oauth/core";
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova'
import {Oauth} from 'ng2-cordova-oauth/oauth'

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
  providers: [GoSpotify, Oauth, OauthCordova, Spotify],
})
export class HomePage {

  oauth_results = [];
  clientId = 'your-spotify-app-client-id';
  constructor(public navCtrl: NavController, public gospotify: GoSpotify, public oauth: Oauth, public oauthCordova: OauthCordova, public spotify: Spotify) {
  // constructor(public navCtrl: NavController, public callSpotify: CallSpotify) {
    // this.performLogin();
  }

  @ViewChild(Slides) slides: Slides;

  performLogin () {
    this.oauthCordova.spotify(this.clientId, ['user-read-private', 'playlist-read-private', 'user-library-private']).then(function(result) {
      window.localStorage.setItem('spotify-token', result.access_token);
      this.gospotify.setAuthToken(result.access_token);
      this.updateInfo();
    }, function(error) {
        console.log("Error -> " + error);
    });
  };

  updateInfo () {
    this.gospotify.$get['NgSpotify'].getCurrentUser().then(function (data) {
      this.getUserPlaylists(data.id);
    }, function(error) {
      this.performLogin();
    });
  };

  ionViewDidLoad() {
    var storedToken = window.localStorage.getItem('spotify-token');
    if (storedToken !== null) {
      this.gospotify.setAuthToken(storedToken);
      this.updateInfo();
    } else {
      this.performLogin();
    }
  }

  getUserPlaylists (userid) {
    this.gospotify.$get['NgSpotify'].getUserPlaylists(userid).then(function (data) {
      this.playlists = data.items;
    });
  };

}
