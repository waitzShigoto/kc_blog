---
layout: post
title: "【Compose Multiplatform】Cross-Platform App with Android Context Implementation Using Koin"
date: 2024-07-10 16:44:11 +0800
image: cover/compose_multiplatform_di_context.png
tags: [Kotlin, Compose Multiplatform, Dependency Injection, Koin]
permalink: /compose-multiplatform-di-context
categories: ComposeMultiplatform
excerpt: "This article provides a detailed guide on how to handle Android-specific Context issues when using Koin for dependency injection in Compose Multiplatform projects, including actual code implementations."
---

## Introduction

When developing Compose Multiplatform projects

we need to handle platform-specific issues

One problem we encounter is that

Android platform requires Context while iOS doesn't

This article will introduce how to

successfully solve this problem when using Koin for dependency injection

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## Implementation Methods
<div class="c-border-content-title-1">1. Using expect and actual Keywords</div>
First

we need to use CMP's expect and actual keywords to provide different implementations for different platforms

First create the expect in commonMain

In this example, SettingDataStore needs context

and LearningViewModel needs SettingDataStore

so I created an expect platformModule variable

<script src="https://gist.github.com/waitzShigoto/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-content-title-1">2. Android Platform Implementation</div>
On the Android platform, we need to implement platformModule 

where I expect dataStore needs to get a context:

<script src="https://gist.github.com/waitzShigoto/683e5aae4fed38732e316cb0a94cde94.js"></script>

<div class="c-border-content-title-1">3. iOS Platform Implementation</div>
On the iOS platform, we don't need Context

so we can implement it directly

<script src="https://gist.github.com/waitzShigoto/912bd0f442f650156791481b1cf7e4c3.js"></script>

<div class="c-border-content-title-1">4. Initialize Koin</div>
Initialize Koin at each platform's entry point:

Android

At the Android entry point, get the context

and insert it into the startKoin module list

<script src="https://gist.github.com/waitzShigoto/34ee8c8baf10fe2ab0a34a0d3815994a.js"></script>

iOS:

<script src="https://gist.github.com/waitzShigoto/425c93b104dcc5cc35373a83174dfe1d.js"></script>

## Usage
Using koinViewModel injected ViewModel in commonMain:

<script src="https://gist.github.com/waitzShigoto/0d756e78444510d20f26fec3a8829358.js"></script>

Or you can use `get()` in the module to help generate the instances you need
<script src="https://gist.github.com/waitzShigoto/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

## Conclusion
- Using expect and actual keywords can handle platform differences
- Koin provides DI support in Compose Multiplatform
- Properly handling Context makes cross-platform code clearer and more maintainable
- This method can be applied to other platform-specific dependency injection scenarios
- In actual development, you can flexibly adjust DI strategies according to your own needs 