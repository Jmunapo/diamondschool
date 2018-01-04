import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})


export class AccountPage {
  show: string = 'login'
  constructor(public loader: LoadingController, public database: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams) {
      this.show = this.navParams.get('setview');
      if(!this.show){
        this.show = 'login';
      }
      console.log(navParams.get('setview'));
  }

  ionViewWillLoad() {
    let loader = this.loader.create({
      content: 'Wait',
      duration: 2000,
      spinner: 'bubbles',
    });
    /*loader.present();
    this.database.getData('user_cockies').then(val=>{
      if(val){
        loader.dismiss();
        this.navCtrl.setRoot(LoginPage);
      }
    })*/
  }
}
