import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { User } from '@ionic/cloud-angular';
import { AuthProvider } from '../../providers/auth';
import { HomePage } from '../home/home';
import { UpdateProfile } from '../profile/updateprofile';
import { Camera } from 'ionic-native';
import { Vibration } from 'ionic-native';
//import { Contacts, Contact, ContactField, ContactName } from 'ionic-native';
import { Geolocation } from 'ionic-native';
import { BackgroundMode } from 'ionic-native';
import { BarcodeScanner } from 'ionic-native';
import { ActionSheet } from 'ionic-native';
import { Badge } from 'ionic-native';

import { ForgotPasswordPage } from '../auth/forgot-password/forgot-password';

@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})
export class Profile {
  userdetail :FirebaseListObservable<any>;

  profile_image:any;
  profile_username:any;
  profile_email:any;
  
  profile_fullname:any;
  profile_icnum:any;


  profile_shipping_address:any;
  profile_shipping_postcode:any;
  profile_shipping_city:any;
  profile_shipping_state:any;

  profile_home_address:any;
  profile_home_postcode:any;
  profile_home_city:any;
  profile_home_state:any;

  profile_pict:any;

  constructor(
    public navCtrl: NavController,
    af:AngularFire,
     public auth: AuthProvider,
     public user: User
     ) {
      var userdata = this.auth.user;
      //console.log(userdata);
      //console.log(userdata.$key)
      
      this.profile_image = userdata.image || "";

      this.profile_username = userdata.name
      this.profile_email = userdata.email;

      this.profile_fullname = userdata.fullname || "";
      this.profile_icnum = userdata.icnum || "";
      
      this.profile_home_address = userdata.home_address || "";
      this.profile_home_postcode = userdata.home_postcode || "";
      this.profile_home_city = userdata.home_city || "";
      this.profile_home_state = userdata.home_state || "";
 
      this.profile_pict = userdata.profile_pict || "";
      //console.log("kjjfoiu"+ this.user.details.email);
      //console.log(this.userdetail.email);
  }
  
  gotoresetpassword(){
    this.navCtrl.push( ForgotPasswordPage );
  }

  gotoupdateprofile(){
    this.navCtrl.push( UpdateProfile );
  }

  logout(){
    this.auth.logout();
    //this.db.disconnect();
    this.navCtrl.setRoot( HomePage );
  }

  takepicture()
  {
    Camera.getPicture().then((imageData) => {
      this.profile_image = imageData;
    });
  }

  vibrateapp(){
    console.log("vibrate");
    Vibration.vibrate([2000,1000,2000]);
  }
  
  getgpslocation()
  {
    Geolocation.getCurrentPosition().then((resp) => {
     alert(resp.coords.latitude + " " + resp.coords.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  testing(){
    //BackgroundMode.enable();
    var userdata = this.auth.user;
    console.log(userdata);
    console.log(userdata.name)
    console.log(userdata.image)

  }

  scanbarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
    // Success! Barcode data is here
   }, (err) => {
        // An error occurred
    });
  }
  
  showactionsheet(){
    let buttonLabels = ['Share via Facebook', 'Share via Twitter'];
    ActionSheet.show({
      'title': 'What do you want with this image?',
      'buttonLabels': buttonLabels,
      'addCancelButtonWithLabel': 'Cancel',
      'addDestructiveButtonWithLabel' : 'Delete'
    }).then((buttonIndex: number) => {
      console.log('Button pressed: ' + buttonIndex);
    });
  }

  addBadge(){
    Badge.set(10);
  }

  increaseBadge()
  {
    Badge.increase(1);
  }

  clearBadge()
  {
    Badge.clear();
  }


}