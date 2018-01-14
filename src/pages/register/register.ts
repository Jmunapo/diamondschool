import { Component } from '@angular/core';
import { RemoteProvider } from '../../providers/remote/remote';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  valid = [false, false, false, false]
  register = { username: '', display_name: '', description: '', user_pass: '', email: '', first_name: '', last_name: '', insecure: 'cool', notify: 'both' };
  text: string;

  constructor(public toaster: ToastController,
    public loader: LoadingController, public database: DatabaseProvider, public remote: RemoteProvider, public navParams: NavParams, public navCtrl: NavController, public altrCtrl: AlertController) {

  }


  go_login() {
    this.navCtrl.setRoot(LoginPage)
  }

  validate_email() {
    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (regExp.test(this.register.email)) {
      return true
    }
    this.valid[2] = true;
    return false;
  }

  check_user_pass() {
    if (this.register.user_pass.length <= 5) {
      this.valid[3] = true;
      return false
    }
    return true;
  }
  check_description() {
    if (this.register.description.length <= 8) {
      this.valid[1] = true;
      return false
    }
    return true;
  }

  proccess_register() {
    let pwd = this.check_user_pass();
    let email = this.validate_email();
    let description = this.check_description();
    if (email && description && pwd) {
      this.get_first_n_lastname();
      let prompt = this.altrCtrl.create({
        title: 'Confirm Password',
        inputs: [{
          name: 'user_pass',
          placeholder: 'Re-enter password',
          type: 'password'
        },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              this.register.user_pass = '';
            }
          },
          {
            text: 'Confirm',
            handler: data => {
              if (data.user_pass === this.register.user_pass) {
                this.register_user();
              } else {
                this.valid[3] = true;
              }
            }
          }
        ]
      });
      prompt.present();
    }
  }

  register_user() {
    let loader = this.loader.create({
      content: 'Wait',
      duration: 11000,
      spinner: 'bubbles',
    });
    loader.present();
    this.remote.get_nonce()
      .subscribe(val => {
        let nonce = JSON.parse(val);
        if (nonce) {
          this.remote.register_user(this.register, nonce.nonce).subscribe(val => {
            if (val) {
              loader.dismiss();
              this.navCtrl.setRoot(LoginPage, { username: this.register.username, pwd: this.register.user_pass });
            }
          },
            err => {
              loader.dismiss();
              alert(JSON.stringify(err))
              let toast = this.toaster.create({
                message: err.error.error,
                position: 'middle',
                duration: 3000
              });
              toast.present();
            })

        }
      },
      err => {
        loader.dismiss();
        console.log(err)
        alert(JSON.stringify(err))
        let toast = this.toaster.create({
          message: err.error,
          position: 'middle',
          duration: 4000
        });
        toast.present();
      })
  }


  get_first_n_lastname() {
    let wordArray = [];
    wordArray = this.register.display_name.split(" ");
    this.register.first_name = wordArray[0];
    if (wordArray.length > 1) {
      let num = wordArray[0].length;
      this.register.last_name = this.register.display_name.slice(num + 1)
    }
  }

}
