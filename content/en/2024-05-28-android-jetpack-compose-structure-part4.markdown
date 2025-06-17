---
layout: post
title: Developing Apps with Jetpack Compose for Android【04】 - Compose Screens
date: '2024-05-28 14:32:37 +0800'
image: cover/android-jetpack-compose-structure-part4.png
tags:
  - Android
  - Kotlin
permalink: /android-jetpack-compose-structure-part4
categories: UIFramework
excerpt: ''
---

<div class="c-border-content-title-4">Introduction</div>
* This is the fourth article in this series.

At this stage, we will focus more on

implementing the UI/UX design drafts.

You can start writing and detailing the code.

<div class="c-border-content-title-1">Project Setup</div>
* The libraries used are as follows:
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Sharing Experiences on Common Screens</div>
* After collaborating with different UI/UX designers,

I found that many design screens have common components

specific to the current project.

If there are some components that are universally used

throughout the project, you can extract them to create common Compose components.

(It mainly depends on how you communicate with the designer.)

* Common components like edittext, dialog, or some custom components

can be made into reusable Compose components.

Here are a few examples of such components.

You can implement them based on your needs.

<div class="c-border-content-title-1">Edittext</div>
<img src="/images/compose/002.png" width="100%">

<script src="https://gist.github.com/waitzShigoto/1a5a6e77cbaa7565c95152467d9aa6eb.js"></script>

<div class="c-border-content-title-1">Dialog</div>
<img src="/images/compose/003.png" width="100%">

<script src="https://gist.github.com/waitzShigoto/9eb6c6296cfab8ec4e17f5e151f3a205.js"></script>

<div class="c-border-content-title-1">Dialog</div>
<img src="/images/compose/004.png" width="100%">

<script src="https://gist.github.com/waitzShigoto/055ae82beba153468b22473973fc97e8.js"></script>

<div class="c-border-content-title-4">Assemble Your Screens</div>
* Next, you can start assembling various screens.

If the new screens and designs follow the same pattern,

you can easily assemble the screens

you painstakingly created earlier.

For example, the following screen uses the common toolbar

from the initial setup article and the Compose components shared above.
<img src="/images/compose/005.png" width="100%">

<div class="c-border-content-title-4">Responding to Screen Updates with Flow</div>

<div class="c-border-content-title-1">Creating Flow</div>

* Modern apps have more and more features,

so the sources or requirements for obtaining values have also increased.

If a feature is required to handle multiple screen changes

with different sources of values,

I might use Flow to handle the values returned by various coroutines.

Use Flow for the return or type of source data.

Sometimes you can't control the access speed of the data source,

such as network requests or querying large amounts of data from a local DB.

So you can use Flow to wait for the data to be emitted to you.

Here's a brief example:
<script src="https://gist.github.com/waitzShigoto/15bd34c56591b39a43887e892a0ff1bf.js"></script>

<div class="c-border-content-title-1">Create ViewState to Store Data Needed for Screen Response</div>
* Next, to organize all the content on your screen that will change

you can create a data class to store the data needed for your screen

<script src="https://gist.github.com/waitzShigoto/df6639924388dce2a2def14fe45d39c0.js"></script>

<div class="c-border-content-title-1">Combine Flows Using `combine`</div>
* Next, use `combine` to combine various data sources

`combine` will combine all your flows

and combine the most recent values emitted

The principle behind its implementation is to use function types or lambda functions

to return a flow of the type you specify

<img src="/images/compose/006.png" width="100%">

* If you want to make judgments within the lambda `{}` you can consider doing so

Finally, return the result you want using the ViewState defined earlier

`.stateIn` can set the initial value of this R-type flow

<script src="https://gist.github.com/waitzShigoto/93f44fdfaae010f19254a3b0cc5cfc5a.js"></script>

<div class="c-border-content-title-1">Using Data Provided by Flow in Compose</div>
* After completing the previous steps, you can use `.collectAsState()` to get the flow

and collect it into a state that Compose can use

At this point, you can responsively update the screen~

<script src="https://gist.github.com/waitzShigoto/a86bac16bd42eab68566b6b440fc6e5d.js"></script>
<a class="link" href="#category" data-scroll>Back to Table of Contents</a>
