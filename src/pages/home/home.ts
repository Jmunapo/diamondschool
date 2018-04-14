import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RemoteProvider } from '../../providers/remote/remote';
import { ViewPage } from '../view/view';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { DatabaseProvider } from '../../providers/database/database';
import { Events } from 'ionic-angular/util/events';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ready: boolean = false;
  count: number = 0;
  show: string = 'news';
  items: any;
  events: any;
  gallery: any;
  news_read_later: Array<any> = [];
  events_read_later: Array<any> = [];

  constructor(
    public event: Events,
    public database: DatabaseProvider, 
    public toaster:ToastController,  
    public navCtrl: NavController, 
    private remote: RemoteProvider) {
    this.database.getData('NewsReadlater').then(v=>{
      if(v){
        this.news_read_later = v;
      }
    })
    this.database.getData('EventReadlater').then(v => {
      if (v) {
        this.events_read_later = v;
      }
    })
    event.subscribe('reload_posts', subdomain=>{
      this.count++;
      if(this.count === 1){
        this.reload_posts(subdomain);
      }
    })

  }

  reload_posts(subdomain){
    this.remote.get_data(subdomain, 'posts')
      .subscribe(data => {
        this.items = data;
        this.ready = true;
      });
    this.remote.get_data(subdomain, 'events')
      .subscribe(data => {
        this.events = data;
        console.log(data);
      });
    this.remote.get_data(subdomain, 'gallery')
      .subscribe(data => {
        this.gallery = data;
        console.log(data);
      });
    
  }

  

  view_more(arr){
    this.navCtrl.push(ViewPage, {
      arr: arr,
      type: 'more'
    });
  }

  view_saved(check){
    if(check){
      this.navCtrl.push(ViewPage, {
        type: 'events',
        data: this.events_read_later
      });
    }else{
      this.navCtrl.push(ViewPage, {
        type: 'news',
        data: this.news_read_later
      });
    }

  }
  save_for_later(arr,name){
    let b;
    if(name === 'News'){
      b = this.news_read_later.findIndex(f => f.id === arr.id);
      if (b !== -1) {
        let msg = 'News already added';
        this.show_toaster(msg);
      } else if (b === -1) {
        let msg = name + ' Saved';
        this.news_read_later.push(arr);
        this.database.setData(name + 'Readlater', this.news_read_later);
        this.show_toaster(msg);
      }
    }
    if (name === 'Event') {
      b = this.events_read_later.findIndex(f => f.id === arr.id);
      if (b !== -1) {
        let msg = 'Event already added';
        this.show_toaster(msg);
      } else if (b === -1) {
        let msg = name + ' Saved';
        this.events_read_later.push(arr);
        this.database.setData(name + 'Readlater', this.events_read_later);
        this.show_toaster(msg);
      }

    }
  }
  show_toaster(msg, pos = 'bottom') {
    let toast = this.toaster.create({
      message: msg,
      position: pos,
      duration: 4000
    });
    toast.present();
  }

  view_image(image){
    console.log(image);
    this.navCtrl.push(ViewPage, {
      image: image,
      type: 'image'
    });
  }
}
