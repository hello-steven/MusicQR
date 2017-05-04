import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, StatusBar: StatusBar, Splashscreen: SplashScreen, BarcodeScanner: BarcodeScanner, Http: Http ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
