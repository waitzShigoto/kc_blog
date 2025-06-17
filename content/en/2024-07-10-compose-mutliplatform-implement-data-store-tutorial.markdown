---
layout: post
title: 【Compose Multiplatform】Implementing Local Persistent Storage with DataStore
date: '2024-07-10 13:10:10 +0800'
image: cover/compose_multiplatform_datastore.png
tags:
  - CMP
  - DataStore
  - Kotlin
permalink: /compose-multiplatform-datastore
categories: CrossPlatform
excerpt: >-
  This article introduces how to implement cross-platform DataStore local
  storage in Compose Multiplatform projects, including library imports,
  implementing DataStore for different platforms, and methods for using
  DataStore in commonMain.
---

## Introduction

In pure Android projects

we can directly use the native DataStore

but in Compose Multiplatform projects

how can we continue using DataStore seamlessly?

This article will introduce how to implement

DataStore local storage in a cross-platform environment

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## Implementation Steps
<div class="c-border-content-title-1">1. Import Libraries</div>
Add to your .toml file:

<script src="https://gist.github.com/waitzShigoto/64fbb0e57e0aae819f214a001a2ad618.js"></script>

Add to your build.gradle.kts:

<script src="https://gist.github.com/waitzShigoto/072a8d5fb78c251d75bff786043e7b4e.js"></script>

<div class="c-border-content-title-1">2. Implement DataStore for Each Platform</div>
Create expect functions and local storage names:

<script src="https://gist.github.com/waitzShigoto/8296380fb742aa1610f47e03ddc9c9ad.js"></script>

Android platform implementation:

<script src="https://gist.github.com/waitzShigoto/614b088bdf6023183b0dee650b5649ee.js"></script>

iOS platform implementation:

<script src="https://gist.github.com/waitzShigoto/d0e2b82e2d755d318e328aaa8e0d226d.js"></script>

<div class="c-border-content-title-1">3. Using DataStore in commonMain</div>
Use the interfaces implemented above
to use DataStore in commonMain:

<script src="https://gist.github.com/waitzShigoto/aad753fa1e7571946cee9a1fb768e4ff.js"></script>

<div class="c-border-content-title-1">4. Add Koin Module (Optional)</div>
If you want to use Koin for dependency injection, you can set it up like this:

<script src="https://gist.github.com/waitzShigoto/cec17b93139a5431fdf2ca437f71de02.js"></script>

## Conclusion
- Compose Multiplatform allows us to use DataStore in cross-platform projects
- Through proper encapsulation, we can use DataStore API uniformly across different platforms
- Using DataStore simplifies the implementation of local data persistence
- Combined with dependency injection frameworks like Koin, DataStore instances can be better managed

## References
[Android Developer Official](https://developer.android.com/kotlin/multiplatform/datastore) 
