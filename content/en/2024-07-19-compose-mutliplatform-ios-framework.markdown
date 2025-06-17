---
layout: post
title: >-
  【Compose Multiplatform】Using CocoaPods in CMP Projects and Using iOS
  Swift/Obj-C Without CocoaPods
date: '2024-07-18 21:30:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-ios-cocoapods
categories: CrossPlatform
excerpt: >-
  This article details the process of migrating from a Compose project to
  Compose Multiplatform, focusing on how to integrate iOS native code.
---

## Introduction

When developing cross-platform apps for both platforms
the current official solutions
may not be completely comprehensive
so for some features
we need to bridge back to the original platform
and use that platform's native code
How can we implement this?

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## Using CocoaPods
<div class="c-border-content-title-1">Add CocoaPods Configuration Settings</div>
Add configuration to libs.version.toml
<script src="https://gist.github.com/waitzShigoto/14f0d600c186a7e8d32be0d5b96666ae.js"></script>

In build.gradle.kts

add the cocoapods block

and add the Pod library dependencies you want to use `pod("Google-Mobile-Ads-SDK")`

as well as the `PodFile` location `podfile = project.file("../iosApp/Podfile")`

usually under your iOS project

if you generate a project with the KMM official website

the default name is `iosApp`

<script src="https://gist.github.com/waitzShigoto/b6c7c751d9e203f71422c98ab512dcb4.js"></script>

The official website mentions that you can add the following types of Pod library dependencies

- From CocoaPods repository
- Locally stored libraries
- Custom Git repository
- Custom Podspec repository
- With custom cinterop options

Configure Podfile under the iosApp project
<script src="https://gist.github.com/waitzShigoto/419374bf1bfe829fb5c2cbc3ae79a5a8.js"></script>

After that

use `pod install` in the iosApp project to install the configuration

if it's already installed, you can use `pod install --repo-update`

or `pod deintegrate` and then reinstall

Finally, run `./gradlew build`

if successful, you can import iOS bridged code through Kotlin

<script src="https://gist.github.com/waitzShigoto/13e7f746a07dd30247ad1850946dadc3.js"></script>

## Using iOS Framework in Kotlin Without CocoaPods
If you don't want to use CocoaPods

you can use cinterop to create Kotlin bridges for Objective-C or Swift declarations

so you can call them from Kotlin

Step 1. 

Create a `.def` file in `../composeApp/nativeInterop/cinterop/xxx.def`

(write the content according to your actual needs)

<script src="https://gist.github.com/waitzShigoto/bb0cdcf859ca450bacbf3b888b49e02a.js"></script>

Step 2.

Add the following code to the iOS configuration in `Build.gradle.kts`

the framework you want to use can also be found through paths after installing with cocoapods

or you can implement your own .swift bridge

<script src="https://gist.github.com/waitzShigoto/60fad794cafa8b4c067297035aea7128.js"></script>

## Conclusion

- However, based on current testing

iOS native code transferred directly through cocoapods configuration

cannot be completely transferred at the current stage

for example, when I use `Google-Mobile-Ads-SDK`, not all functions can be resolved

- So we need to use .def to transfer it ourselves

but this is equivalent to still having to write iOS native code
 
