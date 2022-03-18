import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  crypto = CryptoJS;

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const cbc_api_endpoint = request.url.split('couchbase.com')[1];
    const cbc_api_method = request.method;
    const cbc_secret_key = 'SECRET_KEY';
    const cbc_access_key = 'ACCESS_KEY';

    // Epoch time in milliseconds
    const cbc_api_now = (Math. floor(Date. now() / 1000)).toString();

    // Form the message string from the Hmac hash
    const cbc_api_message = cbc_api_method + '\n' + cbc_api_endpoint +
        '\n' + cbc_api_now.toString();

    const cbc_api_signature = this.crypto.HmacSHA256(cbc_api_message, cbc_secret_key);
    const hmacDigest = this.crypto.enc.Base64.stringify(cbc_api_signature);

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Authorization', 'Bearer ' + cbc_access_key + ':' + hmacDigest)
        .set('Couchbase-Timestamp', cbc_api_now);

    return next.handle(request.clone({ headers: headers }));
  }
}
