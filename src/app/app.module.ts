import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ProfilePage } from '../pages/profile/profile';
// import { ScanPage } from '../pages/scan/scan';
import { ScanPage as ScanStartPage, ScanResultsPage } from '../pages/scan/scan';
import { LibraryPage as LibraryListPage, LibraryDetailsPage} from '../pages/library/library';
import { HomePage } from '../pages/home/home';
// import { HomePage as HomeStartPage, HomeDetailsPage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GoSpotify } from '../providers/auth-spotify';
// import { CallSpotify } from '../providers/call-spotify';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { Oauth } from 'ng2-cordova-oauth/oauth';
import { Spotify } from "ng2-cordova-oauth/core";
@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    // ScanPage,
    ScanStartPage,
    ScanResultsPage,
    LibraryListPage,
    LibraryDetailsPage,
    HomePage,
    // HomeStartPage,
    // HomeDetailsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    // ScanPage,
    ScanStartPage,
    ScanResultsPage,
    LibraryListPage,
    LibraryDetailsPage,
    HomePage,
    // HomeStartPage,
    // HomeDetailsPage,
    TabsPage
  ],
  providers: [
    BarcodeScanner,
    SplashScreen,
    StatusBar,
    // CallSpotify,
    GoSpotify,
    OauthCordova,
    Oauth,
    // Spotify,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Oauth, useClass: OauthCordova},
  ]
})
export class AppModule {}
