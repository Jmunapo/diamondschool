import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MailPage } from '../mail/mail';
import { HomePage } from '../home/home';
import { ShopPage } from '../shop/shop';
import { RemoteProvider } from '../../providers/remote/remote';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DatabaseProvider } from '../../providers/database/database';
import { SwitchSchoolPage } from '../switch-school/switch-school';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Events } from 'ionic-angular/util/events';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  read_msgs: Array<number> = []; //To know if the msge is already read
  user_info: any;
  msg_counter: number = 0;
  subdomain: string = ''; //school subdomain
  selected: string = ''; //School name
  messages: Array<any> = []; //messages from the server
  tab1Root: any = MailPage;
  tab2Root: any = HomePage;
  tab3Root: any = ShopPage;
  constructor(
    public event: Events,
    public navParams: NavParams,
    public database: DatabaseProvider,
    public alertCtrl: AlertController,
    public remote: RemoteProvider, 
    public navCtrl: NavController) {

    let data = navParams.get('user')
    let sw_user = navParams.get('sw_user')
    if (data || sw_user){
      let user_info;
      if (data) { user_info = (JSON.parse(data)).user }
      if (sw_user) { user_info = sw_user}
      this.user_info = user_info;
      this.select_school(user_info);
    }else{
      this.user_info = { user: { username: 'User' } };
    }
  }

  ionViewDidLoad() {
    //this.activeTab = this.navParams.get("tab") ? this.navParams.get("tab") : 1;
    this.database.getData('selected_school').then(v => {
      if (v) {
        console.log(v);
        this.subdomain = v.subdomain;
        this.selected = v.name;
        this.load_messages();
      }
    })
  }

  //Loading masseges in background
  load_messages(){
    if (this.subdomain !== '') {
      this.database.getData(this.subdomain + '_groups').then(val => {
        let count = 0;
        if (val) {
          val.forEach(elem => {
            this.remote.get_custom_post(this.subdomain, elem.posttype).subscribe(msg => {
              if (msg) {
                let res = JSON.parse(JSON.stringify(msg))
                console.log(res)
                if (res.length !== 0) {
                  let to_save = { name: elem.label+' Inbox', group: elem.posttype, messages: res }
                  this.messages.push(to_save);
                }
              }
              count++;
              if (count === val.length) {
                //check read and save
                this.save_messages_to_db();
                console.log(this.messages);
              }
            });
          });
        }
        
      })
    }
    
  }

  save_messages_to_db(){
    this.database.setData(this.subdomain + '_messages', this.messages).then(sav => {
      if (sav) {
        console.log(this.messages);
        console.log('Massege Saved')
      }
    })
  }

  select_school(user){
    this.database.getData('selected_school').then(school => {
      if (school) {
        this.event.publish('selected_school', school);
      } else {
        let confirm = this.alertCtrl.create({
          title: 'Welcome ' + user.username,
          subTitle: 'Thank you for using this App',
          message: 'You should select a school to begin',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Select',
              handler: () => {
                let data = {
                  email: user.email,
                  display_name: user.displayname,
                  first_name: user.firstname,
                  last_name: user.lastname,
                  username: user.username,
                  description: user.description,
                  insecure: 'cool'
                }
                if (data.email !== undefined) {
                  this.navCtrl.setRoot(SwitchSchoolPage, {
                    user: data
                  });
                }
              }
            }
          ]
        });
        confirm.present();
      }
    });
  }
  
}
