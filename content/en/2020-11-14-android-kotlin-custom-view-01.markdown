---
layout: post
title: >-
  Learning Android Kotlin Custom UI Techniques - Switching Views and Dropdown
  Animation Tutorial - 01
date: '2020-11-14 15:30:18 +0800'
image: cover/android-photo.jpg
permalink: /android_custom01
tags:
  - Android
categories: AndroidDev
excerpt: >-
  In this tutorial, you will learn how to use Android Kotlin custom UI
  techniques, specifically how to implement switching views and dropdown
  animations.
---

<h1 class="c-border-main-title-2">Actual Effect</h1>

The easiest way to understand is to watch the video first. The effect is as shown in the video:

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-git01.gif" alt="Cover" width="30%"/>
</div>

<p> </p>
<p> </p>
In this demo, you will see:

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">Dropdown bottom sheet</a></li>
    <li><a href="javascript:void(0)">Recycler view left and right swipe</a></li>
    <li><a href="javascript:void(0)">Switching items on click in Recycler view</a></li>
    <li><a href="javascript:void(0)">Centering Recycler view on initialization</a></li>
    <li><a href="javascript:void(0)">Setting item margins in Recycler view</a></li>
    <li><a href="javascript:void(0)">WebView redirect to application</a></li>
  </ol>
</div>

I also inherited some classes (only listing the main ones used):

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">LinearLayoutManager</a></li>
    <li><a href="javascript:void(0)">BottomSheetBehavior</a></li>
    <li><a href="javascript:void(0)">ItemDecoration</a></li>
    <li><a href="javascript:void(0)">OnScrollListener …etc.,
 other classes are not listed here.</a></li>
  </ol>
</div>

In this article, I will first introduce some features of this demo, such as:
The effect of the central imageView fading in and out as you scroll.

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg01.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-custom/kt-demo-jpg02.jpeg" alt="Cover" width="30%" >
</div>

The second step is to customize a left and right sliding recycler view, including:

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">Customizing the recycler view including detailed adjustments</a></li>
    <li><a href="javascript:void(0)">Setting spacing</a></li>
    <li><a href="javascript:void(0)">Animations during scrolling (font color change, gradient, view change, etc.)</a></li>
  </ol>
</div>

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg03.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-custom/kt-demo-jpg04.jpeg" alt="Cover" width="30%" >
</div>

Finally, here are some common parameter adjustments, 

color code settings, 

or other view block settings, etc. 

If you're interested, keep reading! 

Please refer to:

<div class="table_container">
  <a href="{{site.baseurl}}/posts/android-kotlin-custom-view-02">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom02">Learn Android Kotlin Custom UI Techniques - Switching Views and Dropdown Animation Tutorial - 02</a>
</div>

