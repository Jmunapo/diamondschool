import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';


@Injectable()
export class WoocommerceProvider {

  Woocommerce: any;

  constructor() {
    this.Woocommerce = WC({
      url: "http://info.diamond.school",
      consumerKey: "ck_9e2aafa86b9c92c08c23bc898920b39837b8690a",
      consumerSecret: "cs_c5b6050f1b9c91945946a2206c309ccd1bfe5933"
    });
  }

  init() {
    return this.Woocommerce;
  }

}
