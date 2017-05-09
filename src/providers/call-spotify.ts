import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Generated class for the CallSpotify provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CallSpotify {
  data: any;
  url: any;
  firebase: any;
  user_data: any;
  update_data: any;
  qr_count: any;
  qr_tracker: any;
  qr_check: any;
  tmp_user_name: any;
  tmp_tracker: any;
  tmp_timestamp: any;

  db_item: FirebaseListObservable<any[]>;
  constructor(public http: Http, public db: AngularFireDatabase) {
    // alert('Hello CallSpotify Provider');db.list('/items', { preserveSnapshot: true });
    // this.db_item = db.list('/0', { preserveSnapshot: true });
    // this.db_item
    //   .subscribe(snapshots => {
    //     console.log("snapshots: ");
    //     console.log(snapshots);
    //     snapshots.forEach(snapshot => {
    //       if (snapshot._isScalar == undefined) {
    //         console.log("snapshot._isScalar: "+snapshot._isScalar);
    //       }
    //       console.log("db_item.key: "+snapshot.key);
    //       console.log("db_item.val: ");
    //       console.log(snapshot.val());
    //     });
    //   });
    // console.log(this.db_item = db.list('/0'));
  }

  load(url, qr_tracker) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // alert('Getting the data...');

    // don't have the data yet
    return new Promise(resolve => {
      console.log(url);
      console.log(qr_tracker);
      // alert("url: "+url+", qr_tracker: "+qr_tracker);
      this.tmp_tracker = qr_tracker;
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(url).map(res => res.json()).subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // alert('Got the data...');
          this.data = data;

          //send data to firebase and do updates
          this.update_firebase_data();
          //return results to scan-details page
          resolve(this.data);
        });
    });
  }

  update_firebase_data() {

    // alert('Got the data...');

    this.tmp_timestamp = new Date().toISOString();
    console.log('load>> this.data: ');
    console.log(this.data);
    console.log("this.tmp_timestamp: "+this.tmp_timestamp);

    //fetch current data from firebase
    var fb_data = this.http.get('https://mellidy-app.firebaseio.com/0/.json').map(res => res.json())
      .subscribe(snapshots => {
        console.log(snapshots);
        if (snapshots != null) {
          var fb_user: any,
              fb_tracker: any,
              fb_qr_count: any;

          //check for user_name
          if (snapshots.hasOwnProperty("user_name") && Object.keys(snapshots.user_name)[0] != null) {
            console.log(Object.keys(snapshots.user_name)[0]);
            fb_user = Object.keys(snapshots.user_name)[0]
          } else {
            fb_user = null;
          }

          //check for qr tracker
          if (snapshots.user_name.admin.spotify_data.qr_tracker.hasOwnProperty(this.tmp_tracker) && Object.keys(snapshots.user_name.admin.spotify_data.qr_tracker)[0] != null) {
            console.log(Object.keys(snapshots.user_name.admin.spotify_data.qr_tracker)[0]);
            fb_tracker = Object.keys(snapshots.user_name.admin.spotify_data.qr_tracker)[0];
          } else {
            fb_tracker = null;
          }

          //if qr tracker is there check for current count
          if (fb_tracker != null) {
            console.log(fb_tracker);
            if (snapshots.user_name.admin.spotify_data.qr_tracker[fb_tracker].hasOwnProperty("qr_count") && snapshots.user_name.admin.spotify_data.qr_tracker[fb_tracker].qr_count != null){
              console.log(snapshots.user_name.admin.spotify_data.qr_tracker[fb_tracker].qr_count+1);
              fb_qr_count = snapshots.user_name.admin.spotify_data.qr_tracker[fb_tracker].qr_count+1;
            } else {
              fb_qr_count = null;
            }
          }
          console.log(">>>> this.check_fb_data("+fb_user+", "+fb_qr_count+", "+fb_tracker+")");
          this.check_fb_data(fb_user, fb_qr_count, fb_tracker);
        } else {
          this.check_fb_data(null, null, null);
        }
      });
  }

  check_fb_data(tmp_user_name, qr_count, qr_tracker) {
    //check if we have scanned this qr code before or if it's the first scan
    // this.db_item = (this.fetchData() != null) ? this.fetchData() : null ;
    console.log("confirm :: this.tmp_user_name: "+tmp_user_name+", this.qr_count:"+qr_count+", this.qr_tracker: "+qr_tracker);
    if (tmp_user_name != null && qr_tracker != null && qr_count != null) {
      console.log(">>> update qr count");
      console.log("this.tmp_user_name: "+tmp_user_name+", this.qr_tracker: "+qr_tracker+", this.qr_count: "+qr_count);
      //set qr_count to number of
      qr_count = (qr_count >= 1) ? qr_count++ : 1;

      //send count update to firebase
      this.fbUpdateCount(tmp_user_name, qr_tracker, qr_count);

    } else if (tmp_user_name != null) {
      console.log(">>> update spotify_data");

      this.tmp_timestamp = new Date().toISOString();

      //create new data json object
      this.update_data = {
        [this.tmp_tracker] : {
          "qr_count" : 1,
          "spotify_results" : this.data,
          "timestamp" : this.tmp_timestamp,
        }
      }

      //send spotify update to firebase
      this.fbUpdateData(tmp_user_name, this.update_data);
      console.log(this.update_data);

    } else {
      console.log(">>> create admin and add spotify data");
      this.qr_count = 1;
      this.tmp_timestamp = new Date().toISOString();
      //add scan results to user_data
      this.user_data = {
            "user_name" : {
              "admin" : {
                "creds" : "5p0t1fy",
                "spotify_data" : {
                  "qr_tracker" : {
                    [this.tmp_tracker] : {
                      "qr_count" : qr_count,
                      "spotify_results" : this.data,
                      "timestamp" : this.tmp_timestamp,
                    }
                  }
                }
              }
            }
          }

      //send new user and spotify results to firebase
      console.log(this.user_data);
      this.fbPostData(this.user_data);
    }
  }

  fbUpdateCount(user, qr_tracker, new_qr_count) {
    console.log(">>> fbUpdateCount("+user+", "+qr_tracker+", "+new_qr_count+")");
    this.db_item = this.db.list('/0/user_name/'+user+'/spotify_data/qr_tracker/'+qr_tracker);
    this.db_item.$ref.ref.update({'qr_count' : new_qr_count});
  }
  fbUpdateData(user, new_qr_data) {
    console.log(">>> fbUpdateData("+user+", "+new_qr_data+")");
    this.db_item = this.db.list('/0/user_name/'+user+'/spotify_data/qr_tracker');
    this.db_item.$ref.ref.update(new_qr_data);
  }
  fbPostData(spotify_obj){
    console.log(">>> fbPostData("+spotify_obj+")");
    console.log(spotify_obj);
    this.db_item = this.db.list('/0');
    this.db_item.$ref.ref.update(spotify_obj);
  }

  fetchData(){
    return this.http.get('https://nn-angular-b5f05.firebaseio.com/0/user_name/admin/spotify_data.json').map(
      (res) => res.json()
    )
  }

  // getSpotifyList(){
  //   return this.db.list('/0/user_name/admin/spotify_data/qr_tracker', { preserveSnapshot: true })
  //     .subscribe(snapshots => {
  //         snapshots.forEach(snapshot => {
  //           // console.log(snapshot);
  //           // console.log(snapshot.val());
  //           // console.log(snapshot.key);
  //           snapshot[snapshot.key].spotify_results;
  //         });
  //
  //     });
  // }




}
