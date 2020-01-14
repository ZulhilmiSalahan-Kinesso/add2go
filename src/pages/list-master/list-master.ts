import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, NavParams} from 'ionic-angular';

import { User } from '@ionic/cloud-angular';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth';

import { Items } from '../../providers/providers';

import { Item } from '../../models/item';

import {AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: FirebaseListObservable<any>;
  currentItems2: any;

  constructor(public navCtrl: NavController,
              public items: Items,
              public modalCtrl: ModalController, 
              public af: AngularFire,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public auth: AuthProvider,
              public user: User) {
    var userdata = this.auth.user;
    this.currentItems = af.database.list('/listing', {query: {
      orderByChild: 'price'
    }})
    //this.currentItems = this.items.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }
  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
        let creatorKey = this.auth.user.$key;
        let creatorName = this.auth.user.name;
        let creatorPic = this.auth.user.image;
        this.items.add(item);
        var today = String(new Date());
        this.currentItems.push({
          postedDate: today,
          pic: item.profilePic,
          title : item.title,
          description : item.description,
          price : parseInt(item.price),
          buycount : 0,
          creatorkey : creatorKey,
          creatorname : creatorName,
          creatorpic : creatorPic
        })
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.currentItems.remove(item);
  }


  test(){
    let userdata = this.auth.user;
    console.log(userdata.name);
  }

  openModal(characterNum) {
    //console.log(characterNum);
    let modal = this.modalCtrl.create(ItemDetailPage, characterNum);
    modal.present();
  }
  /**
   * Navigate to the detail page for this item.
   */
  openItem(itemKey) {
    this.navCtrl.push(ItemDetailPage, {
      item: itemKey
    });
  }
  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = this.af.database.list('/listing');
      return;
    }
    console.log("input : " + val);

    this.currentItems = this.af.database.list('/listing', { query : {
        orderByChild : 'title',
        equalTo : val
      }
    });
  }


  presentConfirm(itemKey, buycount, itemname, itemprice, itempic, itemdesc) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Buy',
      message: 'Do you want to buy this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buy',
          handler: () => {
            buycount = buycount + 1;
            var currentuser = this.auth.user.$key;
            this.currentItems.update( itemKey, { buycount: buycount });
            var buyerpic = this.auth.user.image;
            var buyername = this.auth.user.name;
            var buyeraddress = this.auth.user.home_address;

            var orderlist = this.af.database.list('/orders')
            orderlist.push({
              itempic: itempic,
              itemkey: itemKey,
              itemname: itemname,
              itemprice: itemprice,
              itemdesc: itemdesc,
              buyerpic: buyerpic,
              buyerkey: currentuser,
              buyername: buyername,
              buyeraddress: buyeraddress
            })
          }
        }
      ]
    });
    alert.present();
  }
}
