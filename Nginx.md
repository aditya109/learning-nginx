

# Table of Contents 

- [Nginx - Load Balancing](#nginx---load-balancing)
  * [What is Nginx?](#what-is-nginx-)
    + [Proxy, Reverse Proxy, and Load Balancing](#proxy--reverse-proxy--and-load-balancing)
      - [Proxy](#proxy)
      - [Reverse Proxy](#reverse-proxy)
      - [Load Balancer](#load-balancer)
  * [Current & Desired Architecture](#current---desired-architecture)
  * [Layer 4 and Layer 7 Proxying in Nginx](#layer-4-and-layer-7-proxying-in-nginx)
  * [Examples](#examples)
    + [Nginx as a Web Server, Layer 7, and Layer 4 Proxy](#nginx-as-a-web-server--layer-7--and-layer-4-proxy)
      - [Nginx as a Web server](#nginx-as-a-web-server)
      - [Nginx as a Layer 7 proxy](#nginx-as-a-layer-7-proxy)
        * [Proxy to 4 backend NodeJS services (docker)](#proxy-to-4-backend-nodejs-services--docker-)
        * [Split load to multiple backend (app1/app2)](#split-load-to-multiple-backend--app1-app2-)
        * [Block certain request (/admin)](#block-certain-request---admin-)
      - [Nginx as a Layer 4 Proxy](#nginx-as-a-layer-4-proxy)
        * [Enable HTTPS on Nginx](#enable-https-on-nginx)
        * [Enable TLS 1.3 on Nginx](#enable-tls-13-on-nginx)
        * [Enable TLS 1.3 on Nginx](#enable-tls-13-on-nginx-1)
        * [Enable HTTP/2 on Nginx](#enable-http-2-on-nginx)
  * [Enable HTTPS, TLS 1.3 & HTTPS/2 on Nginx](#enable-https--tls-13---https-2-on-nginx)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Nginx - Load Balancing

## What is Nginx?

Nginx can be a web server - serves web content or proxy – load balancing, backend routing and caching.

### Proxy, Reverse Proxy, and Load Balancing

#### Proxy 

A proxy prevents the server from knowing who the client is, or rather hides their identity.
![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture1.svg)

Benefits:

1. Anonymity for clients

2. Caching

3. Blocking unwanted sites

4. GeoFencing - certain clients can view certain content only/ fencing the clients within a certain internet range.

#### Reverse Proxy

A reverse proxy prevents the client from knowing which server it is getting served from. 
![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture2.svg)

Benefits:

1. Anonymity for Servers

2. Load Balancing

3. Caching web acceleration

4. Isolation internal traffic

5. Security against external traffic

6. Single entry URL

7. Logging (health checking)

8. Canary Development (x% of audience undergo alternate content on endpoint)

#### Load Balancer 

A load balancer is just an instance of a reverse proxy, which has the following two conditions:

1. Must be two or more to truly balance the load.

2.    Load Balancer must store meta data about server.

## Current & Desired Architecture

 ![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture3.svg)

![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture4.svg) 

## Layer 4 and Layer 7 Proxying in Nginx

1.    Nginx can operate in Layer 7 (http/Application Layer) or Layer 4 (tcp/Transport Layer).

2.    Using **stream** context, it becomes layer 4 proxy.

3.    Using **http** context, it becomes layer 7 proxy.



## Examples

### Nginx as a Web Server, Layer 7, and Layer 4 Proxy

#### Nginx as a Web server   

1.    Let us try to make a simple web server, by making our own default **nginx.conf.**
      making nginx as a web server
      1. needs port to listen to 
      2. build directory location 
      3. needs to be HTTPS

```nginx
http {
     server {
         listen 8080;
    }
 }
events { }
```

Now we want to run to add our own **index.html** location.

```nginx
http {
     server {
         listen 8080;
         root D:/Work/test/;
     }
 }
 events { }
```


Now we want to reload our nginx, and since nginx cannot be stopped unless told to do, so we type: 

```powershell
nginx -s stop
nginx
```

OR,

```powershell
nginx -s reload
```

2. Now we will create multiple sites and make nginx behave as reverse proxy.

   ​	a)   `D:/Work/test/site1/index.html`

   ​	b)   `D:/Work/test/site2/index.html`
   Now just reloading the **nginx.conf** gives the following:
   ![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture5.svg)

3. Serving images here in addition to the 2 sites, we added D:/Work/test/images. We need to add it on `nginx.conf`.

   ```nginx
   http {
      server {
          listen 8080;
          root D:/Work/test/;
   
          location /images {
              root D:/Work/test/;
          }
      }
   }
   events { } 
   ```

   ![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture6.svg)

4. Let us assume we are trying to reroute with regular expressions.

    ```nginx
   http {
        server {
            listen 8080;
            root D:/Work/test/;
   
            location /images {
                root D:/Work/test/;
            }
            location ~ .jpg$ {
                return 403;
            }
        }
    }
    events { }
   ```
   
   If we reload the **nginx.conf**, we get this:
   
    ![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture7.svg)

​        Here we sent 403 to anyone who is trying to access a `*.jpg` file.

5. Creating another server now on another 8888, rerouting traffic. **Proxy Pass**

   ```nginx
   http {
        server {
            listen 8080;
            root D:/Work/test/;
    
            location /images {
                root D:/Work/test/;
            }
        }
        server {
            listen 8888;
            location / {
                proxy_pass http://localhost:8080/;
            }
            location /img {
                proxy_pass http://localhost:8080/images;
            }
        }
   }
   events { }
   ```
   
   If we reload the **nginx.conf**, we get this:
   
   ![](https://raw.githubusercontent.com/aditya109/learning-nginx/main/assets/Picture8.svg)

#### Nginx as a Layer 7 proxy

##### Proxy to 4 backend NodeJS services (docker)

1. First follow the `README.md` in the `resources/app` and built the `nodeapp` image locally.

2. Then start 4 detached containers with `nodeapp` as base image.

3. Now write the `nginx.conf` as follows:

   ```nginx
   http {
   
           upstream allbackend {
                   server 127.0.0.1:2222;
                   server 127.0.0.1:3333;
                   server 127.0.0.1:4444;
                   server 127.0.0.1:5555;
   
           }
           server {
                   listen 81;
                   location / {
                           proxy_pass http://allbackend/;
                   }
           }
           
   }
   
   events { }
   ```

   > By default, the load-balancing algorithm is **round-robin**.

   The successive `cURL` on `http://localhost:81` gives a circular loop of responses. 

   ```bash
   ⚖️ » curl http://localhost:81                                     
   StatusCode        : 200
   StatusDescription : OK
   Content           : appid:2222 home page: say hello! 👈
   RawContent        : HTTP/1.1 200 OK
                       Connection: keep-alive
                       Content-Length: 32
                       Content-Type: text/html; charset=utf-8
                       Date: Sat, 16 Jan 2021 12:39:36 GMT
                       ETag: W/"20-BjkqA0zkwBHU1xBZwjMsAv8HrNs"
                       Server: nginx/1.18.0...
   Forms             : {}
   Headers           : {[Connection, keep-alive], [Content-Length, 32], [Content-Type, text/html;
                       charset=utf-8], [Date, Sat, 16 Jan 2021 12:39:36 GMT]...}
   Images            : {}
   InputFields       : {}
   Links             : {}
   ParsedHtml        : mshtml.HTMLDocumentClass
   RawContentLength  : 32
   ⚖️ » curl http://localhost:81                                     
   StatusCode        : 200
   StatusDescription : OK
   Content           : appid:3333 home page: say hello! 👈
   RawContent        : HTTP/1.1 200 OK
                       Connection: keep-alive
                       Content-Length: 32
                       Content-Type: text/html; charset=utf-8
                       Date: Sat, 16 Jan 2021 12:39:38 GMT
                       ETag: W/"20-rAzl7fzXaCbhLqw6Yt+kcFu/lZU"
                       Server: nginx/1.18.0...
   Forms             : {}
   Headers           : {[Connection, keep-alive], [Content-Length, 32], [Content-Type, text/html;
                       charset=utf-8], [Date, Sat, 16 Jan 2021 12:39:38 GMT]...}
   Images            : {}
   InputFields       : {}
   Links             : {}
   ParsedHtml        : mshtml.HTMLDocumentClass
   RawContentLength  : 32
   ⚖️ » curl http://localhost:81
   StatusCode        : 200
   StatusDescription : OK
   Content           : appid:4444 home page: say hello! 👈
   RawContent        : HTTP/1.1 200 OK
                       Connection: keep-alive
                       Content-Length: 32
                       Content-Type: text/html; charset=utf-8
                       Date: Sat, 16 Jan 2021 12:39:39 GMT
                       ETag: W/"20-5DlY5ecEGcR+E59SH01dHiLhwk4"
                       Server: nginx/1.18.0...
   Forms             : {}
   Headers           : {[Connection, keep-alive], [Content-Length, 32], [Content-Type, text/html;
                       charset=utf-8], [Date, Sat, 16 Jan 2021 12:39:39 GMT]...}
   Images            : {}
   InputFields       : {}
   Links             : {}
   ParsedHtml        : mshtml.HTMLDocumentClass
   RawContentLength  : 32
   ⚖️ » curl http://localhost:81
   StatusCode        : 200
   StatusDescription : OK
   Content           : appid:5555 home page: say hello! 👈
   RawContent        : HTTP/1.1 200 OK
                       Connection: keep-alive
                       Content-Length: 32
                       Content-Type: text/html; charset=utf-8
                       Date: Sat, 16 Jan 2021 12:39:40 GMT
                       ETag: W/"20-tdJHrfF2GyYrx8+DnE8xClQiabw"
                       Server: nginx/1.18.0...
   Forms             : {}
   Headers           : {[Connection, keep-alive], [Content-Length, 32], [Content-Type, text/html;
                       charset=utf-8], [Date, Sat, 16 Jan 2021 12:39:40 GMT]...}
   Images            : {}
   InputFields       : {}
   Links             : {}
   ParsedHtml        : mshtml.HTMLDocumentClass
   RawContentLength  : 32
   ```
   
4. Changing the load-balancing algorithm to `IP-Hash`(Consistent Hashing).

   ```nginx
   http {
   
           upstream allbackend {
                   ip_hash;            # 👈
                   server 127.0.0.1:2222;
                   server 127.0.0.1:3333;
                   server 127.0.0.1:4444;
                   server 127.0.0.1:5555;
   
           }
           server {
                   listen 81;
                   location / {
                           proxy_pass http://allbackend/;
                   }
           }
           
   }
   
   events { }
   ```

   Now, on reloading nginx, no-matter how many times we curl, we get the same output:
   
   ```bash
   ⚖️ » curl http://localhost:81
   StatusCode        : 200
   StatusDescription : OK
   Content           : appid:2222 home page: say hello!
   RawContent        : HTTP/1.1 200 OK
                       Connection: keep-alive
                       Content-Length: 32
                       Content-Type: text/html; charset=utf-8
                       Date: Sat, 16 Jan 2021 12:49:08 GMT
                       ETag: W/"20-BjkqA0zkwBHU1xBZwjMsAv8HrNs"
                       Server: nginx/1.18.0...
   Forms             : {}
   Headers           : {[Connection, keep-alive], [Content-Length, 32], [Content-Type, text/html;
                       charset=utf-8], [Date, Sat, 16 Jan 2021 12:49:08 GMT]...}
   Images            : {}
   InputFields       : {}
   Links             : {}
   ParsedHtml        : mshtml.HTMLDocumentClass
   RawContentLength  : 32
   ```

##### Split load to multiple backend (app1/app2)

Let's consider that we are making something load-intensive and say we are assigning for 2 servers each for `app1` and `app2` respectively.

```nginx
http {                     
        upstream allbackend {
                server 127.0.0.1:2222;
                server 127.0.0.1:3333;
                server 127.0.0.1:4444;
                server 127.0.0.1:5555;
        }
        upstream app1backend {
                server 127.0.0.1:2222;
                server 127.0.0.1:3333;
        }
        upstream app2backend {
                server 127.0.0.1:4444;
                server 127.0.0.1:5555;
        }
        server {
                listen 81;
                location / {
                        proxy_pass http://allbackend/;
                }
                location /app1 {
                        proxy_pass http://app1backend/;
                }
                location /app2 {
                        proxy_pass http://app2backend/;
                }
        }
}
events { }
```

Now, what would happen is whenever we hit `/`, we would **RR** between 2222, 3333, 4444 and 5555.

But, if we hit `http://localhost:81/app1`, it would only **RR** between 2222 and 3333.
Also, hitting `http://localhost:81/app2`, it would only **RR** between 4444 and 5555.

##### Block certain request (/admin)

Let's now block requests to `http://localhost:81/admin`. Because now, it is going **RR**.

 ```nginx
http {                     
        upstream allbackend {
                server 127.0.0.1:2222;
                server 127.0.0.1:3333;
                server 127.0.0.1:4444;
                server 127.0.0.1:5555;
        }
        upstream app1backend {
                server 127.0.0.1:2222;
                server 127.0.0.1:3333;
        }
        upstream app2backend {
                server 127.0.0.1:4444;
                server 127.0.0.1:5555;
        }
        server {
                listen 81;
                location / {
                        proxy_pass http://allbackend/;
                }
                location /app1 {
                        proxy_pass http://app1backend/;
                }
                location /app2 {
                        proxy_pass http://app2backend/;
                }
                location /admin {
                        return 403;				# 👈
                }
        }
}
events { }
 ```

On reloading, when we hit `http://localhost:81/admin` or `cURL`ing the URL, we get **403 Error**.

```bash
⚖️ » curl http://localhost:81/admin
curl : 403 Forbidden
nginx/1.18.0
```

#### Nginx as a Layer 4 Proxy

In Layer 4, let's assume we have only 1 connection between client and browser; our server on other hand has 4.

To write an `nginx.conf` for Layer 4, we just need to change `http` directive to `stream`. But now we cannot use `location` directive, because it is Layer 4. Let's try exemplifying this:

```bash
⚖️ » nginx -s reload
nginx: [emerg] "location" directive is not allowed here in D:\Services\nginx-1.18.0\nginx-1.18.0/conf/nginx.conf:10
```

To rectify this, we just use `proxy_pass`.

```nginx
stream {                     
        upstream allbackend {
                server 127.0.0.1:2222;
                server 127.0.0.1:3333;
                server 127.0.0.1:4444;
                server 127.0.0.1:5555;
        }
        server {
                listen 81;
                proxy_pass allbackend;
        }
}
events { }
```

But, now we can no longer observe **RR** on backend response, i.e., on hitting `http://localhost:81` we always get response from a singular port.

The reason is `nginx` internally performs a NAT(Network Address Translation), but what it does is, it maps incoming request from a particular client IP to an **RR** server IP:port and establishes a TCP connection, and then onwards all the requests from that particular client IP. But this is not consistent. Because the `nginx` a maximum of 6 connections at a time, so if we refresh too fast and sent a lot of request to the server, the `nginx` might decide to switch the server IP.

A consistent output is obtained on `telnet`.

##### Create a DNS Record

I want add another port 443 to serve as `nginx` webserver, so all-in-all we have two ports for communication - 81 and 443.

##### Enable HTTPS on Nginx

##### Enable TLS 1.3 on Nginx

##### Enable TLS 1.3 on Nginx

##### Enable HTTP/2 on Nginx

## Enable HTTPS, TLS 1.3 & HTTPS/2 on Nginx

```
1:01:08 Create DNS record
1:05:08 Enable HTTPS on Nginx (lets encrypt)
1:14:00 Enable TLS 1.3 on NginX
1:17:10 Enable HTTP/2 on NginX
1:20:10 Summary
1:25:34 NginX FrontEnd Timeouts
1:26:49 client_header_timeout 
1:30:30 client_body_timeout 
1:33:00 send_timeout
1:35:00 keepalive_timeout
1:36:15 lingering_timeout
1:40:00 resolver_timeout 
1:41:36 NginX BackEnd Timeouts
1:42:17 proxy_connect_timeout 
1:43:53 proxy_send_timeout
1:46:30 proxy_read_timeout 
1:48:55 keepalive_timeout 
1:50:00 proxy_next_upstream_timeout 
1:53:30 Nginx On Docker
```

