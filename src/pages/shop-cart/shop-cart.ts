import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { DatabaseProvider } from '../../providers/database/database';
import { LoginPage } from '../login/login';
import { ShopCheckoutPage } from '../shop-checkout/shop-checkout';

@Component({
  selector: 'page-shop-cart',
  templateUrl: 'shop-cart.html',
})
export class ShopCartPage {
  cart_items: any[] = [];
  total: any;
  cart_empty: boolean = false;

  constructor(
    private database: DatabaseProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.total = 0.0;
    console.log('ionViewDidLoad ShopCartPage');
    this.database.getData('cart').then(val=>{
      if(val){
        console.log(val);
        this.cart_items = val;
        this.calculate_total(val);
      }else{
        this.cart_empty = true
      }
    })
  }
  calculate_total(cart){
    let total = 0;
    let c = 0;
    for(let item of cart){
      total += item.amount;
      c++;
      if(c === cart.length){
        this.total = Number(total)
      }
    }
  }

  change_quantity(i, change){
    if (this.cart_items[i].quantity === 1 && change === -1){
      return 0;
    }else{
      this.cart_items[i].quantity += change;
      this.cart_items[i].amount = this.cart_items[i].product.price * this.cart_items[i].quantity;
      this.update_cart(this.cart_items);
    }
  }

  remove_product(amount, index){
    this.cart_items.splice(index, 1);
    if(this.cart_items.length === 0){
      this.database.removeData('cart').then(d=>{
          this.cart_empty = true;
          this.total = '0.0';
      })
    } else {
      this.update_cart(amount)
    }
  }
  update_cart(amount){
    this.database.setData('cart', this.cart_items).then(v => {
      if (v) {
        this.total -= Number(amount);
        this.calculate_total(this.cart_items);
      }
    })
  }
   close_cart(){
    this.viewCtrl.dismiss('Closed');
  }
  checkout(){
    this.database.getData('account_info').then(acc=>{
      if(acc){
        let account = JSON.parse(acc);
        this.navCtrl.push(ShopCheckoutPage, {
          account: account.user
        });
      }else{
        this.navCtrl.setRoot(LoginPage)
      }
    })
  }

}
