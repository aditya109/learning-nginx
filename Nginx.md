

# Table of Contents 

# Nginx - Load Balancing

## What is Nginx?

Nginx can be a web server - serves web content or proxy – load balancing, backend routing and caching.

### Proxy, Reverse Proxy, and Load Balancing

#### Proxy 

A proxy prevents the server from knowing who the client is, or rather hides their identity.

Benefits:

1. Anonymity for clients

2. Caching

3. Blocking unwanted sites

4. GeoFencing - certain clients can view certain content only/ fencing the clients within a certain internet range.

#### Reverse Proxy

A reverse proxy prevents the client from knowing which server it is getting served from. 

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

   

 

 

 

 

 

 

 

 

 

​        Here we sent 403 to anyone who is trying to access a *.jpg file.

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

 

 

 





 

#### Nginx as a Layer 7 proxy

##### Proxy to 4 backend NodeJS services (docker)

##### Split load to multiple backend (app1/app2)

##### Block certain request (/admin)

#### Nginx as a Layer 4 Proxy

##### Enable HTTPS on Nginx

##### Enable TLS 1.3 on Nginx

##### Enable TLS 1.3 on Nginx

##### Enable HTTP/2 on Nginx

## Enable HTTPS, TLS 1.3 & HTTPS/2 on Nginx