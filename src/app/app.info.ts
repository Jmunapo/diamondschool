import { Injectable } from '@angular/core';

@Injectable()
export class Info {
    public add_user_meta = 'http://info.diamond.school/wp-json/infoplugin/v1/addusermeta/?user_id=' //user id and secret
    public info_wp_api = 'http://info.diamond.school/wp-json/';
    public info_url = 'http://info.diamond.school/';
    public info_json = 'http://info.diamond.school/info/';
    public emailTo = 'support@diamond.co.zw';
    public get_media = 'http://info.diamond.school/wp-json/wp/v2/media/';  //add media id
    public get_nonce = '/get_nonce/?insecure=cool&controller=user&method='
    public gen_cookie = 'user/generate_auth_cookie/?insecure=cool&username=';
    public validate_cookie = 'user/validate_auth_cookie/?insecure=cool&cookie=';
    public get_all_schools = 'http://info.diamond.school/wp-json/wp/v2/schools';
    public get_school_meta = 'http://info.diamond.school/wp-json/infoplugin/v1/getusermeta/post/' //add school <id></id> only
    public schools_postfix = '.diamond.school/'
    public info_getnonce = 'http://info.diamond.school/info/get_nonce/?controller=user&method=register';
}