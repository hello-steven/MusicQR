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
      <h2 class="section-title">Spotify Results</h2>
        <p class="item-label">{{spotify_list.label}}</p>
        <p class="item-name">{{spotify_list.name}}</p>
        <img src="{{spotify_list.images[0].url}}">
        <ion-list>
          <ion-item ion-item *ngFor="let spotify_track of spotify_list.tracks.items">
            <button class="list-button" ion-button icon-add color="light">
                <a href="http://open.spotify.com/{{spotify_track.type}}/{{spotify_track.id}}">{{spotify_track.name}}</a>
            </button>
          </ion-item>
        </ion-list>
        <button class="Scan-button" ion-button block color="royal">
          <a href="http://open.spotify.com/{{spotify_list.type}}/{{spotify_list.id}}">Add to Spotify?</a>
        </button>
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
  openSpotifyApp(clickType, clickId) {
    window.open("http://open.spotify.com/"+clickType+"/"+clickId);
    console.log(clickType+", "+clickId);
    console.log("clicked add to playlist");
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
    // this.callToSpotify({"url":"https://api.spotify.com/v1/albums/4wuYQ9hyF1EGmrtjMpgpE9", "qr_tracker":"QR_88jhkhoqwe"});
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
          // alert("User cancelled the action!");
          this.buttonText = "Scan";
          this.loading = false;
          return false;
        }
        // alert("Scanned successfully!");
        // alert(barcodeData.text);
        this.goToResult(barcodeData.text);
      }, (err) => {
        alert(err);
      });
    }

    goToResult(barcodeData) {
      var barcode_obj = JSON.parse(barcodeData);
      // barcodeData.json();
      // alert("ready to open callSpotify");
      // alert("url: "+barcode_obj.url+", qr_tracker: "+barcode_obj.qr_tracker);
      this.callSpotify.load(barcode_obj.url, barcode_obj.qr_tracker)
      .then(data => {
        this.spotify_results = data;
        // console.log(data);
        // alert("got data back about to pass to new view");
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

    callToSpotify(text_obj){
      // alert("callToSpotify text_obj");
      this.callSpotify.load(text_obj.url, text_obj.qr_tracker)
      .then(data => {
        this.spotify_results = data;
        // console.log(data);
        this.navCtrl.push(ScanResultsPage, { spotify_lists: data });
      });
    }

    // private checkPass(data) {
    // }

}
