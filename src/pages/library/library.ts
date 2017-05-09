import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { CallSpotify } from '../../providers/call-spotify';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";

@Component({
  selector: 'page-library-details',
  // templateUrl: 'library-details.html',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Library - QR Music App
      </ion-title>
      <ion-buttons end>
      </ion-buttons>
    </ion-navbar>
  </ion-header>

  <ion-content padding>

      <ion-list class="details-list">
        <ion-list-header>
          {{ list.desc }}
        </ion-list-header>
        <ion-searchbar (ionInput)="getItems($event)">
        </ion-searchbar>
        <ion-item *ngFor="let item of items">
          <a class="list-item" href="http://open.spotify.com/{{item.type}}/{{item.id}}">{{item.name}}</a>
        </ion-item>
      </ion-list>

  </ion-content>
  `,
  providers: [CallSpotify]
})
export class LibraryDetailsPage {
  list;
  deleted;
  spotify_lists = [];
  details : any;
  items = [];
  db_item: FirebaseListObservable<any[]>;
  constructor(params: NavParams, public callSpotify: CallSpotify, public db: AngularFireDatabase) {
    this.list = params.data.list;
    var sort_title = this.list["title"].toLowerCase();
    console.log(sort_title);

    // console.log(this.details);
    // alert(this.list.title);
    // console.log(this.details);
    this.db.list('/0/user_name/admin/spotify_data/qr_tracker')
      .subscribe(snapshots => {
        console.log(snapshots);
        snapshots.forEach(snapshot => {
          if (sort_title == 'songs') {
            snapshot.spotify_results.tracks.items.forEach(track => {
              this.spotify_lists.push(track);
              console.log(track);
            });
          }
          if (sort_title == 'albums' && snapshot.spotify_results.type == 'album') {
            this.spotify_lists.push(snapshot.spotify_results);
            console.log(snapshot.spotify_results);
          }
          if (sort_title == 'artists' && snapshot.spotify_results.type == 'artist') {
            this.spotify_lists.push(snapshot.spotify_results);
            console.log(snapshot.spotify_results);
          }
          if (sort_title == 'playlists' && snapshot.spotify_results.type == 'playlist') {
            this.spotify_lists.push(snapshot.spotify_results);
            console.log(snapshot.spotify_results);
          }
        });
    });
    this.initializeItems();
  }
  openDetailPage(detail) {
    console.log(detail);
    // alert(detail);
  }
  deleteDetail(deleted) {
    console.log(deleted);
  }
  initializeItems() {
    this.items = this.spotify_lists;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item["name"].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}


@Component({
  selector: 'page-library',
  // templateUrl: 'library.html',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons start>
          <button ion-button icon-only color="royal">
            <ion-icon name="contact"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>Library - QR Music App</ion-title>
        <ion-buttons end>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <button ion-item *ngFor="let list of lists" (click)="openLibraryPage(list)" icon-left color="light">
          <ion-icon [name]="list.icon" item-left color="light"></ion-icon>
          {{ list.title }}
        </button>
      </ion-list>
    </ion-content>
  `
})
export class LibraryPage {
  lists = [];
  // db_search:FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController) {

    // this.navCtrl.setRoot(LibraryPage);

    this.lists = [
      {
        'title': 'Playlists',
        'icon': 'musical-notes',
        'nav'  : 'PlaylistsPage',
        'desc' : 'These are your playlists'
      },
      {
        'title': 'Songs',
        'icon': 'musical-note',
        'nav'  : 'SongsPage',
        'desc' : 'These are your songs'
      },
      {
        'title' : 'Albums',
        'icon' : 'disc',
        'nav'  : 'AlbumsPage',
        'desc' : 'These are your albums'
      },
      {
        'title' : 'Artists',
        'icon' : 'people',
        'nav'  : 'ArtistsPage',
        'desc' : 'These are your artists'
      }
    ];
  }

  openLibraryPage(list) {
    this.navCtrl.push(LibraryDetailsPage, { list: list });
  }

}
