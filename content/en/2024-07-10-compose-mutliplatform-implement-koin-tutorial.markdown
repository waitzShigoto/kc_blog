---
layout: post
title: "【Compose Multiplatform】Using Dependency Injection with Koin"
date: 2024-07-10 14:12:20 +0800
image: cover/compose_multiplatform_koin.png
tags: [Kotlin, Compose Multiplatform, Koin, Dependency Injection]
permalink: /compose-multiplatform-koin
categories: ComposeMultiplatform
excerpt: "This article provides a detailed guide on how to use Koin for dependency injection in Compose Multiplatform projects, including library imports, DI implementation, and methods to initialize Koin on different platforms."
---

## Introduction

In Compose Multiplatform projects

dependency injection is an important design pattern

Koin, as a lightweight DI framework

is very suitable for cross-platform development

This article will introduce how to use Koin

for dependency injection in Compose Multiplatform

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## Implementation Steps
<div class="c-border-content-title-1">1. Import Libraries</div>
Add to your .toml file:

<script src="https://gist.github.com/waitzShigoto/1c76521f84737bfa12984f2ca451d340.js"></script>

Add to your build.gradle.kts:

<script src="https://gist.github.com/waitzShigoto/305692852ee11669c95e6b6d7a4c069d.js"></script>

<div class="c-border-content-title-1">2. Implement DI Content</div>
Next, we need to implement the specific DI content:

You can implement this based on your actual needs

For example, we might plan to use viewmodel, database, datastore, etc.

You can categorize according to your actual needs

to make your code more maintainable and manageable

<script src="https://gist.github.com/waitzShigoto/5b922a7f0eeb3c57e35fdb6d2f2c2842.js"></script>

<div class="c-border-content-title-1">3. Initialize Koin</div>
If your implementation happens to need `cross-platform` access

for example, accessing Context in Android

then dependency injection needs to be injected separately

Based on different platforms and requirements, we have multiple ways to initialize Koin:

in iOSMain:

<script src="https://gist.github.com/waitzShigoto/9a283e26ab1ba7df68b49e1a5afdd9d7.js"></script>

in androidMain:

<script src="https://gist.github.com/waitzShigoto/9aa5cf28e011445cfefb4cf96c37fbd9.js"></script>

If your implementation happens to `not need cross-platform` access

you can use the following method to inject directly in commonMain

For koin-compose version 1.2.0, you can use `KoinApplication`

to make your code more cohesive

<script src="https://gist.github.com/waitzShigoto/678e1811c1cb91ea1ede5a3de49587c0.js"></script>

Or you can also use the original `startKoin`:

<script src="https://gist.github.com/waitzShigoto/b027bf199cb30df673fff52f95216aef.js"></script>

<div class="c-border-content-title-1">4. Practical Use</div>

After that, you can directly use `koinViewModel` to inject viewmodels
<script src="https://gist.github.com/waitzShigoto/e76b173931dad48aa8d87b9853021e5e.js"></script>

Or for some components, you can use `get()` in the module to help you get instances

## Conclusion
- Koin can be used in Compose Multiplatform
- With appropriate configuration, Koin can be used flexibly on different platforms
- Using Koin greatly simplifies dependency management in cross-platform projects
- Choose the appropriate initialization method based on project scale and complexity 