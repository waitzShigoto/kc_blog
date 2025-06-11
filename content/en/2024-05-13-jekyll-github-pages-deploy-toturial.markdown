---
layout: post
title: "【Deployment Guide】Migrating Github Pages to Jekyll 4.x and Above - Applicable May 2024"
date: 2024-05-13 14:21:13 +0800
image: cover/jekyll_github_deploy.png
tags: [Jekyll,html,githubpages]
permalink: /jeykll_deploy_4_x
categories: Jekyll部署
excerpt: "This article provides a detailed guide to help you migrate your Github Pages website to Jekyll 4.x and above. It covers each step of the configuration process to ensure you can upgrade smoothly and enjoy the powerful features of the latest Jekyll version."
---

## Introduction
I recently made some modifications to the layout of my website

and wanted to use the rgb() function in CSS

but I found that this feature was not available in Jekyll 3.9.x

which forced me to upgrade the Jekyll version to 4.x and above

After upgrading, I was quite excited

running `bundle exec jekyll serve` locally for testing

everything seemed to be working fine

However, when I pushed the changes to the GitHub repository

I encountered some trouble

an error message appeared when deploying to GitHub Pages

`GitHub Pages: github-pages v231 GitHub Pages: jekyll v3.9.5 `
<img src="/images/jekyll_deploy/001.png" alt="jekyll deploy 4.x" />

It turned out the problem was with the GitHub Pages configuration

which prevented me from successfully deploying updates with the default configuration

Considering that GitHub Pages is a free service with usage limitations

it makes sense that it does not `by default` support newer versions of Jekyll

so I had to manually adjust it myself

Below are my notes after multiple failed attempts

<img src="/images/jekyll_deploy/007.png" alt="jekyll deploy 4.x" />

finally achieving a build success

sharing with everyone

## Deployment Steps
<div class="c-border-content-title-1">1. Adjust Deployment Method</div>

First, go to your deployment repo

and enter the settings page

<img src="/images/jekyll_deploy/002.png" alt="jekyll deploy 4.x" />

Then sequentially click on Pages under Code and automation
Select GitHub Actions under `Source`

<img src="/images/jekyll_deploy/003.png" alt="jekyll deploy 4.x" />

Then you need to start configuring your environment...

<div class="c-border-content-title-1">2. Set Ruby Version</div>

When building a Jekyll project, you will need Ruby

After installing Ruby, the system will have a default version

When you build Jekyll

without specifying a Ruby version

Jekyll will use the default system version

So use this command to check your version
<script src="https://gist.github.com/waitzShigoto/9002c7e6d63823d0c59dc2c4720e323d.js"></script>

We need to deploy to GitHub and use Jekyll 4.x

so we need Ruby version 3.2.3

If you don't have version 3.2.3, you can use some tools to install it

However, since my computer happens to have rbenv installed

I will use rbenv as an example

<script src="https://gist.github.com/waitzShigoto/e02a03b088c850d4c4bb6802295d7704.js"></script>
Of course, you can also use other common command-line tools

such as RVM, chruby, or asdf

Adjust and install Ruby according to your own habits~

Finally, you need to create a file `.ruby-version`

in the root directory of your Jekyll project

You can use a command similar to the one below directly

<script src="https://gist.github.com/waitzShigoto/bce26899b505b01d4380bbbd2ae29ebb.js"></script>

Or you can create it manually if you prefer

<img src="/images/jekyll_deploy/004.png" alt="jekyll deploy 4.x" />

The file content is just the version number

<img src="/images/jekyll_deploy/005.png" alt="jekyll deploy 4.x" />

<div class="c-border-content-title-1">3. Build Jekyll Project</div>

After installing Ruby, start configuring the Jekyll project

First, you need to make the following settings in your `Gemfile`

Import Ruby version 3.2.3

`ruby "3.2.3"`

Then set the Jekyll version to use

`gem "jekyll", "~> 4.3.3"`

The required command is as follows:

<script src="https://gist.github.com/waitzShigoto/b64bfac8864bd597792c65ec75b9f099.js"></script>

Here is the complete configuration

For your reference

Including some Jekyll plugins I use

Add them if you need them

<script src="https://gist.github.com/waitzShigoto/67631c36472fc3781800e847033d5250.js"></script>

Next, execute the following in your Jekyll root directory

<script src="https://gist.github.com/waitzShigoto/f860bebfabda529bd7bb3d21e51467ae.js"></script>
The purpose is to generate the `Gemfile.lock` file

And ensure your project runs smoothly

After generating, you can use

`bundle exec jekyll serve` to test if it runs successfully

If successful, the following message will be displayed

<img src="/images/jekyll_deploy/006.png" alt="jekyll deploy 4.x" />

<div class="c-border-content-title-1">4. Configure GitHub CI File</div>

Finally,

We need to set up the GitHub auto-deployment configuration file.

Usually, `.yml` is used for configuration.

Here is the official recommended initial Jekyll configuration: <a href="https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml
">Official Recommendation</a>

All we need to do is modify a few lines in the official recommended `.yml` file:

- Adjust the target branch:

  `branches: ["master"]`

- Specify the current Ruby version:

  `uses: ruby/setup-ruby@v1`

- Ruby version:

  `ruby-version: '3.2.3'`

Here is my final complete `.yml` configuration

You can use and modify it directly

<script src="https://gist.github.com/waitzShigoto/4f7e0968d7028a9c23e5749db9cc91e8.js"></script>

## Summary
The steps are actually very simple

You just need to set up the Ruby environment, Jekyll, and GitHub environment

Finally, use `git push remote branch` to push your patch

This will trigger GitHub Actions to build your website

And with the deployment settings, it will automatically deploy to GitHub Pages

However, the deployment settings are already provided in the official example

The only things you need to change are the Ruby environment and the target branch~

Success
<img src="/images/jekyll_deploy/008.png" alt="jekyll deploy 4.x" />
