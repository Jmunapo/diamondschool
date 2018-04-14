import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-view',
  templateUrl: 'view.html',
})
export class ViewPage {
  view_obj: any;
  news: boolean = false;
  events: boolean = false;
  more: boolean = false;
  msge: boolean = false;
  read: boolean = false;
  image: boolean = false;
  title: string = '';
  subdomain: string = '';


  constructor(
    public database: DatabaseProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
    
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

    if (type === 'masseges') {
      this.msge = true;
      this.subdomain = this.navParams.get('subdomain');
      let title = this.navParams.get('title');
      this.title = title;
      this.view_obj = this.navParams.get('massages');
    }

    if (type === 'read_msge') {
      this.read = true;
      this.title = '';
      this.view_obj = this.navParams.get('massage');
    }
    if (type === 'image') {
      this.image = true;
      this.title = '';
      this.view_obj = this.navParams.get('image');
    }

    console.log(this.view_obj);
  }

  view_more(arr) {
    this.navCtrl.push(ViewPage, {
      arr: arr,
      type: 'more'
    });
  }


  open_message(msge) {
    let id = msge.ID;
    let read_obj = {message_id: id}
    this.database.getData(this.subdomain + '_readIds').then(r => {
      console.log(r);
      if(r){
        let b = r.findIndex(f => f.message_id === id);
        console.log(b);
        if (b === -1) {
          r.push(read_obj);
          this.save_read(r);
        }
      }else{
        let m = [];
        m.push(read_obj);
        console.log(m);
        this.save_read(m);
      }
    });
    this.navCtrl.push(ViewPage, {
      massage: msge,
      type: 'read_msge'
    });
  }

  save_read(data){
    console.log(data);
    this.database.setData(this.subdomain + '_readIds', data).then(v=>{
      if(v){
        console.log(v, 'Read Saved');
      }
    })
  }

  check_read(id){
    this.database.getData(this.subdomain + '_readIds').then(r => {
      if (r) {
        let b = r.findIndex(f => f.message_id === id);
        console.log(b);
        return true;
      }
      return false;
    });
  }

}
