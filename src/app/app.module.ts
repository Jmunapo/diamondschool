import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MailPage } from '../pages/mail/mail';
import { HomePage } from '../pages/home/home';
import { ShopPage } from '../pages/shop/shop';
import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { Info } from './app.info';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RemoteProvider } from '../providers/remote/remote';
import { DatabaseProvider } from '../providers/database/database';
import { HttpClientModule } from '@angular/common/http';
import { Http } from '@angular/http';

import { ModalPage } from '../pages/modal/modal';
import { PipesModule } from '../pipes/pipes.module';

import {
  WpApiModule,
  WpApiLoader,
  WpApiStaticLoader
} from 'wp-api-angular'
import { IonicStorageModule } from '@ionic/storage';
import { SwitchSchoolPage } from '../pages/switch-school/switch-school';
import { OneSignal } from '@ionic-native/onesignal';
import { ViewPage } from '../pages/view/view';
import { ShopCategoryPage } from '../pages/shop-category/shop-category';
import { WoocommerceProvider } from '../providers/woocommerce/woocommerce';
import { ShopProductDetailPage } from '../pages/shop-product-detail/shop-product-detail';
import { ShopCartPage } from '../pages/shop-cart/shop-cart';
import { ShopCheckoutPage } from '../pages/shop-checkout/shop-checkout';

export function WpApiLoaderFactory(http: Http, info: Info) {
  return new WpApiStaticLoader(http, 'http://info.diamond.school/wp-json/');
}

@NgModule({
  declarations: [
    MyApp,
    MailPage,
    HomePage,
    ShopPage,
    TabsPage,
    LoginPage,
    ShopCategoryPage,
    ShopProductDetailPage,
    ShopCartPage,
    ShopCheckoutPage,
    RegisterPage,
    AccountPage,
    SwitchSchoolPage,
    ModalPage,
    ViewPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: (WpApiLoaderFactory),
      deps: [Http]
      
    }),
    PipesModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MailPage,
    HomePage,
    ShopPage,
    LoginPage,
    ShopCategoryPage, 
    ShopProductDetailPage, 
    ShopCartPage,
    ShopCheckoutPage, 
    RegisterPage,
    ModalPage,
    TabsPage,
    AccountPage,
    SwitchSchoolPage,
    ViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteProvider,
    DatabaseProvider,
    Info,
    OneSignal,
    WoocommerceProvider
  ]
})
export class AppModule {}