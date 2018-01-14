import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RemoteProvider } from '../../providers/remote/remote';
import { DatabaseProvider } from '../../providers/database/database';
import { TabsPage } from '../../pages/tabs/tabs'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { RegisterPage } from '../register/register';
import { Events } from 'ionic-angular/util/events';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login = { username: '', password: '' };

  constructor(
    public event: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toaster: ToastController,
    public loader: LoadingController, 
    public remote: RemoteProvider, 
    public database: DatabaseProvider) {
  }

  ionViewWillLoad() {
    if(this.navParams.get('username')){
      this.login.username = this.navParams.get('username');
    }
    if (this.navParams.get('pwd')) {
      this.login.password = this.navParams.get('pwd');
    }
    let loader = this.loader.create({
      content: 'Wait',
      duration: 2000,
      spinner: 'bubbles',
    });
    loader.present();
    this.database.getData('account_info').then(val=>{
      if(val){
        loader.dismiss();
        this.navCtrl.setRoot(TabsPage, {
          user: val
        });
      }else{
        loader.dismiss();
      }
    })
  }
  
  do_login() {
    let loader = this.loader.create({
      content: 'Wait',
      spinner: 'bubbles',
    });
    loader.present();
    let user_info = this.login;
    user_info['insecure'] = 'cool';
    user_info['seconds'] = '2592000';
    this.remote.do_login(user_info).subscribe(data => {
      let result = JSON.parse(data);
      if (result.status === 'ok') {
        this.database.setData('account_info', data).then(c => {
          if (c) {
            loader.dismiss();
            this.event.publish('user_loggedin', data);
            this.navCtrl.setRoot(TabsPage,{
              user: data
            });
          }
        });
     }else {
        let error = JSON.stringify(result);
        loader.dismiss();
        let toast = this.toaster.create({
          message: error,
          position: 'middle',
          duration: 5000
        });
        toast.present();
      }

    },
      err => {
        let error = JSON.stringify(err);
        loader.dismiss();
        let toast = this.toaster.create({
          message: error,
          position: 'middle',
          duration: 5000
        });
        toast.present();
      })
  }
  create_account() {
    this.navCtrl.setRoot(RegisterPage)
  }

}
