import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RemoteProvider } from '../../providers/remote/remote';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ModalPage } from '../modal/modal';
import { DatabaseProvider } from '../../providers/database/database';
import { ViewPage } from '../view/view';
import { Events } from 'ionic-angular/util/events';

@Component({
  selector: 'page-mail',
  templateUrl: 'mail.html'
})
export class MailPage {
  not_found: boolean;
  subdomain: string = "";
  subscribed_list: Array<any> = []; 
  selected: string = ''; //school name
  my_messages: Array<any> = [];

  constructor(
    public event: Events,
    public database: DatabaseProvider,
    public modal: ModalController,
    public remote: RemoteProvider, 
    public navCtrl: NavController) {
  }
  ngOnInit() {
    this.database.getData('selected_school').then(v => {
      if (v) {
        console.log(v);
        this.subdomain = v.subdomain;
        this.selected = v.name;
        this.load_messages();
      }
    })
  }
  subscribe(){
    console.log('hey')
  }

  load_messages(){
    this.database.getData(this.subdomain + '_groups').then(val => {
      console.log(val);
      if (!val) {
        this.add_messages();
      }else{
        if(val.length === 0){
          this.add_messages();
        }
      }
    });
    this.not_found = true;
    this.database.getData(this.subdomain + '_messages').then(msg=>{
      if(msg){
        this.my_messages = msg.reverse();
        this.not_found = false;
        console.log(this.my_messages)
        if(msg.length === 0){
          this.not_found = true;
        }
      }
    })
  }

  add_messages(){
    const subscribe = this.modal.create(ModalPage);
    subscribe.present();
    subscribe.onDidDismiss(data => {
      if (data) {
        this.load_messages();
        //this.event.publish('message_changed');
        console.log(data);
      }
    })
  }
  open_inbox(arr, name) {
    this.navCtrl.push(ViewPage, {
      massages: arr.messages,
      type: 'masseges',
      title: name,
      subdomain: this.subdomain
    });
  }
}
