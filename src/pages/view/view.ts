import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  view_obj: any;
  news: boolean = false;
  events: boolean = false;
  more: boolean = false;
  title: string = '';


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewWillLoad() {
    let type = this.navParams.get('type');
    if (type === 'more'){
       this.more = true; 
       this.title = 'View More';
      let arr = this.navParams.get('arr');
      this.view_obj = arr;
      }
    if (type === 'news') {
      this.news = true;
       this.title = 'Favorite News';
      let data = this.navParams.get('data');
      this.view_obj = data;
    }
    if (type === 'events') { 
      this.events = true; 
      this.title = 'Favorite Events';
      let data = this.navParams.get('data');
      this.view_obj = data;
    }
    console.log(this.view_obj);
  }

  view_more(arr) {
    console.log(arr)
    this.navCtrl.push(ViewPage, {
      arr: arr,
      type: 'more'
    });
  }

}
