import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

// Providers
import { AuthProvider } from '../../../providers/auth';

@Component({
  templateUrl: 'forgot-password.html',
  selector: 'forgot-password',
})

export class ForgotPasswordPage {
  error: any;
  form: any;

  constructor(
    private loadingCtrl: LoadingController,
    private auth: AuthProvider,
    public toastCtrl: ToastController) {

    this.form = {
      email: ''
    }
  }

  reset() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.auth.sendPasswordResetEmail(this.form.email).subscribe(data => {
      //this.error = 'Soon you will receive an email to change your password.';
      this.presentToast('Soon you will receive an email to change your password.');
      loading.dismiss();
    }, error => {
      this.error = error;
      this.presentToast(error);
      loading.dismiss();
    })
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
