---
layout: post
title: "Android Jetpack Compose Basic Tutorial"
date: 2021-09-13 16:00:48 +0800
image: cover/ea-website-base-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-base
excerpt: "Welcome to the Android Jetpack Compose Basic Tutorial! In this tutorial, we will introduce you to the world of Jetpack Compose, guiding you step by step to master the basic concepts and techniques of Compose."

---

## Introduction
On 2021/7/28

Google officially released Jetpack Compose stable version 1.0 

If you are interested in the official announcement, you can check <a href = "https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html">here</a> 

Today, I plan to share some basics on how to use Jetpack Compose to create components for Android apps.

Jetpack Compose is entirely written in Kotlin code 

replacing the traditional .xml files used for views or layouts 

resulting in only .kt files 

which reduces the majority of XML files. 

<div class="c-border-content-title-4">Jetpack Compose utilizes many unique features of Kotlin</div>

<div class="table_container">
  <p>Some basic concepts of Kotlin</p>
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">Lambda expression</a></li>
    <li><a href="javascript:void(0)">Function type</a></li>
    <li><a href="javascript:void(0)">Extension</a></li>
    <li><a href="javascript:void(0)">Named argument</a></li>
  </ol>
</div>

So if you are already familiar with the above Kotlin concepts

you will have a significant advantage in learning Jetpack Compose

and can quickly get started. 

<div class="c-border-content-title-4">First, let's look at the differences between the two</div>

Here is a simple toolbar written in XML:

<script src="https://gist.github.com/waitzShigoto/46bbdced14c9e3c26023854bed33c60d.js"></script>

And here is the toolbar written in Jetpack Compose:

<script src="https://gist.github.com/waitzShigoto/80743e79901a8c98b87655ff8f020193.js"></script>

This change allows us to control views entirely with code.

At the same time,

it makes it more convenient to use variables of function types,

to control the functionality needed for the views.

Since we are implementing with pure Kotlin code,

we can more flexibly use conditionals to control the visibility of views.

This gives us greater flexibility when designing applications.

## Specific Implementation

Here,

I have created some basic widgets.

When you actually use them in an Activity or Fragment,

you can reuse them as needed,

which allows for more efficient development and management of your application.

This modular design approach enables you to quickly build feature-rich and reusable interface elements,

greatly saving development time and improving code maintainability.

The final result in the IDE preview might look like this

Code on the left and preview on the right

<div align="center">
    <img src="/images/jetpack_compose/jc01.png" alt="Cover" width="100%" >  
</div>

<div class="c-border-content-title-4">Preliminary Work</div>

You must update Android Studio to the Arctic Fox version

to preview Composable components through the IDE.

Official download location:
<a href="https://developer.android.com/studio?hl=zh-cn" class="btn btn-primary" role="button">Download Android Studio Arctic Fox</a>

<div class="c-border-content-title-4">Step One</div>
First, add the relevant libraries to the gradle dependencies:

<script src="https://gist.github.com/waitzShigoto/c18119da90591482e2f6f5b6cb67bdec.js"></script>

<div class="c-border-content-title-4">Step Two</div>
Add @Composable to indicate that your function is a Jetpack Compose component.

<script src="https://gist.github.com/waitzShigoto/d8ecd7b8977a5d2e11cb89e00b1e2d04.js"></script>

Here,

```
Modifier
```
is an interface frequently used in Jetpack Compose,

to extend the properties of components.

Here,

using a variable as a function parameter,

means that when you call the AppBar component,

you can customize the Modifier,

setting properties such as the background color, animation, font, etc.

<h6>(Depending on the official component you are using, set different contents according to the implementation of that component's Modifier.) </h6>

<div class="c-border-content-title-4"><font color="green">Optional</font></div>

You can use Column to arrange the views you create with Jetpack Compose.

Column provides a vertical arrangement similar to LinearLayout,

which is very useful when you need to add multiple components.

By using Column, you can easily arrange multiple components vertically,

making your interface layout more structured and easier to manage.

<script src="https://gist.github.com/waitzShigoto/203f5c350db588cc6b3730f9b326710c.js"></script>
---

Start adding functions built into the official library to quickly create a toolbar.

For example, TopAppBar

<script src="https://gist.github.com/waitzShigoto/66d842982f99a753c786594e918abe16.js"></script>

Here you will see some

```Kotlin
modifier = ... ,
backgroundColor = ...,
elevation = ...,
contentColor = ...,
```

This actually utilizes Kotlin features like Named arguments and function types,

allowing you to more effectively extend the code when using functions.

Additionally, here we can use a function type variable<font color="red">
content: @Composable RowScope.() -> Unit</font>
to add an Image to the left side of the TopAppBar:

(You can press cmd+left click here to see the source code of TopAppBar and understand what RowScope does)

<script src="https://gist.github.com/waitzShigoto/049c22e6449d00c4aa529c33fc6cb76f.js"></script>

At this point, you have quickly completed a simple, extensible, and reusable widget.

<div class="c-border-content-title-4">Step Three</div>
So how do you start the preview?
You just need to write another function and add @Preview
Then press refresh to see the view you just created displayed on the right side of the IDE.
(If you don't see it, you can click Design or split on the right to open the preview screen)

<script src="https://gist.github.com/waitzShigoto/eac588083154d8faf5c8f15fff868798.js"></script>

<div class="c-border-content-title-4">Step Four</div>
In practical application

You can wrap it into a content to call it

This way, your screen can be divided very finely

Future maintenance will be more efficient

For example, wrap a complete logic layout like this

This way, if you want to change the layout appearance in the future, you can change it here

Some functions of your basic components do not need to be specially modified

<script src="https://gist.github.com/waitzShigoto/34565f4c1e1394cb2e5b1d50ded7093b.js"></script>

Actual result:
<div align="center">
    <img src="/images/jetpack_compose/jc02.png" alt="Cover" width="100%" >  
</div>

<div class="c-border-content-title-4">Final Step</div>

After completing the above steps

You can set your layout in the fragment or activity

Quite concise

<script src="https://gist.github.com/waitzShigoto/d697201a60570da069cd3cc4f0ce425c.js"></script>
