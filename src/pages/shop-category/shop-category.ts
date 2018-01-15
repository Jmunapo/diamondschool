import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ShopProductDetailPage } from '../shop-product-detail/shop-product-detail';

@Component({
  selector: 'page-shop-category',
  templateUrl: 'shop-category.html',
})
export class ShopCategoryPage {
  WooCommerce: any;
  ready: boolean = true;
  products: any[];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";
  title: string = 'Shop'
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.products = this.navParams.get('products');
    console.log(this.products)
  }

  ionViewWillLoad() {
    let item = this.navParams.get('item');
    this.title = item;
    
  }

  product_detail(product){
    console.log(product);
    this.navCtrl.push(ShopProductDetailPage,{
      product: product
    })
  }

}
