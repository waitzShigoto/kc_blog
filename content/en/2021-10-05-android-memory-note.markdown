---
layout: post
title: "[Android][Memory] Memory Optimization + GC Management Concepts Sharing"
date: 2021-10-05 17:42:21 +0800
image: cover/ea-website-android-memory.png
tags: [Android,Kotlin]
categories: Android教學
---

Today's post

I plan to take notes

to record what I understand about Android memory management

I intend to keep updating this note

If I learn more about Android memory management

I want to consolidate it in this one post

<h2>Android Memory Note</h2>

heap:

The Android virtual machine continuously tracks memory allocation in the heap

The heap is a block of memory used to store system-allocated java/kotlin objects

garbage collection (gc):

Its goal in Android is to achieve the following:

* Find unused objects
* Reclaim the memory used by these objects and return it to the heap

In a multi-task environment

Android limits the size of each heap

This size is determined by the amount of available RAM on the Android device

Additionally

When the heap is full

If the system still tries to allocate memory

It may result in an OutOfMemoryError

<h2>Frequent Garbage Collection</h2>

Previously, I read an article that also referred to GC as memory churn

In other words

GC usually occurs when memory is needed in a short period

Due to insufficient heap space

It needs to allocate heap space for the app

While simultaneously freeing up heap space to compensate for the shortage

So frequent GC triggers can also cause memory-related issues

For example:

At the same time

The app needs to allocate a large amount of memory space for the objects you create

But due to insufficient heap space

GC is triggered to reclaim heap space

But in the back-and-forth iterations

The app gets stuck

Usually, it won't show an OOM

But it causes lag or crashes

Leading to a poor user experience

Here's an example with code:

<script src="https://gist.github.com/waitzShigoto/5654e03a5aa77334bf536c298fe0df88.js"></script>

This is a common implementation of a recycler view adapter

The bind() method is used to implement the logic for generating new items

```
val demoBitmap = BitmapFactory.decodeResource(itemView.context.resources, R.drawable.bg_demo_photo)
```
In this bind() method, there is a fixed image to be loaded into the item

If placed here

It means that each time bind() is called, the item will reload the bitmap image

In small projects or with a few images, you won't notice much difference

But with a large number of repeated loads

Or when there are 100 or 1000 items

Each one reloading

It consumes a significant amount of heap space

Therefore, the simplest way is to load fixed items only once

<script src="https://gist.github.com/waitzShigoto/baac7167d917ce9633f7d9346b3244ed.js"></script>

Or you can use some third-party libraries to cache the images

Reducing the number of loads

Of course, using cache can also cause OOM

So you need to define or clear the cache under specific conditions

You can optimize based on the issues encountered in the project

<h2>Android Memory Leak</h2>

gc cannot clear object leaks with references

Because it thinks some places might still need this reference

This situation is commonly referred to as a memory leak

Inner Classes: When inner classes have references to outer classes, it can cause memory leaks

For example:
<script src="https://gist.github.com/waitzShigoto/f7cf2cefdda47552aef1ea21ac0f1e37.js"></script>
Like the code above

Because the inner class accesses the outer showResult

And since AsyncTask runs in the background

The activity might have finished

But AsyncTask is still running

This can cause a memory leak

Solution to this problem

You can remove the method call to the external class

or use other methods to access the external class

such as using weak references

<script src="https://gist.github.com/waitzShigoto/14c2eb371a77d2a2425180dd865a2ebe.js"></script>

Using weak references can still access the external class

but it won't be as strong as a strong reference, so it won't persist in memory

When the garbage collector (GC) does not find a strong reference to the object, it will look for it and set it to null

Anonymous Classes: Some anonymous classes live longer than the external class

causing memory leaks

Static Variables: Using companion objects or static to modify certain classes

will cause the object to load initially

and then not be released

leading to memory leaks

for example, static activity
