import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ProfilePage } from '../pages/profile/profile';
import { ScanPage as ScanStartPage, ScanResultsPage } from '../pages/scan/scan';
import { LibraryPage as LibraryListPage, LibraryDetailsPage} from '../pages/library/library';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';
// import { CallSpotify } from '../providers/call-spotify';
// import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
// import { Oauth } from 'ng2-cordova-oauth/oauth';
// import { Spotify } from "ng2-cordova-oauth/core";
// import { GoSpotify } from '../providers/auth-spotify';
import { CallSpotify } from '../providers/call-spotify';
@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    ScanStartPage,
    ScanResultsPage,
    LibraryListPage,
    LibraryDetailsPage,
    HomePage,
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
    ScanStartPage,
    ScanResultsPage,
    LibraryListPage,
    LibraryDetailsPage,
    HomePage,
    TabsPage
  ],
  providers: [
    BarcodeScanner,
    // SplashScreen,
    // StatusBar,
    // GoSpotify,
    // Spotify,
    // Oauth,
    // OauthCordova,
    // CallSpotify,
    CallSpotify,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // {provide: Oauth, useClass: OauthCordova}
  ]
})
export class AppModule {}
