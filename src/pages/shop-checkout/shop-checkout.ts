import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-shop-checkout',
  templateUrl: 'shop-checkout.html',
})
export class ShopCheckoutPage {
  account: any;
  order: any = {};
  payment_methods: any;
  paymentMethod: any;
  constructor(
    private datadbase: DatabaseProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.account = this.navParams.get('account');
      console.log(this.account);
  }

  ionViewDidLoad() {
    this.payment_methods = [
      { method_id: "bacs", method_title: "Direct Bank Transfer" },
      { method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" },
      { method_id: "paypal", method_title: "PayPal" }];
    console.log('ionViewDidLoad ShopCheckoutPage');
  }

  place_order(){

    if (this.order.address_1 && this.order.address_1 !== ''){

      let data = {
        payment_details: {
          method_id: 'cod',
          method_title: 'Cash on Delivery',
          paid: true
        },

        billing_address: this.order.address_1,
        shipping_address: this.order.address_1,
        customer_id: this.account.id || '',
        line_items: []
      };

      this.datadbase.getData('cart').then(cart => {
        if (cart) {
          let c = 0;
          let len = cart.length;
          cart.forEach((element, index) => {
            data.line_items.push({
              product_id: element.product.id,
              quantity: element.quantity
            });
            c++;
            if (c === len) {
              console.log(data)
            }
          });

        }
      })
    }else{
      //Enter Your Address
      
    }
  }

}
