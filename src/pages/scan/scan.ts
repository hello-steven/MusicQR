import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NavController, NavParams } from 'ionic-angular';
import { CallSpotify } from '../../providers/call-spotify';

@Component({
  selector: 'page-scan-result',
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons start>
        <button ion-button icon-only color="royal">
          <ion-icon name="contact"></ion-icon>
        </button>
      </ion-buttons>
      <ion-title>Scan - QR Music App</ion-title>
      <ion-buttons end>
        <button ion-button icon-only color="royal">
          <ion-icon name="settings"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-list>
      <ion-item ion-item *ngFor="let spotify_list of spotify_lists">
      <h2 class="section-title Scan-resultUser">{{scannedText}}</h2>
      <h2 class="section-titel">Spotify Results</h2>
        <p>{{spotify_list.label}}</p>
        <p>{{spotify_list.name}}</p>
        <img src="{{spotify_list.images[0].url}}">
        <ion-list>
          <ion-item ion-item *ngFor="let spotify_track of spotify_list.tracks.items">
            <button ion-item icon-add  color="light">
                <p>{{spotify_track.name}}</p>
            </button>
          </ion-item>
        </ion-list>
        <button ion-button block color="royal">Add to Playlist?</button>
      </ion-item>
    </ion-list>
  </ion-content>
  `,
})

export class ScanResultsPage {

  public scannedText: string;
  spotify_lists = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.spotify_lists.push(navParams.data.spotify_lists);
    console.log(this.spotify_lists);
  }

  ionViewDidLoad() {
    this.scannedText = this.navParams.get("scannedText");
  }
  openResultsPage(results) {
    // console.log(results);
    // alert(results);
  }
}

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
  providers: [CallSpotify],
})
export class ScanPage {
  public scannedText: string;
  public buttonText: string;
  public loading: boolean;
  private eventId: number;
  public eventTitle: string;
  spotify_results = [];

  // constructor() {
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public callSpotify: CallSpotify) {
    this.callToSpotify("https://api.spotify.com/v1/albums/4uNp9aHx5UeJR69aLpAtvR");
  }
    // constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
      this.eventId = this.navParams.get('eventId');
      this.eventTitle = this.navParams.get('eventTitle');

      this.buttonText = "Scan";
      this.loading = false;
    }

    public scanQR() {
      this.buttonText = "Loading..";
      this.loading = true;

      this.barcodeScanner.scan().then((barcodeData) => {
        if (barcodeData.cancelled) {
          alert("User cancelled the action!");
          this.buttonText = "Scan";
          this.loading = false;
          return false;
        }
        // alert("Scanned successfully!");
        // alert(barcodeData);
        this.goToResult(barcodeData);
      }, (err) => {
        alert(err);
      });
    }

    private goToResult(barcodeData) {
      this.callSpotify.load(barcodeData.text)
      .then(data => {
        this.spotify_results = data;
        // console.log(data);
        this.navCtrl.push(ScanResultsPage, {
          scannedText: barcodeData.text,
          spotify_lists: data
        });
      });
      // this.navCtrl.push(ScanResultsPage, {
      //   scannedText: barcodeData.text,
      //   spotify_lists: barcodeData.text,
      // });
    }

    callToSpotify(url){
      this.callSpotify.load(url)
      .then(data => {
        this.spotify_results = data;
        // console.log(data);
        this.navCtrl.push(ScanResultsPage, { spotify_lists: data });
      });
    }

    // private checkPass(data) {
    // }

}
