---
layout: post
title: "Compose Multiplatform in Action: Taking It Easy, An Introduction to CMP"
date: 2024-08-18 17:12:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-1
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

## Introduction

Hello everyone!

This series will focus on `Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin`

I'll concentrate on developing cross-platform apps for `Android` and `iOS`

In the final days, I'll also share my findings and insights from my research

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Introduction to Compose Multiplatform
Let's first get a basic understanding of **Compose Multiplatform** and **Kotlin Multiplatform**

The term `Multiplatform` itself is simply `Multi` + `platform`

As the name suggests, it means supporting `multiple platforms`

According to the [JetBrains official website](https://www.jetbrains.com/lp/compose-multiplatform/),

`Compose Multiplatform` allows developers to use Kotlin's `Compose declarative UI`

to develop applications

Currently supported platforms include `iOS`, `Android`, `Desktop`, and `Web`

Some people also refer to it as `KMM (Kotlin Mobile Multiplatform)`

or `CMP (Compose Multiplatform)`, `KMP (Kotlin Multiplatform)`

In this series, I'll use `CMP` to refer to Compose Multiplatform

to reduce repetition throughout the articles

I hope you can get used to this abbreviation!

<div class="c-border-content-title-1">What's the difference between CMP and KMP?</div>

Both aim to simplify cross-platform project development

reducing the time spent writing and maintaining the same code for different platforms

You can use Gradle configurations

along with shared source code development to reduce development time

such as developing cross-platform code through `commonMain`

Compose UI is developed in this layer

`Here are the main differences`:

`KMP` requires using `native platform` code to create the UI layout for target apps

For example:

Android uses `xml` to implement layouts

or more recently, Android has evolved to using Compose for UI implementation

`iOS` uses SwiftUI for implementation

`CMP` extends the KMP concept

It similarly allows writing shared code

and now supports using `Compose` to create multi-platform UI

<div class="c-border-content-title-1">Preview</div>

As shown below, I can create `multi-platform UI` using just Compose

<img src="/images/compose/015.png" alt="Cover" width="50%" /><br />

Of course, this UI is created using `Material Design 3`

Some might be concerned that it doesn't match iOS design guidelines

However, my past practical experience has taught me

that when working on projects

most UI designs

are primarily based on iOS screens

Therefore, apart from platform-specific components

careful customization can create screens that look almost identical to iOS

So this aspect depends on each person's `use case`

and whether they care about these differences XD

## Goals

Finally

In these thirty days, I'll share the following topics

* [Understanding CMP basic environment configuration]()
* Mastering CMP [basic creation methods](), [project configuration](), and [simulator configuration]()
* [Understanding CMP program entry points]()
* [Using Material Design 3 Theme in CMP]()
* [Concrete methods for implementing UI with Compose]()
* [Using expect and actual to implement cross-platform code]()
* [Understanding how to use Koin for DI injection in CMP]()
* How to handle Android context requirements in CMP development?
* Implementing DataStore for local persistent storage in CMP
* [Implementing local database using SqlDelight in CMP]()
* [Implementing local database using Room in CMP]()
  and solving the [KSP2] Annotation value is missing in nested annotations issue
* Importing CocoaPods and using iOS frameworks in CMP projects
* Using cinterop and iOS frameworks in CMP projects
* ...and more

## Conclusion

Starting tomorrow

I'll begin writing notes to help everyone better understand `Compose Multiplatform`

Additionally, CMP is constantly being updated

Based on articles published by Google

It's likely that more support

will be gradually added to CMP

which is something to look forward to

<img src="/images/compose/014.png" alt="Cover" width="50%" /><br />
(Image source: Google Blog)

Since CMP is relatively new

we might encounter various situations

and there isn't as much information available online

so if you encounter any issues, we can discuss them and learn from each other
 