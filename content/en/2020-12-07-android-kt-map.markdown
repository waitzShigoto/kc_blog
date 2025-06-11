---
layout: post
title: "Android Kotlin Tutorial: Decoding Google Maps Polyline Paths and Drawing Lines"
date: 2020-12-07 21:22:14 +0800
image: cover/kotlin_tutorial_google_map-1.png
tags: [Android]
categories: Android實作
excerpt: "This tutorial introduces how to use Kotlin in Android to decode polyline using Google Map API and draw lines based on the estimated path."
---

## Introduction

Recently,

there was a requirement to draw the estimated path between two latitudes and longitudes on Google Map.

The method to achieve this is to first input two latitudes or addresses on Google Map,

obtain the path JSON format returned by the official Google API,

then parse the JSON content,

and use the data to draw the route.

Below is part of the JSON content:

<script src="https://gist.github.com/waitzShigoto/37e425cb8a6b029fd9b817b155705d3a.js"></script>

**(Since the JSON data is quite large when the route is long, only a part is shown)**
But if you want to see the complete JSON file, you can click <a href="https://gist.github.com/waitzShigoto/030767a7fea9fcf4eba7cc600adc0da8">here</a> to view it.

<div class="c-border-content-title-4">Step 1: Understanding the Data</div>
However, our requirement is to draw the entire driving route, so we plan to use the JSON data obtained just now, and have summarized a few tips as follows:

1. The data related to the path is located in the routes array within the JSON.

2. The routes contain the estimated directions.

Just like when using Google Map navigation,

the app will tell you

to turn left/right in 500m, etc.

3. Our focus this time is to draw the route between two points.

So we can directly obtain the `routes` > `overview_polyline` > `points` in the JSON format.

It contains a string encoded and compressed by Google.

<div class="c-border-content-title-4">Step 2: Understanding the Polyline Compression Algorithm</div>

(If you are interested in the encoding algorithm, you can check the official Google algorithm)

<a href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm?hl=zh-tw">Google Official Polyline Encoder Utility</a>

Here we will use

Maps JavaScript API

to get a string of `non-plaintext` data.

This string represents the path between the two points we want to draw.

Because Google has encoded it.

After reading the above document, I share the decoding process in sequence as follows:

* Convert each value to its equivalent ASCII

* Add the ASCII of “?” to each value (which is 63, the ASCII of ? is 63)

* Perform a logical AND operation on each value with 0x20

* Reverse the address

* Left shift the address

* Convert to binary

* Multiply the original latitude and longitude by 1e5…

The official Google document mentions

that the main reason is to `reduce the space consumption caused by a large amount of data` during transmission.

So the data is compressed.

<div class="c-border-content-title-4">Step 3: Decoding the Data</div>
To solve this problem, we have to find a way to decode it,

and expect to get the latitude and longitude of the entire route after decoding.

The implementation method is very simple.

Follow the reverse encoding process mentioned in the official Google algorithm.

Take the polyline encode obtained and decode it in reverse steps,

then you can get the array of latitudes and longitudes to be applied.

So theoretically, it can be implemented in any language/platform.

First, parse the `JSON obtained just now`.

I will not show the JSON parsing process here,

as many people are already familiar with it!

Next, we take the polyline encode obtained from Google

(points in the overview_polyline within routes):

<script src="https://gist.github.com/waitzShigoto/5099e838a2d8d9af507eb94e250b33b8.js"></script>

Following the official website's process, write the decode function (Kotlin version).

Here is an example I wrote in Kotlin.
You can modify it according to your needs.

(For example, modifying the returned model, etc.):

<script src="https://gist.github.com/waitzShigoto/17a978f6831fa8c0f2f80adffa1803ad.js"></script>
```
Here is an important point: after reversing the polyline encoding, the returned latitude and longitude are reversed, so when processing the latitude and longitude data, remember to reverse the positions.
```

Step two, pass the obtained polyline encode into the decode function:

<script src="https://gist.github.com/waitzShigoto/e9cf66a41cc014870cb8bab4c188a10a.js"></script>

After decoding, you can get a format similar to the one below.

<script src="https://gist.github.com/waitzShigoto/bf80d28f5abdd748f1def92a30e557ed.js"></script>

With this, we get the array of latitudes and longitudes we want to draw a line with, and we can use PolylineOption on Google Maps to draw the line:

<script src="https://gist.github.com/waitzShigoto/5eb77674995ca2e3422eed17825b22a6.js"></script>

The final result of the drawing is as shown in the picture (red path):

<div align="center">
  <img src="/images/googlemap/map02.png" alt="Cover" width="70%"/>
</div>

Additionally, here is a website that allows you to decode online,

so you can test if your decode results are correct during development.

<ol>
  <li>
    <a href="https://developers.google.com/maps/documentation/utilities/polylineutility">Google Official Polyline Encoder Utility</a>
  </li>
</ol>

If you think my article has helped you, please don't hesitate to give me some encouragement!
