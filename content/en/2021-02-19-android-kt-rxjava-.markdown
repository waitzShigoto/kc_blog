---
layout: post
title: "Android Development - RxJava with Network Requests: Implementing Token Refresh and Retrying Network Requests"
date: 2021-02-19 21:37:48 +0800
image: cover/ea-website-rxjava-cover-photo-new-1.png
tags: [Android]
categories: Android實作
permalink: /android-kt-rxjava
excerpt: "This article will introduce how to use RxJava to implement token refresh and retry network requests, which will help improve the user experience of the application."
---

## Introduction
Hello everyone!

It's been a while since my last post,

Today I want to share a method to solve the issue of refreshing tokens and retrying the same network request when using RxJava with network requests (e.g., OkHttp + Retrofit).

This problem is very common in apps that require a lot of connections.

When we need to make requests to the server,

to ensure the legality of the user,

we usually use a token mechanism to verify login or access API permissions.

And tokens usually have an expiration date,

to provide a good user experience,

we need to implement a more complete process when we are unaware that the token in a network request has expired.

<div class="c-border-content-title-4">Related Knowledge</div>

In this article, I will list the related knowledge used,

but the main focus is on sharing the process of implementing token refresh and network reconnection,

so I won't go into detail about each one. If you are interested, you can look it up or message me for discussion:

* Genetic
* Kotlin extension
* Kotlin function type
* RxJava
* Retrofit
* Okhttp

## Thought Process

Usually, when integrating API requests with a token mechanism in an application,

if no corresponding processing is done, the actual execution process might be as follows:

```
App network request -> Token expired -> Server returns access expired -> App handles the error accordingly
```

In this situation,

even though error handling is done,

every time the token expires,

it will trigger error handling (e.g., notifying the user that the token has timed out),

one or two times might be considered occasional,

but after multiple times,

users might think your application has a problem,

unable to execute smoothly,

thus reducing the user experience,
leading to more subsequent issues.

Therefore,

I hope to implement a similar process as follows,

so that after the token is refreshed,

the original network connection can be retried:

```
App network request -> Token expired -> Server returns access expired -> Execute token refresh process -> App retries the same network request
```

## Actual Development
In this article, the main method I use for network requests is the RxJava operator,

wrapping Retrofit and applying OkHttp to request network APIs. Here I share a way I request network:

<script src="https://gist.github.com/waitzShigoto/5724788a6a2efa973eb31b497ffb65df.js"></script>

If someone uses RxJava to handle network requests,

they usually use an Rx operator to control it.

Here,

I use Observable. And in the above code:

```
repo.getPaymentData(paymentRequest)
```

The returned result is an Observable.

If you follow the method I mentioned earlier,

the first situation might occur,

that is, after the network request, the token becomes invalid,

only error handling is done and then the token is refreshed,

but the API is not retried.

To solve this problem,

I started researching how to use RxJava to refresh the token during execution,

and use the new token to reconnect to the original API.

Therefore,

I wrote a Kotlin extension function

to achieve this functionality:

<script src="https://gist.github.com/waitzShigoto/889f4e67cf5edae25cffc006a25032dd.js"></script>

<div class="c-border-content-title-4">Code Explanation</div>

**1. When actually applying this extension, it will look like this:**

<script src="https://gist.github.com/waitzShigoto/8ef1124c7d67d02b7e3024fc56735bc8.js"></script>
It's very convenient to use,

just add the extension function where you need to re-acquire the Token,

and continue using the original method where you don't need to re-acquire the Token.

This extension function is very flexible,

just add the following code:

```
.retryNoKeyWhenError(resetRequest = {                       
     repo.getPaymentData(resetRequestToken(paymentRequest))})
```

**2. Let's take a look at the extended function separately**

I used flapmap to parse the data returned within Observable<T>,

and since it's a connection request, the server usually returns the result in a fixed format,

so we parse the request result status here.

If it's a success, then the entire original response is returned to the observer,

if it's an error, you write the handling mode you need based on actual requirements, such as:

Encountering these situations

(this is a self-defined enum class, mainly for signature or token expiration situations, you can define it yourself)

 ```
 State.FAIL_SIGNATURE_ERROR.value
 State.FAIL_SIGNATURE_EXPIRED.value
 State.FAIL_KEY_TOKEN_EXPIRED.value
 ```
 will execute the API to re-acquire the token, save the desired data, and then return the corresponding data, then return the original error situation to the observer.

 **3. At this point, using retryWhen**

 Because an error situation was returned earlier,

 it will trigger retryWhen,

 here I also defined an Observable for the number of retries and the interval in seconds for retries,

 it will determine how many seconds to retry once based on the input Int in case of failure.

The most important thing is, the function type used earlier,

plays an important role here, because this is where you write the method you expect to execute after the request fails:

```
resetRequest.invoke().delay(delayInSeconds, TimeUnit.SECONDS)
```

Since the return type of the extension is defined as Observable<T> here,

it can be reconnected to the original subscription, which I think is quite convenient,

for your reference.

Finally,

you can define specific error constants and handling processes based on other situations,

and add corresponding handling logic in this extension function.

No matter what situation you encounter,

as long as you define the corresponding error constants and handling processes in advance,

this extension function can help you execute the corresponding handling.

You can extend this function according to your needs,

making it more suitable for your application scenarios.

