---
layout: post
title: Developing Apps with Jetpack Compose for Android【03】 - Compose Navigation
date: '2024-05-27 15:42:39 +0800'
image: cover/android-jetpack-compose-structure-part3.png
tags:
  - Android
  - Kotlin
permalink: /android-jetpack-compose-structure-part3
categories: UIFramework
excerpt: ''
---

<div class="c-border-content-title-4">Introduction</div>
* This is the third part of this series

Having had the opportunity to develop an entire project using Compose

After some exploration

I have some insights to share

I decided to write this process into notes to share with everyone

<div class="c-border-content-title-1">Initial Setup</div>
* The libraries used are as follows:
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Implementing Navigation for Compose</div>
* Here we plan to use a Main activity to navigate and switch to other screens

So today we will implement NavHost in Compose

<div class="c-border-content-title-1">step1. Create enums for each screen</div>
* First, define an enum

It will contain the content you expect to navigate to

It can be expanded gradually as needed

<script src="https://gist.github.com/waitzShigoto/78babc3c8b4f6a00e73b65ce472b4dd7.js"></script>

<div class="c-border-content-title-1">step2. Define Compose Screen</div>
* Implement the screens you need, for example:
<script src="https://gist.github.com/waitzShigoto/c40ade08846566ca103aea3b9a5f23f0.js"></script>

<div class="c-border-content-title-1">step3. Create routers for each screen</div>
* Since we will use NavGraphBuilder

Extend NavGraphBuilder to specify the router for each screen

Here, we use the previously defined `Login` as a reference indicator for its router

To navigate to the LoginScreen, add the screen in the lambda

<script src="https://gist.github.com/waitzShigoto/2577ea435d4b0bb0d028223f6c8dbadd.js"></script>

<div class="c-border-content-title-1">step4. Register each screen</div>
* Next, add all the screens you want to navigate to in the `NavHost`

`startDestination`: your starting screen

`navController`: used to specify the navigation controller

To switch screens, simply control it with navController

For example: `navController.navigate(ElegantAccessScreen.Feedback.name)`

<script src="https://gist.github.com/waitzShigoto/72c59114a906ceb4efcc48c7acef5762.js"></script>

<div class="c-border-content-title-1">step5. Achieve multiple screens in one activity</div>
* Finally, when you want to add a new screen

Simply implement the Screen

<img src="/images/compose/001.png" width="50%">

Practical use:

<script src="https://gist.github.com/waitzShigoto/27b4d20765e035a36eed8ce204cbbc88.js"></script>

<a class="link" href="#category" data-scroll>Jump back to the table of contents</a>
