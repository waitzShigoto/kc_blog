---
layout: post
title: Developing Apps with Jetpack Compose for Android【02】 - DI Injection
date: 2024-05-27 15:27:05 +0800
image: cover/android-jetpack-compose-structure-part2.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part2
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">Introduction</div>
* This is the second part of this series

Continuing from the previous part

Mainly focusing on the basic construction of the initial project

For future development

I will consider starting to integrate DI injection

This time I am using Hilt

<div class="c-border-content-title-1">Project Setup</div>
* The libraries used are as follows:
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Integrating DI Injection - Hilt</div>
<div class="c-border-content-title-1">step1. Integrate Hilt & KSP</div>
* To use Hilt, the following toml configuration is required

Mainly the Hilt library and KSP for Hilt integration

<script src="https://gist.github.com/waitzShigoto/a529e6aef2c4cb054a593689b86ab962.js"></script>

* Add the plugin in build.gradle.kts(:app)
<script src="https://gist.github.com/waitzShigoto/ca4d1179d072db1f781831ce3ae367a6.js"></script>

* Import in build.gradle.kts(:yourAppName):
<script src="https://gist.github.com/waitzShigoto/0cecaed97e600ccd7069722e2cc62c42.js"></script>

* Import in build.gradle.kts(:app):
<script src="https://gist.github.com/waitzShigoto/a40eb48d1b2a7f6e4e59041fa4cff3b5.js"></script>

<div class="c-border-content-title-1">step2. Implement Hilt Application</div>
* The official documentation mentions

Adding Hilt must include `@HiltAndroidApp`

So implement an Application

<script src="https://gist.github.com/waitzShigoto/648bd2e1d642c5ea108af87e7700a7de.js"></script>

Testing shows that if not added, the following error will occur:

`Caused by: java.lang.IllegalStateException: Hilt Activity must be attached to an @HiltAndroidApp Application. Did you forget to specify your Application's class name in your manifest's application 's android:name attribute?`

<div class="c-border-content-title-1">step3. Start Injecting Classes</div>
* Once the above configuration is done

Hilt will provide injection functionality in classes annotated with `@AndroidEntryPoint`

* Let's try creating a ViewModel using Hilt
<script src="https://gist.github.com/waitzShigoto/c76e7ce4bc7743832372ae66ae651f03.js"></script>

Actual usage:
<script src="https://gist.github.com/waitzShigoto/412d3db62610456139c5231632f5d2dd.js"></script>

<div class="c-border-content-title-1">Adding Modules</div>
* DI can add modules to provide the required classes

and generate instances for you through DI

like the example below

mainly used for network request-related modules

`provideKotlinxJsonConverter` is used to provide a converter for parsing JSON format

`provideCustomConverter` is used to provide the response format definition for HTTP requests

`provideBaseRetrofitBuilder` is used to provide an instance of Retrofit

<script src="https://gist.github.com/waitzShigoto/1127653dde42bc2bca111e274a7ba521.js"></script>

In the source code above, you will see a line `@Named("xxx")`

This is used to indicate the name of this instance

Suppose your project happens to have multiple different configurations to generate

You can add `@Named("yourName")` at the top of the function

This allows Hilt to determine which instance to inject during compilation

Whether it's an internal company backend API or an external third-party service API

You might encounter APIs with different response situations

So you can use this form to generate instances for you

You can also build without adding `@Named`

But Hilt will just find the only one available to inject for you

Actual usage:

<script src="https://gist.github.com/waitzShigoto/a1b8b91295e8016cabc733463f6db0c9.js"></script>
* After using DI injection, you don't need to actively initialize and obtain the class instance yourself

DI handles it for you, and if used well

It will also make the code look cleaner and more readable

Like in the example above, I defined `kotlinx.serializer` to parse fixed JSON to class

`old-custom` environment contains content left by the old server

So I use the old defined format to parse it

`un-auth` defines an OkHttpClient that only adds HttpLoggingInterceptor in the Debug environment to parse logs

Finally, the API Service provided by `provideFeedbackUcService` has the features I mentioned above

* Through this example, you can understand

No matter how the server changes

We can easily

assemble the desired final shape using the above method

After writing it

You can also avoid writing a lot of repetitive code

For example: network requests

If the specifications provided by the server are the same

Then you only need to focus on developing the API service
<script src="https://gist.github.com/waitzShigoto/9fa177e6b7043a59f5d3841ee11fe2a4.js"></script>

* Finally, when you need to use these instances, just inject them directly in the constructor
<script src="https://gist.github.com/waitzShigoto/dae78780c5be26f1cba9b780f0c9f23c.js"></script>

<a class="link" href="#category" data-scroll>Back to Contents</a>
