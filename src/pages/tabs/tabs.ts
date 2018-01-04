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
  user_info: any;
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
    this.get_media();
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
  get_media() {
    let image = this.remote.get_thumb_image();
  }
  
}
