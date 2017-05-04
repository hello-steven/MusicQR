import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
// import { CallSpotify } from '../../providers/call-spotify';

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
  // providers: [CallSpotify],
})
export class HomePage {

  spotify_results = [];
  constructor(public navCtrl: NavController) {
  // constructor(public navCtrl: NavController, public callSpotify: CallSpotify) {
    // this.callToSpotify();
  }

  @ViewChild(Slides) slides: Slides;

  // callToSpotify(){
  //   this.callSpotify.load()
  //   .then(data => {
  //     this.spotify_results = data;
  //     console.log(data);
  //     this.navCtrl.push(HomeDetailsPage, { spotify_lists: data });
  //   });
  // }

}
