import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { TabsPage } from '../tabs/tabs';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-shop-checkout',
  templateUrl: 'shop-checkout.html',
})
export class ShopCheckoutPage {
  WooCommerce: any;
  order_placed: boolean = false;
  account: any;
  order: any = {};
  payment_methods: any;
  paymentMethod: any;
  constructor(
    public loader: LoadingController,
    public alertCtrl: AlertController,
    private WP: WoocommerceProvider,
    private database: DatabaseProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.account = this.navParams.get('account');
      console.log(this.account);
      this.WooCommerce = WP.order();
      console.log(this.WooCommerce);
  }

  ionViewDidLoad() {
  }

  place_order(){

    if (this.order.address_1 && this.order.address_1 !== ''){
      let data = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: true,
        billing: {
          first_name: this.account.firstname,
          last_name: this.account.lastname,
          address_1: this.order.address_1,
          address_2: '',
          city: this.order.city,
          state: this.order.state,
          postcode: '263',
          country: 'Zimbabwe',
          email: this.account.email,
          phone: this.account.description
        },
        shipping: {
          first_name: this.account.firstname,
          last_name: this.account.lastname,
          address_1: this.order.address_1,
          address_2: '',
          city: this.order.city,
          state: this.order.state,
          postcode: '263',
          country: 'Zimbabwe'
        },
        line_items: [],
        customer_id: this.account.id || ''
      };
      console.log(data);

      this.database.getData('cart').then(cart => {
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
              this.post_order(data);
            }
          });

        }
      })
    }else{
      //Enter Your Address
      console.log('Enter Address');
    }
  }
  post_order(data:any) {
    let loader = this.loader.create({
      content: 'Placing Order...',
      spinner: 'bubbles',
    });
    loader.present();
    loader.onDidDismiss(()=>{
      if (!this.order_placed){
        console.log('Something went wrong');
      }else{
        console.log('Done');
      }
    })
    this.WooCommerce.postAsync("orders", data).then((data) => {

      let response = (JSON.parse(data.body));
      console.log(response);
      if (response){
        this.order_placed = true;
        loader.dismiss();
        let order_number = response.number;
        this.alertCtrl.create({
          title: "Order Placed Successfully",
          message: "Your order has been placed successfully. Your order number is "+order_number+' Updates will be sent to your phone',
          buttons: [{
            text: "OK",
            handler: () => {
              this.database.removeData('cart').then(()=>{
                this.navCtrl.popAll();
              })
            }
          }]
        }).present();
      }

    }, err=>{
      console.log(err);
      loader.dismiss();
    })
  }

}
