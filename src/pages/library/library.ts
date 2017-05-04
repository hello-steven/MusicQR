import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'library-details.html',
})
export class LibraryDetailsPage {
  list;
  deleted;
  details = [];
  constructor(params: NavParams) {
    this.list = params.data.list;
    console.log(this.list);
    // alert(this.list.title);
  }
  openDetailPage(detail) {
    console.log(detail);
    // alert(detail);
  }
  deleteDetail(deleted) {
    console.log(deleted);
  }
}


@Component({
  // selector: 'page-library',
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
          <button ion-button icon-only color="royal">
            <ion-icon name="settings"></ion-icon>
          </button>
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
  constructor(public navCtrl: NavController ) {

      // this.navCtrl.setRoot(LibraryPage);

      this.lists = [
        {
          'title':'Playlists',
          'icon' : 'musical-notes',
          'nav'  : 'PlaylistsPage',
          'desc' : 'These are your playlists'
        },
        {
          'title':'Songs',
          'icon':'musical-note',
          'nav'  : 'SongsPage',
          'desc' : 'These are your songs'
        },
        {
          'title':'Albums',
          'icon':'disc',
          'nav'  : 'AlbumsPage',
          'desc' : 'These are your albums'
        },
        {
          'title':'Artists',
          'icon':'people',
          'nav'  : 'ArtistsPage',
          'desc' : 'These are your artists'
        }
      ];
  }

  openLibraryPage(list) {
    this.navCtrl.push(LibraryDetailsPage, { list: list });
  }

}
