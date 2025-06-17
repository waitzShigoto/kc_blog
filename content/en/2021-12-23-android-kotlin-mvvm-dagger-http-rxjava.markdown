---
layout: post
title: >-
  Creating a Smooth Auto-Loading Pagination Github API Demo: MVVM, DI, RxJava,
  and Paging in Android Kotlin
date: '2021-12-23 13:06:12 +0800'
image: cover/kotlin-mvvm+rxjava+retrofit+okHttp+dagger.png
tags:
  - Android
categories: AndroidDev
excerpt: >-
  In this tutorial, we will explore how to create a Github API Demo using MVVM,
  DI, RxJava, and Paging in Android Kotlin. Through this demo, you will learn
  how to build a smooth auto-loading pagination application and understand how
  to use these important technologies in Kotlin.
---

## Introduction

Today, I will share how to connect to the Github API to implement a smooth auto-loading pagination example using the following architecture.

 1. Using the MVVM architecture

 2. RxJava for controlling network requests

 3. Dependency injection

 4. Using Paging to display RecyclerView pagination

 5. Data connection to the Github API

<div class="c-border-content-title-4">The final result looks like this:</div>

<div align="center">
  <img src="/mov/paging/mvvm-paging-dagger2.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">The API used is provided by Github at /search/users</div>

```shell
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/search/users
```

<div class="c-border-content-title-4">The implemented functionality is</div>

Enter search text in the search field

Use the built data class to call the API
and display the returned results according to the specified quantity

## Preliminary Architecture Thoughts (TL;DR)

First, you need to plan the architecture

Here, we mainly use MVVM

You will have a rough diagram in mind

But you won't implement everything at once

You will build it layer by layer

Here is my simplified example:

<div align="start">
  <img src="/images/paging/project-struct.png" width="30%"/>
</div>

<div class="c-border-content-title-4">Expected Development Steps</div>

1. First, we handle some basic common classes,

such as the base folder, Android Application, and basic XML configurations.

These classes might be used multiple times in subsequent development,

so we complete these foundational tasks first.

2-a. This time, we decided to use Jetpack ViewModel and Dagger2.

Develop the DI folder mainly for the Application component,

which contains some common methods that other modules can use,

such as providing Application/Context or new common methods.

2-b. Before starting to construct the HTTP module,

I had already decided which libraries to use,

including OkHttp, Retrofit, and RxJava.

Then I started constructing the HTTP module,

implementing the Retrofit client,

mainly to provide a Retrofit instance, like this:

<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>

Then put it into the HttpModule to be used by other modules in the future

3. Start constructing the component and module for the page

After building the necessary basic classes

you can start creating new modules to implement the main functionality

Here, you can use the written HttpModule, only needing to write some APIs for external requests.

4. Start constructing the viewmodel and repository related parts,

think about what data you will need and how to update the data to formulate your viewmodel,

then use the repository to execute the HTTP request.

After building the above functions,

go back to the module and add the classes that need to be provided for DI auto-injection.

5. After completing the preparatory work, you can now start writing the UI.

Use Navigation Graph to configure Activity and Fragment,

and inject the previously created DI classes into the Activity or Fragment to be executed,

so that they can use the DI functions.

The above is the thought process for pre-planning the entire development flow.

At this point,

we can start talking about how to write the code!

The previous parts were just some of my experience sharing and suggestions,

now let's officially get into the main topic.
<span id="TLDR"></span>

## Implementation Begins

<div class="c-border-content-title-4">Create Some Basic Classes</div>

Such as BaseApplication, Constants, BaseActivity, etc.

The purpose is to design some common code

Some frequently used initialization stuff is written here

It also makes your main application/BaseActivity class look less cluttered and more readable, or reduces the amount of code you need to write later.

<div align="center">
  <img src="/images/paging/base_directory.png" width="35%"/>
  &ensp;
  <img src="/images/paging/base_application.png" width="30%"/>
</div>

<div class="c-border-content-title-4">Main Architecture</div>
#### a. First develop the DI components and modules related to the application

First, build the basic DI modules

<script src="https://gist.github.com/waitzShigoto/eb5864c365e4e4b184b3084deb41d060.js"></script>

Build the component:

<script src="https://gist.github.com/waitzShigoto/a6ddb1250a9d8df5ab18488f35df38ad.js"></script>

#### b. Develop the module for HTTP requests
Then develop the HTTP connection module

Considering that the app might primarily use HTTP connections later on,

we first set up the HTTP module

The HTTP module looks like this:

<script src="https://gist.github.com/waitzShigoto/6d73385fd8aca0b3ee372100c1a2e1b0.js"></script>

RetrofitClient is a class I encapsulated myself,

it returns a Retrofit instance

Built through a builder and a custom OkHttp builder

to create this Retrofit instance

Since RxJava's Observable will be used later,

we add

RxJava2CallAdapterFactory

during the setup to make Retrofit support RxJava

```Kotlin
.addCallAdapterFactory(RxJava2CallAdapterFactory.create())
```
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>

<div class="c-border-content-title-4">Feature Development</div>

#### c-1. Create the API interface for Retrofit

<script src="https://gist.github.com/waitzShigoto/a63ac4066bfed42d4bd909ed644e23c9.js"></script>

#### c-2. Create the Repository where the actual API calls will be made

<script src="https://gist.github.com/waitzShigoto/ea939951bca958c6c983a1bb8bd226a2.js"></script>

#### c-3. Create ViewModel and anticipate the data to be observed

In this example

the following data needs to be observed

1. UI display status

2. List data to be displayed during paging

<script src="https://gist.github.com/waitzShigoto/3a8b6ec9c0ce4ca6bfd3c5c7d2653748.js"></script>

#### c-4. Create module

<script src="https://gist.github.com/waitzShigoto/f27a22b68b240cc95bc05bb3d2af19be.js"></script>

The @Provides | @Module | @Inject annotations are required for DI

So, depending on different situations or places, you need to add the relevant annotations

#### c-5. Add HTTP module

The previously written HTTP module comes in handy

Add the following code before the module you want to call

```Kotlin
@Module(includes = [HttpModule::class])
```

#### c-6. Create the fragment for displaying the screen

Start creating the fragment and inject the ViewModel

<script src="https://gist.github.com/waitzShigoto/b131256f8612877c48eba6c05c58e4b6.js"></script>

#### c-7. Create the module to be used

This is a step to create a Dagger Component

1. Write a component

2. If you need to use context, you can import the previously created app component

3. Add the module you want to use

<script src="https://gist.github.com/waitzShigoto/63c03346e0d17b76019d9308051904b6.js"></script>

#### c-8. Develop the app's view

The remaining task is to start developing the app's view and paging functionality

Here, I use the official Android paging library for pagination

Using RecyclerView in conjunction with the paging library

First, write a class PagedListAdapter

Then create getItemViewType, onBindViewHolder, onCreateViewHolder:

<script src="https://gist.github.com/waitzShigoto/680faa718048a164879e9926c84d16b6.js"></script>
Create DiffUtil.ItemCallback to determine the differences between new and old data

If different, it will update

Next, create the DataSource.Factory used for paging

<script src="https://gist.github.com/waitzShigoto/27a1befa148117fa009005bd8fae312e.js"></script>
This section is about the use of PageKeyedDataSource,

which has three override methods,

including loadInitial, loadAfter, loadBefore

representing initialization, before loading data, and after loading data respectively

By adding custom data into the pagelist,

you can implement your business logic in these methods,

such as executing an HTTP request during initialization.

For example, create an onResult callback interface

and call this method when encountering loadAfter

to pass the data back to the calling point

```kotlin
callback.onResult(listSearchUser, initPage, nextKey)
```

Of course, how to write this method

can be adjusted according to individual situations

and the results may vary

Here is my example:

<script src="https://gist.github.com/waitzShigoto/95e205701044eb49b16031c4f771df71.js"></script>
