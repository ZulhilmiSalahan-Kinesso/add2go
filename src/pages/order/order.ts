import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { Settings } from '../../providers/settings';
import { SellDetailPage } from '../sell-detail/sell-detail';
import { TranslateService } from '@ngx-translate/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthProvider } from '../../providers/auth';

import { AlertController } from 'ionic-angular';
/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {
  // Our local settings object
  options: any;

  itemSell : FirebaseListObservable<any>;
  itemBuy : FirebaseListObservable<any>;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;
  userkey : any;
  subSettings: any = OrderPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public af: AngularFire,
    public auth: AuthProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

      this.userkey = this.auth.user.$key;
      this.itemSell = af.database.list('/listing', { query : {
        orderByChild : 'creatorkey',
        equalTo : this.userkey
      }
    });
    
    this.itemBuy = af.database.list('/orders', { query : {
      orderByChild : 'buyerkey',
      equalTo : this.userkey
    }});
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  openModal(characterNum) {
    let modal = this.modalCtrl.create(SellDetailPage, characterNum);
    modal.present();
  }

  deleteSellItem(item) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.itemSell.remove(item);
          }
        }
      ]
    });
    alert.present();
  }

  deleteBuyItem(item, itemKey) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.itemBuy.remove(item);
            //let updateCount = this.af.database.list('/listing/'+itemKey);
            //updateCount.update( itemKey, { buycount: 0 });
          }
        }
      ]
    });
    alert.present();
  }
}
