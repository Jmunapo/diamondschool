import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  title: string;
  obj: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = this.navParams.get('title');
    this.obj = this.navParams.get('obj');
    console.log(this.obj);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

}
