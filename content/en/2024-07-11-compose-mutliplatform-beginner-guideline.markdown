---
layout: post
title: "【Compose Multiplatform】Project Migration Discussion and Development Guide"
date: 2024-07-11 18:30:20 +0800
image: cover/compose_multiplatform_guide.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-guide
categories: ComposeMultiplatform
excerpt: "This article details the process of migrating from a Compose project to Compose Multiplatform, including initial migration costs, library equivalents, potential issues, and future outlook."
---

## Introduction

Compose Multiplatform (CMP) provides developers with a powerful cross-platform development tool

But migrating from a Compose project to CMP also faces some challenges

This article will detail key points and considerations in the migration process

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## Initial Migration Costs

Initially, you need to understand how CMP achieves cross-platform functionality

So it takes some time to understand

the project structure

Let's quickly go through it below

When developing with CMP, you need to be familiar with the structure of multiple folders:

<img src="/images/compose/009.png" alt="Cover" width="30%"/>

Common code is placed in commonMain:

<img src="/images/compose/010.png" alt="Cover" width="30%"/>

Import the required libraries in each environment:

<img src="/images/compose/011.png" alt="Cover" width="50%"/>

Since it uses lib.version.toml for configuration by default

you need to understand .toml

but it's actually very easy

the official defaults work fine

unless you need special configurations

Here are some notes I wrote before

<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">For reference</a>

## Reference for Library Migration from Compose Project to CMP Project

* Assuming we originally used some common libs or officially recommended ones for Android projects (as shown on the left of the table)

  After trying to write with CMP, we'll find some benefits in the migration cost of the libraries we use (as shown on the right of the table)

  Because most of them are things you've used when writing Compose

{% include table/compose-multiplatform-compare.html %}

## Potential Issues

1. Cross-platform requirement differences:

   For example, Android needs Context, iOS doesn't:

   <script src="https://gist.github.com/waitzShigoto/d4594b6b1b1e92509fa34c67233b301d.js"></script>

   Complete notes: <a href="{{site.baseurl}}/compose-multiplatform-di-context">【Compose Multiplatform】Cross-Platform App with Android Context Implementation Using Koin</a>

2. Platform-specific implementations:

   For example, mobile often uses local persistent storage

   In Android, we use DataStore to handle this issue

   So how do we use it across multiple platforms?

   Using expect and actual keywords:

   <script src="https://gist.github.com/waitzShigoto/99f7bc0f32960a1af80971e8f68a8b0d.js"></script>
   <script src="https://gist.github.com/waitzShigoto/171b2f873713be2da5214a5450e1f2a4.js"></script>
   <script src="https://gist.github.com/waitzShigoto/3a1379e63db12a23997c21d7f632d8fa.js"></script>
   Despite needing separate implementations

   some common libraries

   are supported by CMP with Kotlin implementations

   so even with separate platform implementations, you can still write in pure .kt

   just like the DataStore implemented in iosMain above

   Complete notes: <a href="{{site.baseurl}}/compose-multiplatform-datastore">【Compose Multiplatform】Implementing Local Persistent Storage with DataStore</a>

3. CMP library compatibility issues or bugs being continuously fixed:

   For example, SQLDelight 2.0.0 version has build errors on iOS:

    - Solution 1: Import stately-common

    - Solution 2: Upgrade to version 2.0.1 or above

   The reason can be found in this discussion thread: [Click here](https://github.com/cashapp/sqldelight/issues/4357)

   Complete SQLDelight notes: <a href="{{site.baseurl}}/compose-multiplatform-sqldelight">【Compose Multiplatform】Implementing SqlDelight Database</a>
## Future Outlook

Google mentioned support for KMP in their blog on May 14, 2024:

<img src="/images/compose/012.png" alt="Cover" width="50%"/>

This might mean more libraries will be supported in the future.

## Conclusion

- CMP provides powerful cross-platform development capabilities, but requires adaptation to the new project structure
- Most common libraries have corresponding CMP versions

For example, those commonly used in Compose App development can be used directly

DataStore, Room, etc.
- When handling platform differences, using expect and actual keywords is very helpful
- Pay attention to library version compatibility issues

Currently in development

I've encountered several configuration compatibility issues

Such as: Room compatibility issues with Kotlin 2.0.0

Errors with embedAndSign when configuring CocoaPods in CMP

- Keep an eye on Google's latest updates for more support and resources

I've tried asking GPT directly

but it may not be that accurate

Many compatibility issues still require researching on your own

or perhaps when more data becomes available in the future, it might provide more precise answers
 