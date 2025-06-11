---
layout: post
title: "Android Jetpack Compose SwipeRefresh: Easily Implement Pull-to-Refresh for Lists!"
date: 2021-10-28 14:41:12 +0800
image: cover/ea_swiperefresh_app-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-swiperefresh
excerpt: "This article introduces how to use LazyColumn and SwipeRefresh in Jetpack Compose to easily implement dynamically updating list data."
---

## Introduction
Continuing from the previous article:

<a href="{{site.baseurl}}/android-kt-jetpack-compose-list/">
  <img src="/images/cover/ea-website-lazy-colume-cover-photo-new-1.png" alt="Cover" width="20%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-list/">Jetpack Compose: Easily Implement Dynamically Updating List Data with LazyColumn + ViewModel</a>

Today we will continue to fully implement the pull-to-refresh feature based on Jetpack Compose LazyColumn.

<div class="c-border-content-title-1">Implementation Effect: Pull-to-Refresh List</div>

<div align="center">
  <img src="/mov/jetpack/ea_swiperefresh_app.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">Related Knowledge Used</div>
* JetpackCompose SwipeRefresh, LazyColumn
* ViewModel

Combining the concepts introduced earlier,

and applying the SwipeRefresh component in Jetpack Compose,

you can easily achieve the target functionality.

Today we will learn how to use what we have learned before,

and integrate SwipeRefresh into the application.

This process is very intuitive,

and with just a few simple steps,

you can add pull-to-refresh functionality to your list.

<script src="https://gist.github.com/waitzShigoto/fe87780cc0639b8458d764ce30ee54ed.js"></script>

<div class="c-border-content-title-4">Meaning of Each Variable</div>

`state` is a boolean that observes whether a pull-to-refresh is happening.

`onRefresh` allows you to input the scope of the task to be done.

`indicator` allows you to set the details of the spinning symbol that appears during pull-to-refresh.

The code for this is as follows:

```
indicator = { state, trigger ->
            SwipeRefreshIndicator(
                state = state,
                refreshTriggerDistance = trigger,
                contentColor = Color.Black,
                arrowEnabled = true,
                fade = true,
                scale = true,
                backgroundColor = MaterialTheme.colors.primary,
            )
}
```
Other settings can be configured according to the names above,

such as size, background color, arrow appearance, arrow color, refresh distance, etc.

Another key point is

we use an `isRefreshing` variable and put it into the `state` variable required by SwipeRefresh.

The state of SwipeRefresh

will determine whether to show the spinning animation based on your status.

So when the status is `true`,

the spinning waiting animation will be present.

When it changes to `false`,

here I use `LiveData` and observe it as state,

and then observe the data retrieval after refreshing

to set it to end.

This pull-to-refresh

is simply completed.

You can also try it out quickly!

