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
    <ion-item ion-item>
    <h2 class="section-title">Spotify Results</h2>
      <a href="http://open.spotify.com/{{spotify_lists.type}}/{{spotify_lists.id}}"><img src="{{spotify_lists.images[1].url}}"></a>
      <p class="item-details">{{spotify_lists.artists[0].name}} - {{spotify_lists.name}}</p>
    </ion-item>
    <ion-list>
      <ion-item ion-item *ngFor="let spotify_track of spotify_tracks">
        <button ion-button round class="list-preview" (click)="togglePlay(spotify_track)">
          <ion-icon [name]="spotify_track.icon_name"></ion-icon>
        </button>
        <a class="list-item" href="http://open.spotify.com/{{spotify_track.type}}/{{spotify_track.id}}">
          {{spotify_track.track_number}}. {{spotify_track.name}}
        </a>
        <a class="list-icon" href="http://open.spotify.com/{{spotify_track.type}}/{{spotify_track.id}}">
          <ion-icon icon-right name="add"></ion-icon>
        </a>
      </ion-item>
    </ion-list>
    <button class="Scan-button" ion-button block color="royal">
      <a href="http://open.spotify.com/{{spotify_lists.type}}/{{spotify_lists.id}}">Open {{spotify_lists.type}} in Spotify?</a>
    </button>
  </ion-content>
  `,
})

export class ScanResultsPage {

  public scannedText: string;
  spotify_lists = [];
  spotify_tracks = [];
  icon_names: any;
  audio = new Audio();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.spotify_lists = navParams.data.spotify_lists;
    console.log(this.spotify_lists);

    //pause audio if it is playing
    if (this.audio.src) {
      this.audio.pause();
    }

    this.spotify_tracks = this.spotify_lists["tracks"].items;

    //add icon and playing status to each track object
    this.spotify_tracks.forEach(track => {
      track["icon_name"] = "play";
      track["songPlay"] = false;
    });
    console.log(this.spotify_tracks);
  }

  ionViewDidLoad() {
    this.scannedText = this.navParams.get("scannedText");
  }
  togglePlay(iconName) {
    console.log("togglePlay::"+iconName.songPlay+" : "+iconName.name);
    if (!iconName.songPlay) {
      //change all tracks back to initial state
      this.spotify_tracks.forEach(track => {
        track.icon_name = "play";
        track.songPlay = false;
      });

      //load and start playing this track
      this.audio.src = iconName.preview_url;
      this.audio.play();
      iconName.icon_name = "pause";
      iconName.songPlay = true;
    } else {
      //pause this track
      if (this.audio.src) {
        this.audio.pause();
        iconName.icon_name = "play";
        iconName.songPlay = false;
      }
    }
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
  audio = new Audio();

  // constructor() {
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public callSpotify: CallSpotify) {
    // this.callToSpotify({"url":"https://api.spotify.com/v1/albums/4wuYQ9hyF1EGmrtjMpgpE9", "qr_tracker":"QR_88jhkhoqwe"});

    //pause audio if it is playing
    if (this.audio.src) {
      this.audio.pause();
    }
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
        console.log(data);
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
        console.log(data);
        this.navCtrl.push(ScanResultsPage, { spotify_lists: data });
      });
    }

    // private checkPass(data) {
    // }

}
