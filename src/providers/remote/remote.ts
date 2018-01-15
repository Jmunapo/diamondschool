import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { Info } from '../../app/app.info';
import { DatabaseProvider } from '../database/database';

export class Post {
  public media_url: Observable<string>;
  constructor(
    public authorId: number, 
    public id: number, 
    public title: string, 
    public content: string, 
    public excerpt: string, 
    public date: string, 
    public mediaId?: number) { }
}

export class User {
  constructor(public id: number, public name: string, public userImageUrl: string) { }
}

export class School {
  constructor(public id: number, public name: string) { }
}

@Injectable()
export class RemoteProvider {
  users: User[];
  usernames: Array<string> = []

  constructor(
    public database: DatabaseProvider,
    public http: HttpClient,
    public info: Info) {
  }


  //Get all data from the sever
  get_data(subdomain: string, type: string) {
    let url = `http://${subdomain}.diamond.school/wp-json/wp/v2/${type}`
    return this.http.get(url);
  }

  get_school_groups(subdomain) {
    let url = `http://${subdomain}.diamond.school/wp-json/dschool/v1/groups`;
    return this.http.get(url);
  }

  get_custom_post(subdomain, posttype) {
    let url = `http://${subdomain}.diamond.school/wp-json/dschool/v1/custompost/?posttype=${posttype}`;
    return this.http.get(url);
  }


  get_events(subdomain) {
    let url = `http://${subdomain}.diamond.school/wp-json/wp/v2/events`
    return this.http.get(url);
  }

  get_posts(subdomain) {
    let url = `http://${subdomain}.diamond.school/wp-json/wp/v2/posts`
    return this.http.get(url);
  }

  get_schools() {
    return this.http.get(this.info.get_all_schools)
      .map(v => {
        let data = JSON.parse(JSON.stringify(v));
        let schools = [];
        for (let post of data) {
          let school = { id: post.id, name: post.title.rendered };
          schools.push(school);
        }
        return schools;
      });
  }
  get_meta(id) {
    return this.http.get(this.info.get_school_meta + id)
      .map(v => {
        console.log('Get meta')
        console.log(v);

        let info = { city: get_data(v['school-city']), 
                     subdomain: get_data(v['school-domain']), 
                     thumbnail: get_data(v['_thumbnail_id']), 
                     motto: get_data(v['school-motto']), 
                     address: get_data(v['school-address']), 
                     level: get_data(v['school-level']), 
                     location: get_data(v['school-location']) };
        return info;
      });
    function get_data(arr) {
      let data;
      try {
        data = arr[0];
      } catch (error) {
        data = null;
      }
      return data;
    }
  }


  getUserImage(userId: number) {
    for (let usr of this.users) {
      if (usr.id === userId) {
        return usr.userImageUrl;
      }
    }
  }

  get_thumbnail(id){
    let url = `http://info.diamond.school/wp-json/wp/v2/media/${id}`;
    return this.http.get(url);
  }

  do_login(data) {
    let serialized = this.serialize_get(data);
    let url = `http://info.diamond.school/info/auth/generate_auth_cookie/?${serialized}`;
    return this.http.get(url)
      .map(result => {
        return JSON.stringify(result);
      });
  }

  get_nonce() {
    return this.http.get(this.info.info_getnonce)
      .map(result => {
        return JSON.stringify(result);
      });
  }

  register_user(data, nonce) {
    data['nonce'] = nonce;
    let serialized = this.serialize_get(data);
    let url = `http://info.diamond.school/info/user/register?${serialized}`;
    return this.http.get(url)
      .map(result => {
        return result;
      });
  }

  user_subscribe(data, subdomain) {
    let serialized = this.serialize_get(data)
    let url = `http://${subdomain}.diamond.school/${subdomain}/user/register?${serialized}`;    //'http://primary.diamond.school/basic/dXul/user/register?' + `${body}`;
    console.log(url);
    return this.http.get(url)
      .map(result => {
        return result;
      });
  }

  user_get_nonce(subdomain) {
    let url = 'http://' + subdomain + this.info.schools_postfix + subdomain + this.info.get_nonce + 'register';
    return this.http.get(url)
      .map(result => {
        return JSON.stringify(result);
      });
  }

  serialize_get(obj) {
    let str = [];
    for (let e in obj) {
      str.push(encodeURIComponent(e) + "=" + encodeURIComponent(obj[e]));
    }
    return str.join("&");
  }
}
