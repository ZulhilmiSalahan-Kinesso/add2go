import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UpdateListing } from '../update-listing/update-listing';

@Component({
  selector: 'page-sell-detail',
  templateUrl: 'sell-detail.html'
})
export class SellDetailPage {
  item: FirebaseListObservable<any>;
  itemOrder : FirebaseListObservable<any>;
  constructor( public navCtrl: NavController,
                public af: AngularFire,
                public params: NavParams,
                public viewCtrl: ViewController,
                public modalCtrl: ModalController) {
                  //console.log(this.params.get('charNum'));
                  let key = this.params.get('charNum');

    this.item = af.database.list('/listing/', {query : {
      orderByKey : key,
      equalTo : key
    }});
    this.itemOrder = af.database.list('/orders', {query : {
      orderByChild : 'itemkey',
      equalTo : key
    }});
  }

  dismiss() {
    let data = {'foo' : 'bar'};
    this.viewCtrl.dismiss();
  }
  
  openModal(characterNum) {
    let modal = this.modalCtrl.create(UpdateListing, characterNum);
    modal.present();
  }

}
