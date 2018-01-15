import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShopCategoryPage } from '../shop-category/shop-category';
import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html'
})
export class ShopPage {
  WooCommerce: any;
  constructor(
    public navCtrl: NavController, 
    private wp: WoocommerceProvider,
    public loader: LoadingController,
    public toaster: ToastController) {
  }

  open(item){
    let category = item.toLowerCase();
    this.WooCommerce = this.wp.init();
    let loader = this.loader.create({
      content: `Loading ${category}...`,
      duration: 11000,
      spinner: 'bubbles',
    });
    loader.present();
    this.WooCommerce.getAsync("products?filter[category]=" + category).then((data) => {
      console.log(JSON.parse(data.body));
      let products = JSON.parse(data.body).products;
      if(products.length > 0){
        loader.dismiss();
        this.navCtrl.push(ShopCategoryPage, {
          item: item,
          products: products
        })
      }else{
        let toast = this.toaster.create({
          message: 'Sorry! No ' + category + ' found',
          position: 'middle',
          duration: 5000
        });
        loader.dismiss();
        toast.present();
      }
    }, (err) => {
      console.log(err)
      let toast = this.toaster.create({
        message: 'Error loading' + category,
        position: 'middle',
        duration: 5000
      });
      loader.dismiss();
      toast.present();
    })


    
  }
  
}
