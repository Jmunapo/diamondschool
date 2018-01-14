import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { RemoteProvider } from '../../providers/remote/remote';
import { DatabaseProvider } from '../../providers/database/database';
import { OneSignal } from '@ionic-native/onesignal';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  message_changed: boolean = false;
  ready: boolean = false;
  subdomain: string = ''; //school subdomain
  subscribed_groups: Array<any> = []; //from the sstorage
  all_groups: any; //from the server
  selected: string = ''; //School name
  test_checked: Array<any> = []; //nGmodel for the dom elements to be true or false

  constructor(
    public alertCtrl: AlertController,
    public onesignal: OneSignal,
    public database: DatabaseProvider,
    public remote: RemoteProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
    this.database.getData('selected_school').then(v=>{
      if(v){
        console.log(v);
        this.subdomain = v.subdomain;
        this.selected = v.name;
        this.load_subsribes()
      }
    })
  }

  ionViewDidLoad() {
    
  }

  load_subsribes(){
    console.log(this.subdomain);
    if (this.subdomain !== '') {
      this.database.getData(this.subdomain + '_groups').then(val => {
        console.log(val);
        if (val) {
          this.subscribed_groups = val;
        }
      })
      this.remote.get_school_groups(this.subdomain).subscribe(val => {
        console.log(val)
        if (val) {
          this.all_groups = val;
          this.populate_checked(val)
        }
      },
        err => {
          console.log(err)
        })
    }
  }

  dismiss_subscribe(){
    this.viewCtrl.dismiss(this.message_changed);
  }
  switched(segment, label, index){
    let msg;
    let element = this.test_checked[index];
    if (element) { msg = 'Unsubscribe form ' } else { msg = 'You want to get messages from '}
    let confirm = this.alertCtrl.create({
      message: msg + this.selected + ' ' + label,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.test_checked[index] = element;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.message_changed = true;
            if(element){
              this.unsubscribe(segment, index);
            }else{
              this.subscribe(segment, index)
            }
          }
        }
      ]
    });
    confirm.present();
  }



  
  subscribe(segment, index){
    console.log('Subscribe');
    this.onesignal.sendTag(segment, '1');
    let grp = this.all_groups[index];
    this.subscribed_groups.push(grp);
    this.database.setData(this.subdomain + '_groups', this.subscribed_groups).then(v => {
      if (v) {
        console.log('Saved');
      } else {
        console.log('Not Saved');
      }
    })
  }
  unsubscribe(segment, index){
    this.onesignal.deleteTag(segment);
    let grp = this.all_groups[index];
    let a = this.subscribed_groups.findIndex(f => f.segment === grp.segment);
    this.subscribed_groups.splice(a, 1);
    this.database.setData(this.subdomain + '_groups', this.subscribed_groups).then(v=>{
      if (v) {
        console.log('Saved');
      } else {
        console.log('Not Saved');
      }
    })
    console.log('UnSubscribe');
    
  }
  populate_checked(arr){
    for(let a of arr){
      let b = this.subscribed_groups.findIndex(f => f.segment === a.segment);
      if(b === -1){
        this.test_checked.push(false);
      }else{
        this.test_checked.push(true)
      }
    }
    this.ready = true;
  }


}
