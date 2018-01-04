import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';

import { TabsPage } from '../pages/tabs/tabs'
import { AccountPage } from '../pages/account/account'
import { LoginPage } from '../pages/login/login';
import { SwitchSchoolPage } from '../pages/switch-school/switch-school';
import { DatabaseProvider } from '../providers/database/database';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Events } from 'ionic-angular/util/events';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any = LoginPage;
  moto:string = '';
  selected_school: any = {
    city: '',
    level: '',
    name: 'Select School',
    location: '',
    thumbnail: 'assets/img/z0PNT4h8SCGyxTXhyf3Q_photo_2017-08-31_08-47-35.jpg'
  }
  user_info: any = { user: { username: 'User'}};

  constructor(
    public event: Events,
    public menu: MenuController,
    public database: DatabaseProvider,
    public alertCtrl: AlertController,
    public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    event.subscribe('user_loggedin',data=>{
      this.user_info = JSON.parse(data);
    });
    event.subscribe('selected_school', data => {
      this.selected_school = data;
      this.sidemenu_reload(data);
      this.reload_posts(data.subdomain);
    });
    database.getData('account_info').then(val=>{
      if(val){
        this.user_info = JSON.parse(val);
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

        window["plugins"].OneSignal
          .startInit("619eeaa7-630e-4c12-a650-5aa7421ebf22", "197583177674")
          //called when a notification is tapped on from the notification shade
          .handleNotificationOpened(function (jsonData) {
            alert("Notification opened:\n" + JSON.stringify(jsonData));
            console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            this.navCtrl.setRoot(AccountPage);
          })
          //Only called if the app is in focus at the time the notification was received.
          .handleNotificationReceived(function (jsonData) {
            alert("Notification received:\n" + JSON.stringify(jsonData));
            console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
          })
          //.setSubscription(true)
          .endInit();
      });
  }

  sidemenu_reload(school: any){
    this.moto = 'Like Sun, We Shine'
    this.selected_school = school;
  }

  reload_posts(subdomain){
    this.event.publish('reload_posts', subdomain);
  }


  switch_schools(){
    let user = this.user_info.user;
    let data = {
      email: user.email,
      display_name: user.displayname,
      first_name: user.firstname,
      last_name: user.lastname,
      username: user.username,
      description: user.description,
      insecure: 'cool'
    }
    if(data.email !== undefined){
      this.navCtrl.push(SwitchSchoolPage, {
        user: data
      });
    }else{
      alert('Reload App')
    }
  }

  logout(){
    this.menu.close()
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to Logout?',
      buttons: [
        {
          text: 'Exit Only',
          handler: () => {
            console.log('Keep Me');
            this.platform.exitApp();
          }
        },
        {
          text: 'Logout',
          handler: () => {
            this.database.removeData('account_info').then(d=>{
              this.user_info = { user: { username: 'User' } };
              this.navCtrl.setRoot(LoginPage);
            })
          }
        }
      ]
    });
    confirm.present();
  }
  
}
