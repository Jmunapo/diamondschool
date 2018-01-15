import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ShopCartPage } from '../shop-cart/shop-cart';

@Component({
  selector: 'page-shop-product-detail',
  templateUrl: 'shop-product-detail.html',
})
export class ShopProductDetailPage {
  product: any;

  @ViewChild(Slides) slides: Slides;
  constructor(
    public modal: ModalController,
    public toaster: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private database: DatabaseProvider) {
    this.product = this.navParams.get("product");
  }

  ionViewDidLoad() {
    console.log(this.product);
  }

  save_cart(cart){
    console.log(cart);
    this.database.setData('cart', cart).then(v=>{
      if(v){
        this.toaster.create({
          message: "Cart Updated",
          duration: 3000
        }).present();
      }
    })
  }

  add_to_cart(product){
    this.database.getData('cart').then(val=>{
      if(val){
        let i = val.findIndex(f => f.product.id === product.id);
        if(i !== -1){
          val[i].quantity += 1;
          val[i].amount += parseFloat(product.price);
          this.save_cart(val);
        }else{
          val.push(formart_cart());
          this.save_cart(val);
        }
      }else{
        let data = [];
        data.push(formart_cart());
        this.save_cart(data);
      }

      function formart_cart(){
        let data = {
          product: product,
          quantity: 1,
          amount: parseFloat(product.price) 
        }
        console.log(data);
        return data;
      }

    });

  }

  view_cart(){
    const subscribe = this.modal.create(ShopCartPage);
    subscribe.present();
    subscribe.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    })
  }
}
