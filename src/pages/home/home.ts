import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LoginEmailPage } from '../auth/login-email/login-email';
import { SignUpPage } from '../auth/sign-up/sign-up';
import { AuthProvider } from '../../providers/auth';
import { TabsPage } from '../tabs/tabs';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  rootPage: any = HomePage;
  error: any;
  userdata :FirebaseListObservable<any>;

  pages: Array<{title: string, component: any}>;

    constructor(
      public navCtrl: NavController,
      public user: User,
      private auth: AuthProvider,
      public af: AngularFire,
      public toastCtrl: ToastController
      //public googleAuth: GoogleAuth, public user: User
      //public facebookAuth: FacebookAuth, public user: User
    ) {
      this.userdata = af.database.list('/users');
  }

  loginGoogleService()
  {
    //this.googleAuth.login().then();
    console.log("login google");
      //const full_name = this.user.social.google.data.full_name;
      //const profile_picture = this.user.social.google.data.profile_picture;
      //const google_raw_data = this.user.social.google.data.raw_data;
  }


  openSignUpPage() {
    this.navCtrl.push(SignUpPage);
  }

  openLoginPage() {
    this.navCtrl.push(LoginEmailPage);
  }

  loginUserWithFacebook() {
    this.auth.loginWithFacebook().subscribe(data => {
    this.navCtrl.setRoot( TabsPage );
    var userKey = this.auth.user;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();

    var strtodaydate = yyyy+"-"+mm+"-"+dd + " "+hh + ":"+min+":"+sec;

      this.userdata.update(userKey.$key, {
        lastlogin : strtodaydate
      })
      this.presentToast( 'User was successfully login' );
    }, err => {
      this.error = err;
      this.presentToast(err);
    });
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
