---
layout: post
title: Kotlin Flow Refactoring Network Connection Detailed Step-by-Step Guide
date: '2023-05-24 15:56:16 +0800'
image: cover/retrofit_with_kotlin_flow-1.png
tags:
  - Android
  - Kotlin
permalink: /kotlin_flow_refactor
categories: ProgrammingLang
excerpt: >-
  Easily master how to use Kotlin Flow for network connection refactoring. This
  tutorial provides a detailed step-by-step guide to help you achieve efficient
  and stable network connections effortlessly.
---

## Introduction
<div class="c-border-content-title-4">
    Kotlin offers a powerful tool called Flow
</div>

<p>
    Kotlin Flow is a coroutine-based asynchronous programming library,

    providing a reactive way to handle data streams,

    and seamlessly integrating with asynchronous operations.

    Applying Kotlin Flow to network requests,

    we can handle asynchronous tasks in an elegant and concise manner,

    making the code more readable and maintainable.

    <div class="c-border-content-title-4">
        A few years ago, I also shared a version using RxJava. If you're interested, you can check it out.
    </div>
    <div class="table_container">
      <a href="{{site.baseurl}}/posts/android-kt-rxjava">
      <img src="/images/cover/ea-website-rxjava-cover-photo-new-1.png" alt="Cover" width="25%" >
      Android Development - RxJava with Network Requests: Implementing Token Refresh and Retrying Network Requests</a>
    </div>

</p>

## Practical Use of Kotlin Flow
<div class="c-border-content-title-4">
    When actually calling Flow and collecting it, you need to include it in a Coroutine Scope, as shown below:

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6922457ce9a309d18258b1ac50ed77a6.js"></script>
</p>
<div class = "table_container">
  <p>Code Explanation</p>
  In the above code, we use the lifecycleScope of Coroutine Scope to operate our flow.

  We obtain a flow through our written API and collect it.

  In the process, we also add checkStatusAndRefreshToken to check whether the token has expired.

  If it has, it will automatically refresh and resend the request.

  Next, we use the catch function to catch any possible exceptions,

  and perform corresponding operations in the exception handling.

  If the previous steps are successful, we can obtain the return value in

  <b>collect</b>,

  and proceed with our logic processing.

</div>

## Kotlin Flow in Actual Development
<div class="c-border-content-title-4">Using Kotlin Flow to replace the original Retrofit call's callback or RxJava operators, the code is as follows</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d5a3acb5f2b90bee2cd8b60c54adfcab.js"></script>
</p>

<div class = "table_container">
  <p>Code Explanation</p>
  In the above code,

  we define a startLogin() function that returns a Flow containing the target data.

  Then, we add a request body,

  and execute the login API request.

  Here, we use the verifyResponse function to determine whether the returned value of the executed API request meets expectations

  <b>(the code for verifyResponse will be explained below).</b>

  After confirming there are no issues, we use emit to send the result to the Flow.

<b>Note</b>

We switch the thread of this Flow to the IO thread (.flowOn(Dispatchers.IO)) to ensure that network requests are executed on a non-main thread.
</div>

<div class="c-border-content-title-4">Add a verifyResponse to check if the API request is as expected</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/4a4daf5c3385a105b92cc642f9c505f5.js"></script>
</p>

<div class="table_container">
  <p>Code Explanation</p>
  In the code above,

  we use the generic type T to make the function compatible with various API return results.

  First, we check if the HTTP status code of the API request is between 200 and 300.

  Then, we check if the response content returned by the server is empty.

  If the above conditions are met,

  an appropriate exception is thrown.

</div>

<div class="c-border-content-title-4">Add a checkStatusAndRefreshToken to automatically refresh the token and re-request the original API when the API request token expires</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/e6e0cc122d03f964c1abafda32cd5b02.js"></script>
</p>

<div class="table_container">
  <p>Code Explanation</p>
  In the code above,

  we use an extension,

  and define it as Flow&lt;BaseResult&lt;T&gt;&gt;

  The main purpose is to check the response of the API request.

  Using a generic return result to be compatible with multiple API returns.

  We pass in function type variables tokenRefresh and apiCall,

  which are used to specify the re-call to get the token and the target API interface to be re-called.

  In the code above, when the conditions meet the custom error code, an emit will be triggered.

</div>

## Conclusion

<div class="table_container">
  <p>Summary</p>
  By using Kotlin Flow to refactor network requests instead of RxJava or Retrofit callbacks,

  we can achieve more powerful and flexible asynchronous programming capabilities.

  Using Kotlin Flow can make the code more readable and maintainable,

  while providing a more elegant way to handle asynchronous operations.

  During the code modification process,

  we used Kotlin Flow to replace the original Retrofit callback, encapsulating the API request in a Flow,

  and emitting the target data through emit. At the same time, we added the verifyResponse function to check if the API request meets expectations,

  including checking if the HTTP status code is in the range of 200~300 and if the response content is empty.

  Additionally,

  we introduced the checkStatusAndRefreshToken function,

  which can automatically refresh the token and re-initiate the original API request when the API request token expires.

  This mechanism ensures the smooth execution of API requests.

  In summary,

  using Kotlin Flow can improve the structure of network requests,

  making asynchronous operations easier to manage and handle.

  It can enhance the readability, maintainability, and scalability of the code, while also providing a better asynchronous programming experience.

  Additionally,

  there are some libraries that help you convert Retrofit calls to Flow,

  which can be directly applied to Retrofit interfaces.

  However, these libraries are often third-party or personal shares.

  In some projects or products,

  where the introduction of libraries needs to be evaluated,

  too many infrequently used libraries will not be introduced,

  so you might write your own.

  Of course, any method that works is a good method.

  Finding the method that best fits your project environment and efficiently solving problems is also very important!

</div>

It looks like you haven't pasted any Markdown content yet. Please provide the text you want translated, and I'll handle the translation while adhering to the specified rules.
