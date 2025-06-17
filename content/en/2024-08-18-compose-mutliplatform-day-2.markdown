---
layout: post
title: 'Compose Multiplatform in Action: First Battle, Setting Up the CMP Environment'
date: '2024-08-18 17:13:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-2
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

The `Compose Multiplatform (CMP)` UI framework takes Kotlin code sharing capabilities to a new level

You can implement user interfaces once

and use them on all target platforms—including iOS, Android, desktop, and web

Today we'll start step by step with setting up the environment

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Goal
We want to create a CMP project capable of producing `multi-platform` applications (Android, iOS, Web, Desktop)

So first we need to understand how to set up a CMP project

You can install based on the items listed below

Some are optional

You can choose what to install based on `your own needs`

  * Android Studio
  * Java and JDK
  * Xcode
  * Kotlin plugins
  * (Optional) Kotlin Multiplatform plugin
  * (Optional) CocoaPods
  * (Optional) kdoctor
  * (Optional) Browsers

## CMP Environment Setup - Installing Essential Tools
<div class="c-border-content-title-1">Recommended: Install kdoctor first (Optional)</div>
`kdoctor` is an officially recommended plugin

It helps check if all necessary components in your environment are `ready`

Install kdoctor using the Terminal command

```
brew install kdoctor
```
<img src="/images/compose/019.png" alt="Cover" width="100%" /><br />

Then simply run `kdoctor` to perform the check

For example, in my environment

it detected that I hadn't installed the Kotlin Multiplatform Plugin

```
kdoctor
```
<img src="/images/compose/020.png" alt="Cover" width="100%" /><br />

In short

when you see all `[v]` marks

it means your `environment is correctly` set up

If `kdoctor` diagnoses any issues in your environment:

`[x]`: Any failed checks that need fixing

You can find problem descriptions and potential solutions after the * symbol.

`[!]`: Warning checks

These might be optional installations

Just reminders of what you could install

<div class="c-border-content-title-1">Installing Android Studio</div>
To make CMP development more convenient, we need to install `Android Studio`

First, go to the [Android Studio official website](https://developer.android.com/studio)

to download the IDE

<img src="/images/compose/021.png" alt="Cover" width="50%" /><br />

Then, if you're on `MacOS`, open the downloaded `.dmg` file

and drag the IDE to your Applications folder

If you're on `Windows`, run the `.exe` file and select the installation directory

<img src="/images/compose/022.png" alt="Cover" width="50%" /><br />
(Image shows Mac installation)

<div class="c-border-content-title-1">Checking the Kotlin Plugin</div>
`CMP` primarily uses `Kotlin` for development

so the Kotlin Plugin is `essential`

However, modern Android Studio versions come with it integrated

Once you install Android Studio, the Kotlin Plugin is already installed

(Newer IDE versions take care of this for you)

So you can proceed to open `Android Studio`

If you do encounter any issues

go to `Tools > Kotlin > Configure Kotlin in Project`

to let the IDE check if it's installed

<img src="/images/compose/023.png" alt="Cover" width="50%" /><br />

<div class="c-border-content-title-1">Checking Java JDK Environment</div>
This step is similar to the one above

Newer versions of `Android Studio IDE` already handle this for you

If you're `unsure` whether it's installed

the IDE has a built-in download option

You can check for JDK installation at:

Click `Android Studio > Settings` or use shortcut `Command + ,`

<img src="/images/compose/024.png" alt="Cover" width="50%" /><br />

Navigate to `Build, Execution Deployment > Build Tools > Gradle`

<img src="/images/compose/025.png" alt="Cover" width="50%" /><br />

Click the dropdown menu and select from existing options in your environment

or click Download JDK to download it

<img src="/images/compose/026.png" alt="Cover" width="50%" /><br />

Additionally

I recommend using `sdkman` (Optional)

It allows you to `manage SDKs in your environment` via command line

Since we're focusing on `CMP`

I'll just introduce a few `commonly used` commands

Feel free to look up more online if interested

View currently configured sdk

```
sdk current
```

List available and downloadable Java SDKs

```
sdk ls java
```

Set JAVA environment (xxx name can be found using sdk ls above)

```
sdk using java xxx
```

<div class="c-border-content-title-1">Kotlin Multiplatform plugin (Optional)</div>
To better support Multiplatform in Android Studio

we need to download the `Kotlin Multiplatform plugin`

Open Settings > Plugin > Marketplace

<img src="/images/compose/017.png" alt="Cover" width="50%" /><br />

Click `install`

After completion, click `Apply` and then `Restart` the IDE

This enables Android Studio to automatically create `basic KMP project content`

when using Create New Project

It's like having a built-in `template` creator

<img src="/images/compose/018.png" alt="Cover" width="50%" /><br />

> For reference, see the [KMM Plugin official Release](https://kotlinlang.org/docs/multiplatform-plugin-releases.html)

Additionally, `for CMP specifically`

there's an official online method for creating basic CMP projects

(If you forgot the difference between KMP and CMP, refer to `Day 1` article, <a href="{{site.baseurl}}/compose-multiplatform-day-1">Compose Multiplatform in Action: Taking It Easy, An Introduction to CMP</a>)

This is through the online webpage

[Wizard](https://kmp.jetbrains.com/#newProject)

which lets you create a project and import it into the IDE

The choice between methods comes down to:

`KMP`: Using the `KMM plugin` focuses more on `Native UI` + `common logic` development

`CMP`: Using the online `KMM Wizard` focuses more on `Compose UI` + `common logic` development for multiple platforms

That's all for this introduction

When we start detailed project development later

I'll explain how to use the `Wizard`

<div class="c-border-content-title-1">Installing Xcode</div>

If you're on macOS

and want to run iOS apps

you'll need Xcode

The method is simple

Go to the App Store, search for Xcode

and download it

<img src="/images/compose/016.png" alt="Cover" width="50%" /><br />

If you're using another operating system

you can skip this step

though you won't be able to build iOS apps

There might be workarounds?

But those probably won't follow the standard approach XD

<div class="c-border-content-title-1">Installing CocoaPods (Optional)</div>

If you anticipate using iOS frameworks, you can install this now

If not, you can wait until needed

Install CocoaPods using the command

```
brew install cocoapods
```

However, to install via brew

you'll need a newer version of Ruby

According to the official site, you need at least version `3.3.4`

> Depends on:
ruby	3.3.4	Powerful, clean, object-oriented scripting language

You can check your environment's version with

```
ruby -v 
```

If your version is too old

first `reinstall` it

```
brew reinstall ruby
```

Then use `brew install cocoapods`

<div class="c-border-content-title-1">Checking Browsers (Optional)</div>

If you want to create Web applications

you'll need a browser that supports `Wasm garbage collection (GC)`.

Here's the official information

You need to check your OS's `Browser version`

The following environments are currently supported

`Chrome` and `Chromium`: Supported from version 119.

`Firefox`: Supported from version 120.

`Safari/WebKit`: Wasm GC is currently in development

Browsers like Safari might not fully support it yet

so you might not be able to run everything completely

If you need to develop Web apps

try following the information above

<div class="c-border-content-title-1">Conclusion</div>
I always feel that starting with a new programming language or framework

usually means you'll be `unfamiliar` with how to configure its environment

but with a little guidance

it becomes much easier to get started

Overall

you don't need prior experience with Compose Multiplatform, Android, or iOS

you can start from zero, gradually familiarize yourself with Kotlin, and then master CMP step by step

If you have any questions or issues, feel free to discuss in the comments section, and we can learn and grow together.

That's all for this article, thank you for reading and for your support!
 
