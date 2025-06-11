---
layout: post
title: Developing an App with Jetpack Compose for Android【01】 - Initial Setup
date: 2024-05-27 14:07:32 +0800
image: cover/android-jetpack-compose-structure-part1.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part1
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">Introduction</div>
* It's been 2~3 years since I last posted an article related to `Jetpack compose`

During this period, I occasionally touched upon it

But I never systematically studied it

Recently, I had the opportunity to develop an entire project using Compose

So after some exploration

I have some insights to share

I've decided to write this process down as notes to share with everyone

<div class="c-border-content-title-1">Project Setup</div>

* First, I will decide which libraries to use this time

This time, I chose to challenge myself with the latest official recommendations

* Some of these libraries are also the latest versions applied when creating a new project in AS

Such as `material3`, `kts+toml configuration`, `jetpack compose`, etc.

Additionally, I previously shared issues encountered during `toml` migration

If interested, you can <a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">check it out</a>

* The actual plan is as follows:
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Implementing Compose Themes</div>

* Previously, when using XML, I would add color codes to colors.xml

Then place the color resource ID into styles.xml to achieve dark mode theme configuration

Now with `compose`, you can configure the app's theme through `.kt`

You can configure it according to the needs of each project

Personally, I prefer to set `ColorScheme`, `shape`, `typography`, `statusBarColor`, `navigationBarColor`, etc., based on `UX/UX design drafts`

Rather than designing each page individually

This saves a lot of repetitive development time

<div class="c-border-content-title-1">step1. Add compose-related libs and material3</div>
<script src="https://gist.github.com/waitzShigoto/416e5be6bcc5a0a6221d0fd027a503cb.js"></script>
Import as needed

The actual usage of toml is written like this: `implementation(libs.androidx.material3)`

Place it in your `build.gradle.kts(:app)`

 * `tips`: The multiple libraries above support automatic mapping of corresponding library versions when importing androidx-compose-bom, so you don't necessarily need to input version.ref

<div class="c-border-content-title-1">step2. Configure a common Theme including color, shape, typography</div>

Here is the documentation on Material 3 theme
<a class="link" href="https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md" data-scroll>documentation</a>

<script src="https://gist.github.com/waitzShigoto/7daaa21db73354b5ea4c6f7a9adefc1e.js"></script>
<script src="https://gist.github.com/waitzShigoto/6315bd0157777d118f0def22f2f7e288.js"></script>

<div class="c-border-content-title-1">step3. Actual Use of Theme</div>
Here we set up the status bar, navigation bar, theme, etc.

The colorscheme is applied from the previous implementation
<script src="https://gist.github.com/waitzShigoto/a94e4b1cde86b6b8789bdd1e89d526ca.js"></script>
Use in Activity or Screen:

<script src="https://gist.github.com/waitzShigoto/eef8ce349264ca797f6644676a588ffa.js"></script>

<div class="c-border-content-title-1">(Optional) step4. Create a Universal Toolbar</div>
* Here we create a universal toolbar

Because usually when a UI/UX designer provides the design

Most of the time the toolbar will have a similar effect

I would write a universal toolbar based on the design draft

You can decide whether you need to do this step

As follows:

<script src="https://gist.github.com/waitzShigoto/448372236d5ae5dd508b69a3c5e350ac.js"></script>
Here is the actual use of `MainAppBarConfig`

The main thing is to add the desired style or click response in `MainAppBarConfig`

Then put it in the `topBar` of the `Scaffold`
<script src="https://gist.github.com/waitzShigoto/0d011cba78589066d77d921d2e029a5e.js"></script>
<div class="c-border-content-title-4">Conclusion</div>
* This is the end of the first part

The main thing is to lay a solid foundation

Future development will be very convenient and efficient!

<a class="link" href="#category" data-scroll>Back to Contents</a>
