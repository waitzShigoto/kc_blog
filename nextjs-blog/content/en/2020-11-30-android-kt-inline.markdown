---
layout: post
title: "【Android/Kotlin】Quickly Master the Three Keywords: inline / noinline / crossinline!"
date: 2020-11-30 21:01:43 +0800
image: cover/android-kt-inline-1.png
tags: [Android]
categories: Kotlin
excerpt: "In Kotlin programming, inline, noinline, and crossinline are common keywords. These keywords can be used in function declarations to modify the behavior of functions in different ways, thereby affecting the way the code runs and its performance."
---

## Introduction

In Kotlin programming, inline, noinline, and crossinline are common keywords.

These keywords can be used in function declarations,

to modify the behavior of functions in different ways,

thereby affecting the way the code runs and its performance.

This article will provide a detailed introduction to the usage and differences of these three keywords,

along with relevant code examples and practical application scenarios.

<div class="c-border-content-title-4">inline</div>

The actual function of inline,

is that during compilation, the content of the function using inline will be directly copied to the execution point,

instead of directly instantiating an object.

Using inline reduces object instantiation to improve performance.

To put it simply, we write a function like this:

<script src="https://gist.github.com/waitzShigoto/626f82a8e911cb4ab227f0bffc4220b9.js"></script>

However, if you directly add inline to a function that takes regular variables,

some IDEs might remind you that using it this way

will not improve performance.

For example, in the demonstration below,

only regular variables are passed in and inline is used,

the compiler gives a yellow warning,

indicating that passing in function type variables is expected to effectively improve performance.

<div align="center">
  <img src="/images/inline/inline-02.png" alt="Cover" width="1000%"/>
</div>

So, let's try writing a function that takes a function type variable,

and another function with inline, like this:

<script src="https://gist.github.com/waitzShigoto/0b924c1634435c157fba4a73f3c4afc9.js"></script>

After executing these two, you will find the returned results are the same,

but in reality,

if you decompile this code (as shown below),

you will find that without using inline,

the program creates a new instance for your lambda function during execution,

which means a new object is instantiated.

If you have a piece of code that needs to repeatedly use this function,

it will repeatedly create objects,

thus potentially consuming more performance to handle this lambda function.

So, using inline can reduce this performance consumption.

<script src="https://gist.github.com/waitzShigoto/0edf38ee27045d23b0b490ca4381f286.js"></script>

Tip: **(Function1）null.INSTANCE** is displayed because the decompiler cannot find an equivalent Java class.

From the above example, it is clear that using inline with lambda functions

can improve processing performance.

But when should we actually use it? Here is an example:

Suppose you have a scenario where you need to repeatedly call a function with a lambda. A less experienced person might write it like this:

<script src="https://gist.github.com/waitzShigoto/6f5a374bee3a35b754d5f551b170f969.js"></script>

As you can see, after decompiling,

you will see that although you achieved repeated execution 10 times,

you also created the same object 10 times.

So, with more experience, you can:

**1. Create the lambda function outside the loop**

This can also improve performance, but since you are using Kotlin, using inline is also an option.

<script src="https://gist.github.com/waitzShigoto/c7535ba99806202c354e571447b99c68.js"></script>

**2. Using inline to create:**

<script src="https://gist.github.com/waitzShigoto/ad7d6e31cce3d9badd7cc9b2fa36b57a.js"></script>

In this way, you can see the advantages of using inline,

Alright, let's talk about the differences between noinline and crossinline,

Actually, these two keywords are used to assist inline,

Unlike inline, which is added in front of fun,

They are used to set function types (or lambda functions).

<div class="c-border-content-title-4">noinline</div>
The concept of noinline is actually simpler,

Once you understand inline, you'll see why I say these two are auxiliary,

The purpose of this,

Is when an inline function contains multiple function types,

You can control which lambda uses inline, for example:

<script src="https://gist.github.com/waitzShigoto/b6f489a19d880c3a6f89e53d90521dd5.js"></script>

Therefore, you can choose whether to use inline based on your needs.

<div class="c-border-content-title-4">crossinline</div>
First, a preliminary concept:

When you use a lambda function,

If you add a return inside the declared lambda function,

It will cause the place where the lambda function is used to directly return from that function:

<script src="https://gist.github.com/waitzShigoto/e9fdbb9fc2aefe4841853b23d1db8714.js"></script>

At this time, if you don't want to exit the entire inline function,

You can use something like the code above, directly changing the original return to return@getMinutesWithInline,

This will only exit the declared lambda function.

Or you can use the crossinline keyword,

It is also used to modify lambda functions,

And is also an auxiliary to inline,

Its function is to prevent a return from directly exiting!

<script src="https://gist.github.com/waitzShigoto/940839c5f5bbaf854a0c243748192758.js"></script>

## Conclusion
Using inline

Can reduce the repeated creation of instances when calling lambda functions

Thereby improving efficiency

Using inline can avoid creating too many instantiated objects

Using noinline allows a lambda not to use inline

Using crossinline can prevent a return in a lambda from affecting the external program flow

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">inline / noinline / crossinline Sample Code</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/KuanChunChen/KC_InlineDemo/blob/master/app/src/main/java/k/c/horialtal/move/sheet/kc_inlinedemo/InlineUtil.kt">
Sample Code</a>
        </div>
    </div>
</div>
