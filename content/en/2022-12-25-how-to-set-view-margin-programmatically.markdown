---
layout: post
title: >-
  Quickly Learn to Adjust Element Spacing in Android Apps - Using Kotlin
  Extension Code to Set Margins
date: '2022-12-25 17:05:12 +0800'
image: cover/kotlin-clear-code-maring-layout-xml-constarint-layout-1.png
tags:
  - Android
  - Extension
  - Kotlin
permalink: /clear_use_extension_to_set_margin
categories: ProgrammingLang
excerpt: >-
  In Android apps, adjusting element spacing is a common requirement, and using
  Kotlin extension code to set margins can achieve this quickly and easily. In
  this article, we will learn step-by-step how to use this technique to make
  your app look more beautiful and professional.
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Introduction</h1>

Today, I want to share a super simple trick with you,

which allows you to adjust the spacing of elements in an Android app using `code`.

This method is not only convenient but also makes your design more beautiful.

Even if you are a beginner engineer, you can easily master it!

Follow along with me to learn!

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Basic Method</h1>

There are various ways to adjust element spacing in Android, and this article will introduce the method of using Kotlin extension code to set margins.

Before that, let's understand

that setting view margins in XML

is as simple as one line:

`android:layout_marginLeft="30dp"`

In some cases,

when the client requires you to dynamically set the spacing between Android View elements,

you can usually use the following method:

<script src="https://gist.github.com/waitzShigoto/60e47ade8cf051643f9075e8157c6ded.js"></script>

This method requires instantiating a LayoutParams

and setting the top, bottom, left, and right margins before setting it to your View.

But if you need to use this margin-setting method in multiple places,

it will make the code lengthy and hard to maintain.

To solve this problem,

you can use Kotlin Extension to implement the margin-setting method,

making your code more concise and easier to maintain.

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Using Kotlin Extension to Achieve This</h1>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step 0. Here is the complete extension function</h4>
<script src="https://gist.github.com/waitzShigoto/b884affe0c15221ec627ae3faa3c1dfa.js"></script>

<p class="table_container">
  This code is ready to use.

  Copy it into your project,

  and call it directly on your view!

  vb.btConfirmZero.margin(top = 0F)

  vb.btConfirmOne.margin(bottom = 30F, right = 2F)

  vb.btConfirmTwo.margin(bottom = 10F, left = 3F)

  <a class="link" href="#step5" data-scroll>If you understand this, you can skip directly to step 5.</a>
</p>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step 1. How to Implement It?</h4>
<div class="c-border-content-title-4">
  First, create a function as follows
</div>

<script src="https://gist.github.com/waitzShigoto/9aec2350bcd7231a162da047508d76be.js"></script>

<div class="table_container">
  <p>Explanation of the above code</p>
  <ol class="rectangle-list">
    <li>
      <a href="https://kotlinlang.org/docs/lambdas.html#function-types" target="_blank">
        Here we pass in a function type named block

        It is actually a type of Kotlin variable (other languages might have it too, but Java does not support it yet)

          <b style="color:blue;">(For an explanation of function types, refer to: click here)</b>

          Using function types allows you to operate with lambda (Java has lambda, but currently does not have function types)
      </a>
    </li>

```markdown
<li>
  <a href="javascript:void(0)">
    Here we use generics

    and use type conversion to convert generics

    It may cause errors because it is considered implicit type casting during compilation

    Therefore, if there is no explicit class

    Direct casting may encounter

    <b style="color:red;">`xxxxClass cannot be cast to zzzzClass` </b> this kind of error

    Or some compilers will directly prompt you with a <b style="color:red;">`unchecked cast`</b> warning

    Of course, you can also pass in clazz: Class or similar to determine what the actual class is

    But this will make the code more verbose

    When there are many classes, you will write more code and keep doing repetitive things... etc.

    So here we use `reified` as a solution

    It is a usage provided by Kotlin to solve such problems

    -> Using reified requires `inline`

  </a>
</li>
</ol>
</div>

<div class="c-border-content-title-4">
  After that, we can call it like this
</div>

<script src="https://gist.github.com/waitzShigoto/c5ef3ee7159011e92c8d17be233cf6a8.js"></script>
<div class="table_container">
  <p>Explanation of the above code</p>
  <span>
    This is actually to accommodate different <b>ViewGroup.LayoutParams</b>

    So that in the future, if there are more instances that inherit <b>ViewGroup.LayoutParams</b> and want to operate

    It can be more flexible

  </span>
</div>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step2. Write a method to convert dp to px</h4>
<script src="https://gist.github.com/waitzShigoto/52153b7712fde5257aaeab83b3c2ce7f.js"></script>

- This is very simple
  Mainly to match the use of pixels when setting margins
  So a conversion method was written

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step3. Modify the layout parameters through the extended layoutParams</h4>
<script src="https://gist.github.com/waitzShigoto/b64909a750c6a73306a1d1885f763f67.js"></script>
<div class="table_container">
  <p>Explanation of the above code</p>
  <span>
    Here we use the newly written <b>View.layoutParams</b> to operate the view we want to set

    Previously in Java, setting parameters always required inputting all four parameters (left, top, right, bottom) at once

    Therefore, here we use

    <b>left: Float? = null, top: Float? = null, right: Float? = null, bottom: Float? = null</b>

    to default all four margin positions to null

    Then use Kotlin's null safety feature to check, such as

    <b>left?.run { leftMargin = convertDpToPixel(this) }</b>

    Only set the margin value if there is a value

    We don't have to worry about null exceptions and can flexibly input only the positions we want to change

  </span>
</div>

<h4 id="step5" style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step5. Finally, use it easily</h4>

<script src="https://gist.github.com/waitzShigoto/6e721513ab6c92dc05ab2e61ef716c1f.js"></script>
```

It looks like you haven't pasted the Markdown content yet. Please provide the text you want translated, and I'll get started on the translation for you.
