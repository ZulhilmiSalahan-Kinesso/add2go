import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: FirebaseListObservable<any>;

  constructor( public navCtrl: NavController,
                public af: AngularFire,
                public params: NavParams,
                public viewCtrl: ViewController) {
                  let key = this.params.get('charNum');

    this.item = af.database.list('/listing/', {query : {
      orderByKey : key,
      equalTo : key
    }});
  }

  dismiss() {
    let data = {'foo' : 'bar'};
    this.viewCtrl.dismiss();
  }

}
