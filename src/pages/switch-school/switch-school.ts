import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RemoteProvider } from '../../providers/remote/remote';
import { DatabaseProvider } from '../../providers/database/database';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Events } from 'ionic-angular/util/events';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-switch-school',
  templateUrl: 'switch-school.html',
})
export class SwitchSchoolPage {
  show: string = 'list';
  instorage: boolean; //check if there is anything in storage 
  search: string = '';
  hideSearchbar: boolean = true;
  all_schools: Array<any> = [];
  saved_schools: Array<any> = [];
  media_url: Array<any> = [];
  user_data: any;
  constructor(
    public event: Events,
    public loader: LoadingController,
    public remote: RemoteProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public database: DatabaseProvider,
    public toaster: ToastController) {
    let user_data = this.navParams.get('user');
    if (user_data) {
      this.user_data = user_data;
    }
  }

  ionViewWillLoad() {
    this.load_all_schools();
    this.load_saved_schools();
    this.get_media();
  }

  toggleSearchbar() {
    this.hideSearchbar = !this.hideSearchbar;
  }

  search_schlools(){

  }

  //load all schools from the info server
  load_all_schools(){
    this.remote.get_schools()
      .subscribe(val => {
        if (val) {
          for (let xul of val) {
            let id = xul.id;
            let name = xul.name;
            this.remote.get_meta(id)
              .subscribe(v => {
                let b = this.media_url.findIndex(f => f.id === Number(v.thumbnail));
                let thumbnail = "assets/img/z0PNT4h8SCGyxTXhyf3Q_photo_2017-08-31_08-47-35.jpg";
                if(b > -1){ thumbnail = this.media_url[b].url;  }
                v['id'] = id;
                v['name'] = name;
                v['thumbnail'] = thumbnail;
                this.all_schools.push(v);
              },
              err => {
                alert(JSON.stringify(err));
              })
          }
        }
      },
      err => {
        alert(JSON.stringify(err));
      })
  }
  load_saved_schools(){
    this.database.getData('schools').then(val => {
      if (val) {
        this.instorage = true;
        this.saved_schools = val;
      }else{
        this.show = 'all';
      }
    })
  }

  add_my_school(arr){
    let b = this.saved_schools.findIndex(f => f.id === arr.id);
    if (this.saved_schools.length >= 3){
      let msg = 'You cannot add more than 3 Schools';
      this.show = 'list';
      this.show_toaster(msg,'middle');
    }else if(b !== -1){
      let msg = this.my_sanitizer(arr.id) + ' already added';
      this.show_toaster(msg);
    } else if (b === -1 && this.saved_schools.length < 3){
      this.user_subscribe(arr);
    }
    
  }

  remove_my_school(arr){
    let msg;
    this.database.getData('selected_school').then(val=>{
      if(val){
        if(arr.id === val.id){
          msg = 'You Cannot Remove selected School';
          this.show_toaster(msg, 'middle')
        }else{
          let b = this.saved_schools.findIndex(f => f.id === arr.id);
          this.saved_schools.splice(b, 1);
          msg = this.my_sanitizer(arr.id) + ' Removed';
          if (this.saved_schools.length === 0) {
            this.instorage = false;
            this.show = 'all';
            this.database.removeData('schools');
          } else {
            this.database.setData('schools', this.saved_schools);
          }
          this.show_toaster(msg)
        }
      }else{
        let b = this.saved_schools.findIndex(f => f.id === arr.id);
        this.saved_schools.splice(b, 1);
        msg = this.my_sanitizer(arr.id) + ' Removed';
        if (this.saved_schools.length === 0) {
          this.instorage = false;
          this.show = 'all';
          this.database.removeData('schools');
        } else {
          this.database.setData('schools', this.saved_schools);
        }
        this.show_toaster(msg)
      }
    }) 
    
  }

  show_toaster(msg, pos='bottom') {
    let toast = this.toaster.create({
      message: msg,
      position: pos,
      duration: 4000
    });
    toast.present();
}

  my_sanitizer(id){
    return document.getElementById(id).innerHTML;
  }

  get_media(){
    this.database.getData('thumbnails').then(v=>{
      if(v){
        this.media_url = v;
      }
    })
  }

  select_school(arr){
    let b = this.saved_schools.findIndex(f => f.id === arr.id);
    if(b !== -1){
      this.database.setData('selected_school', arr).then(val=>{
        if(val){
          let msg = this.my_sanitizer(arr.id) + ' Selected';
          this.show_toaster(msg)
          this.navCtrl.setRoot(TabsPage, {
            sw_user: this.user_data
          });
        }else{
          this.show_toaster('Not selected, Unexpected error please reload the APP');
        }
      })
      
    }else{
      const toast = this.toaster.create({
        message: 'Add to your List First',
        showCloseButton: true,
        position: 'middle',
        closeButtonText: 'Ok'
      });
      toast.present();
    }
    //Action on selected school
    console.log(arr);
  }


  user_subscribe(arr) {
    let loader = this.loader.create({
      content: 'Wait',
      duration: 11000,
      spinner: 'bubbles',
    });
    loader.present();
    let subdomain = arr.subdomain;
    this.remote.user_get_nonce(subdomain).subscribe(val => {
      if (val) {
        let nonce = (JSON.parse(val)).nonce;
        let data = this.user_data;
        data['nonce']= nonce;
        this.remote.user_subscribe(data,subdomain).subscribe(reg=>{
              if(reg){
                let msg = this.my_sanitizer(arr.id) + ' added to your List';
                this.instorage = true;
                this.saved_schools.push(arr);
                this.database.setData('schools', this.saved_schools).then(set=>{
                  if(set){
                    loader.dismiss();
                    this.show_toaster(msg);
                  }
                });
              }
            },
          err=>{
            if(err.error.error === 'Username already exists.'){
              //Add to favourites
              let msg = this.my_sanitizer(arr.id) + ' added to your List';
              this.instorage = true;
              this.saved_schools.push(arr);
              this.database.setData('schools', this.saved_schools).then(set => {
                if (set) {
                  loader.dismiss();
                  this.show_toaster(msg);
                }
              });
            }else{
              loader.dismiss();
              alert(JSON.stringify(err));
              this.show_toaster('Error adding to your list Try Later');
            }
          })

      }
    },
      err => {
        alert(JSON.stringify(err));
        let msg = 'Sorry you can\'t add at the moment, try Later!'
        loader.dismiss();
        this.show_toaster(msg);
      })
  }


}
