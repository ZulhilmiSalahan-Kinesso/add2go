import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-update-listing',
  templateUrl: 'update-listing.html'
})
export class UpdateListing {
  listing :FirebaseListObservable<any>;
    
    update_title: any;
    update_desc: any;
    update_price: any;
    
  constructor (
    public navCtrl: NavController,
    public af: AngularFire,
    public params: NavParams,
    public auth : AuthProvider
    ) {

    this.listing = af.database.list('/listing');
    var userdetails = this.auth.user;
    this.update_title = this.params.get('title') || "";
    this.update_desc = this.params.get('desc') || "";
    this.update_price = this.params.get('price') || "";
  }
  updatelisting(){

    this.listing.update(this.params.get('charNum'),{
      title: this.update_title,
      desc: this.update_desc,
      price: this.update_price
    });

    this.navCtrl.pop( this );
    //this.navCtrl.setRoot( TabsPage );  
  }
}