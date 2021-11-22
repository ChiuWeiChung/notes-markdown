# Cookie & Session

Originally, most people just say cookies or HDP cookies. They are really just tiny little bits of information that we can store in a user's browser and they're associated with some Web page. So if if I have a user come to my website, whatever it is, some app I've created, I can send back a cookie. It's just a key and a value. So apair I'll send back something like this is stupid and you wouldn't do it. But let's say color is teal, then their browser, that particular user, their browser is going to
take that cookie information that I sent back and store it in the browser. And then on subsequent requests to my website, the browser is going to realize that there's a cookie stored color set to teal and it's going to include that information on subsequent requests to my website. So it's it's a way of basically making http have some state. Normally every request is entirely separate and has no knowledge of what came before. But through cookies I can store or we can store some information in the browser for a particular user
and then that user's browser will send that data to the server or send it to the server on subsequent requests so I can store things like, you know, a preference if they like dark or light mode for a website.
But often we actually use it to do things like to remember a user's shopping cart or the contents of their cart.

We can have a user request, some page we can send back some cookie that will be like a unique identifier for that user.
And then every time that user comes back, that cookie will be sent along with that request. And so we can use that information to figure out how many times user has been on the page, how many different pages on our site that Benta because basically the cookie acts as a unique identifier, a flag or something to identify this one user.

## Sending Cookies

```js
const express = require('express');
const app = express();

app.get('/getcookie', (req, res) => {
    res.cookie('name', 'Rick');
    res.send('Hi there');
})

app.listen(3000);
```

## Receive Cookies

Express 沒有解析 Cookies 的功能，需要透過第三方套件 `cookie-parser` 作為 Middleware。

```js
const express = require('express');
const cookieParser = require('cookie-parse');
const app = express();

app.use(cookieParse());

app.get('/getcookie', (req, res) => {
    res.cookie('name', 'Rick');
    res.send('Hi there');
})

app.get('/takecookie', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
})

app.listen(3000);
```

## Signing Cookies

OK, so if we go to the cookie password document documentation, there's this line at the beginning. It says, optionally, you may enable signed cookie support by passing a secret string. OK, so what is this talking about? What is signed cookie support or just signed cookies?
Well, the idea behind signing something in programming, we're usually referring to a digital signature or a cryptographic signature.
The idea is not to encrypt or hide information. Instead, it is to be able to verify its integrity, verify that something hasn't changed.
Think of a wax seal on an old letter. You put that wax seal on there. And if that letter makes it to you or to your whoever you're sending it to and that seal is not broken, then you know you know that the integrity of that letter is still intact. Nobody has read it.

And what that will do is have Cookie Parcher sign it using a secret code that I'm going to specify. basically it's going to sign it and then
send this weirder looking version of our cookie to the client. Then on the client side, that weird looking version, the signed version will be sent back just like
any other cookie. That's all it is. It's just a regular old cookie. But on the server side, when we're looking at the cookies that have been sent to us, we'll be able
to verify or cookie parser will be able to verify and tell us if any of those signed cookies have been tampered with, essentially, if they're the exact same value that was sent. You know, if if somebody screwed them in any way, we'll be able to tell because they won't match.

> So signing is not about hiding the information. It's not about encrypting it. It is about making sure that the original data that we sent to the client, to the browser is still the data being sent back to us.

```js
const express = require('express');
const cookieParser = require('cookie-parse');
const app = express();

app.use(cookieParse('ilovewebdevelopment'));

app.get('/getcookie', (req, res) => {
    res.cookie('name', 'Rick', {
        signed: true
    });
    res.send('Hi there');
})

app.get('/takecookie', (req, res) => {
    console.log(req.cookies); // {}
    console.log(req.signnedCookies) // {name:'Rick'}

    res.send('take cookie back');
})

app.listen(3000);
```
