import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Profile } from '../profile/profile';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'updateprofile',
  templateUrl: 'updateprofile.html'
})
export class UpdateProfile {
  userdata :FirebaseListObservable<any>;
    
    update_fullname: any;
    update_icnum: any;

    update_shipping_address: any;
    update_shipping_postcode: any;
    update_shipping_city: any;
    update_shipping_state: any;
    
    update_home_address: any;
    update_home_postcode: any;
    update_home_city: any;
    update_home_state: any;

  constructor (
    public navCtrl: NavController,
    public af: AngularFire,
    public auth : AuthProvider
    ) {
        this.userdata = af.database.list('/users');

    var userdetails = this.auth.user;
    this.update_fullname = userdetails.fullname || "";
    this.update_icnum = userdetails.icnum || "";
    
    this.update_home_address = userdetails.home_address || "";
    this.update_home_postcode = userdetails.home_postcode || "";
    this.update_home_city = userdetails.home_city || "";
    this.update_home_state = userdetails.home_state || "";
  }
  updatelocumprofile(){
    var userKey = this.auth.user;
    this.userdata.update(userKey.$key,{
      fullname: this.update_fullname,
      icnum: this.update_icnum,
      
      home_address: this.update_home_address,
      home_postcode: this.update_home_postcode,
      home_city: this.update_home_city,
      home_state: this.update_home_state,
    });

    this.navCtrl.pop( this );
    this.navCtrl.setRoot( Profile );  
  }
}