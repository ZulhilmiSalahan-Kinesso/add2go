import { NavController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { LoginEmailPage } from '../login-email/login-email';
import { AuthProvider } from '../../../providers/auth';
import { ToastController } from 'ionic-angular';


import { HomePage } from '../../home/home';

@Component({
  templateUrl: 'sign-up.html',
  selector: 'sign-up',
})

export class SignUpPage {
  error: any;
  form: any;

  constructor(
    private navCtrl: NavController,
    private auth: AuthProvider,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.form = {
      email: '',
      password: ''
    }
  }

  openLoginPage(): void {
    this.navCtrl.push(LoginEmailPage);
  }

  register() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.auth.registerUser(this.form).subscribe(registerData => {
      this.auth.loginWithEmail(registerData).subscribe(loginData => {
        setTimeout(() => {
          loading.dismiss();
          this.navCtrl.setRoot(HomePage);
          this.presentToast('Successfully register user');
        }, 1000);
      }, loginError => {
        setTimeout(() => {
          loading.dismiss();
          this.presentToast(loginError);
        }, 1000);
      });
    }, registerError => {
      setTimeout(() => {
        loading.dismiss();
        this.presentToast(registerError);
      }, 1000);
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
