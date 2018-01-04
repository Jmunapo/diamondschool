import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { WpApiPosts, WpApiMedia, WpApiUsers } from 'wp-api-angular';
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
    public wpApiPosts: WpApiPosts, 
    public wpApiMedia: WpApiMedia, 
    public wpApiUsers: WpApiUsers,
    public info: Info) {
    this.wpApiUsers.getList()
      .map(res => res.json())
      .subscribe(data => {
        this.users = [];
        for (let user of data) {
          let oneUser = new User(user['id'], user['name'], user['avatar_urls']['96']);
          this.users.push(oneUser);
          this.usernames.push(user['name']);
        }
      },
    err=>{
      console.log(err);
    })
  }


  get_events(subdomain) {
    let extra = '';
    if(subdomain === 'primary'){ extra = '/basic'}
   let url = `http://${subdomain}.diamond.school${extra}/wp-json/wp/v2/event`
    return this.http.get(url);
  }

  get_posts(subdomain) {
    let extra = '';
    if (subdomain === 'primary') { extra = '/basic' }
    let url = `http://${subdomain}.diamond.school${extra}/wp-json/wp/v2/post`
    return this.http.get(url);
  }

  getPosts(): Observable<Post[]> {
    return this.wpApiPosts.getList()
      .map(res => res.json())
      .map(data => {
        var posts = [];
        for (let post of data) {
          let onePost = new Post(post['author'], post['id'], post['title']['rendered'], post['content']['rendered'], post['excerpt']['rendered'], post['date'], post['featured_media']);
          onePost.media_url = this.get_media(onePost.mediaId);
          posts.push(onePost);
        }
        return posts;
      });
  }

  get_schools() {
    return this.http.get(this.info.get_all_schools)
      .map(v => {
        let data = JSON.parse(JSON.stringify(v));
        let schools = [];
        for (let post of data) {
          let school = {id: post.id, name: post.title.rendered};
          schools.push(school);
        }
        return schools;
      });
  }
  get_meta(id) {
    return this.http.get(this.info.get_school_meta+id)
      .map(v => {
        let info = { city: get_data(v['school-city']), subdomain: get_data(v['school-domain']), thumbnail: get_data(v['_thumbnail_id']), level: get_data(v['school-level']), location: get_data(v['school-location'])};
        return info;
      });
      function get_data(arr){
        let data;
        try {
          data = arr[0];
        } catch (error) {
          data = null;
        }
        return data;
      }
  }

  get_media(id: number): Observable<string> {
    return this.wpApiMedia.get(id)
      .map(res => res.json())
      .map(data => {
        return data['source_url'];
      });
  }

  getUserImage(userId: number) {
    for (let usr of this.users) {
      if (usr.id === userId) {
        return usr.userImageUrl;
      }
    }
  }

  getUserName(userId: number) {
    for (let usr of this.users) {
      if (usr.id === userId) {
        return usr.name;
      }
    }
  }

  get_thumb_image(){
      this.http.get(this.info.get_media)
      .subscribe(v=>{
        let image_data = [];
        let data =  JSON.parse(JSON.stringify(v));
        for (let p of data) {
          let thumbnail = { id: p.id, url: p.source_url}
          image_data.push(thumbnail);
        }
        this.database.setData('thumbnails', image_data).then(val=>{
          if(v){
            console.log('Media available')
          }
        })
        
      })
    }

  do_login(data){
    let serialized = this.serialize_get(data);
    let url = 'http://info.diamond.school/info/auth/generate_auth_cookie/?' + `${serialized}`;
    return this.http.get(url)
      .map(result => {
        return JSON.stringify(result);
      });
  }
  get_username(username: string){
    if(this.usernames.indexOf(username) == -1){
      return true;
    }
    return false;
  }

  get_nonce(){
    return this.http.get(this.info.info_getnonce)
      .map(result => {
        return JSON.stringify(result);
      });
  }

  register_user(data,nonce) {
    data['nonce']=nonce;
    let serialized = this.serialize_get(data);
    let url = `http://info.diamond.school/info/user/register?${serialized}`;
    return this.http.get(url)
      .map(result => {
        return result;
      });
  }
  set_usermeta(user_id, description, secret){
    let url = this.info.add_user_meta + user_id + `&description=${description}&secret=${secret}`;
    return this.http.get(url)
      .map(result => {
        return JSON.stringify(result);
      });
  }

  user_subscribe(data, subdomain){
    let serialized = this.serialize_get(data)
    let url = 'http://' + subdomain + this.info.schools_postfix + subdomain + `/user/register?${serialized}`;    //'http://primary.diamond.school/basic/dXul/user/register?' + `${body}`;
    return this.http.get(url)
      .map(result => {
        return result;
      });
  }

  user_get_nonce(subdomain) {
    let url = 'http://' + subdomain + this.info.schools_postfix + subdomain + this.info.get_nonce +'register';
    return this.http.get(url)
      .map(result => {
        return JSON.stringify(result);
      });
  }

  serialize_get(obj){
    let str = [];
    for (let e in obj){
      str.push(encodeURIComponent(e) + "=" + encodeURIComponent(obj[e]));
    }
    return str.join("&");
  }
}
