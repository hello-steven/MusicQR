import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { GoSpotify } from '../../providers/auth-spotify';
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova';
import {Oauth} from 'ng2-cordova-oauth/oauth';
import {Spotify} from "ng2-cordova-oauth/core";

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
    this.oauthCordova.logInVia(this.spotify, [this.clientId, ['user-read-private', 'playlist-read-private']]).then(function(result) {
      window.localStorage.setItem('spotify-token', JSON.stringify(result));
      this.gospotify.setAuthToken(JSON.stringify(result));
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
