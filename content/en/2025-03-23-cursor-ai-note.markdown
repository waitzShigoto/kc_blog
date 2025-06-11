---
layout: post
title: "Using Cursor IDE to Assist Code Development"
date: 2025-03-23 09:29:10 +0800
image: cover/cursor-ide-cover.svg
tags: [cursor]
permalink: /cursor-ai-note
categories: cursor
excerpt: "What is Cursor?"
---

## Actual Results
* App development is possible `without writing code yourself` through AI chat integrated into the IDE
<img src="/images/cursor/001.gif" alt="flutter">

* You can also interact with AI for `specific parts only`, using `cmd+k` directly at the `cursor position in the editor`.
<img src="/images/cursor/002.png" alt="flutter">

#### Table of Contents
* [Features](#feature)
* [Usage Steps](#usage-steps)
* [Results](#results)
* [Usage Techniques](#tips)
* [Sharing Personal Cursor IDE Settings](#personal-config)
* [Thoughts](#thoughts)
* [Useful Sites](#useful-sites)

<a id="feature"></a>
## Cursor Features
* Cursor is an `IDE` built on vscode
  - It has built-in AI chat functionality that allows AI to develop programs and `directly modify files`
  - You can `specify files in chat to provide them as references for AI`, resulting in more accurate results
  <img src="/images/cursor/003.png" alt="flutter">

* Cursor supports common LLM settings
   - You can develop using the AI you're familiar with

<img src="/images/cursor/004.png" alt="flutter">

   - You can also use your own API keys

<img src="/images/cursor/005.png" alt="flutter">

* `Cursor Tab`: The IDE suggests based on your code while coding. Similar to tab completion or suggestions in other IDEs.
    - `Free users`: Limited to 2000 suggestions, free of charge.
    - `Professional and Business users`: Unlimited Cursor Tab suggestions available after payment.
* `Cursor Composer`: Write program code directly in the IDE to modify files, providing a `true` experience of writing code with just prompts.
* `CmdK`: Use AI directly in the IDE's code editing page to modify code. Use the shortcut key `cmd+k` directly at the cursor position
  <img src="/images/cursor/006.png" alt="flutter">

* `.cursorrules`: Set `basic rules` for AI, making AI development more accurate and reducing errors.
    - Create a `.cursorrules` file in the `root directory` and set related prompts
    - Or set global rules directly in `setting > General > Rule for AI`
* `.cursorignore`: Set `files to ignore` for AI.
* You can enter `@` in chat to incorporate relevant references
  <img src="/images/cursor/007.png" alt="flutter">

<a id="usage-steps"></a>
## Usage Steps
* First, `download and install` cursor from the official site: https://www.cursor.com/
* Open your project
    - Click open project to open your project

      <img src="/images/cursor/008.png" alt="flutter">

* Click <img src="/images/cursor/009.png" alt="flutter">
 in the upper right to expand the chat window
  Or use the shortcut key `CTRL / CMD + l`

  <img src="/images/cursor/010.png" alt="flutter">

* Cursor's feature is that you can specify files for AI to reference. Click `+ Add context` to select files

  <img src="/images/cursor/011.png" alt="flutter">

  <img src="/images/cursor/012.png" alt="flutter">

* Or type `@codebase` directly in the dialog box, and cursor will use the entire codebase as a reference

  <img src="/images/cursor/013.png" alt="flutter">

* Other features are similar to general AI chat, such as switching llm models and uploading images

  <img src="/images/cursor/014.png" alt="flutter">

* Enter what you want AI to help with
    - Example: A commonly used method is to input an image to AI, add a prompt, and let AI create it

      <img src="/images/cursor/015.png" alt="flutter">

* Next is a process similar to code merging, where you review the changes made by AI
    - You can click accept or reject directly in the chat window

      <img src="/images/cursor/016.png" alt="flutter">

    - Or you can navigate directly to the file and click

      <img src="/images/cursor/017.png" alt="flutter">

<a id="results"></a>
## Results
* Results generated with `claude-3.5.sonnet` are very close to the UI diagram
    - All you need to do later is adjust the spacing, size, color, image resources, and code cohesion review for each component based on `details set in UI/UX`

      <img src="/images/cursor/018.png" alt="flutter">

* Or if you have new strings, it's also convenient to have AI generate them first and then fine-tune them later

  <img src="/images/cursor/019.png" alt="flutter">

<a id="tips"></a>
## Usage Techniques
#### Properly utilizing `.cursorrules` and `.cursorignore`
* Setting up `.cursorrules`
    - (Global) You can set cursor rules in setting > General's Rules for AI
      <img src="/images/cursor/020.png" alt="flutter">

    - (This project only) Another way is to create `.cursorrules` in your project
      <img src="/images/cursor/021.png" alt="flutter">

    - Project rule (project-specific rules): Setting > Project Rule > +Add new rule > Directly enter a file name and press Enter, and a .mdc file will be created in `../.cursor/xxx.mdc` in your project
      <img src="/images/cursor/022.png" alt="flutter">

* Setting up `.cursorignore`
    - [Documentation](https://docs.cursor.com/context/ignore-files)
    - Create a `.cursorignore` file in the `root directory` and add files/folders you want to ignore

      <img src="/images/cursor/023.png" alt="flutter">

    - The rules are similar to .gitignore, and when set, cursorAI will not include the specified files when `indexing (or scanning)`
        - This saves wasted time scanning unnecessary files
        - You can also add sensitive data or files to prevent leaking confidential information or uploading to AI provider servers
        - However, the official documentation states that they are currently striving to achieve maximum ignoring of indices

          <img src="/images/cursor/024.png" alt="flutter">

          Trying to achieve the following to the maximum extent

          <img src="/images/cursor/025.png" alt="flutter">

    - This is based on .gitignore and will use it as a foundation if `.gitignore` already exists
    - If you can't find the location, you can find it in the IDE under `Cursor Setting > Feature > Codebase indexing > Ignore file > Configure ignored files`

      <img src="/images/cursor/026.png" alt="flutter">

* `.cursorindexingignore`
    - This file automatically inherits related content from .gitignore
        - Knowing that cursor indexes and references the codebase, the concept of this file is mainly to exclude large files or binary files unnecessary for development to improve the overall performance of chat

          <img src="/images/cursor/027.png" alt="flutter">

    - Also, unnecessary files are set by default, but the content is long, so check the [documentation](https://docs.cursor.com/context/ignore-files) as needed

      <img src="/images/cursor/028.png" alt="flutter">

* `.cursorignore` and `.cursorrules` settings can be downloaded from git for reference
  http://192.168.201.72:8080/admin/repos/CursorConfig,general

#### AI Chat
* If your input is too large for AI to process, it's recommended to break it down into smaller parts, narrow the scope, or write more specific prompts.
* In the Cursor chat window, you can enter `@` to set specific types of content as references for AI
    - Example: With `@Doc`, you can add documents as references. If you have third-party APIs, you can pass them directly for reference (currently, @Doc only supports adding URL-type documents)

      <img src="/images/cursor/029.png" alt="flutter">

      <img src="/images/cursor/030.png" alt="flutter">

* Utilize `git`: Save file changes frequently. Since cursor modifies files directly, if you find that something doesn't meet requirements after accepting, you can revert to a previous point (`suitable for overall changes`)
* Utilize `restore` in the `chat room`: You can restore modification results made in the current conversation (`suitable for single changes`)

  <img src="/images/cursor/031.png" alt="flutter">

#### Settings
* You can enable privacy mode in the dropdown menu at `Cursor setting > General > Private mode`

  <img src="/images/cursor/032.png" alt="flutter">

* If you have an MCP Server you want Cursor to reference, you can add it at `Cursor setting > feature > MCP Server`

  <img src="/images/cursor/033.png" alt="flutter">

* You can add corresponding documents at `Cursor setting > feature > Docs` to make them default reference items for AI chat

  <img src="/images/cursor/034.png" alt="flutter">

#### Git

* Cursor IDE provides a git gui called `source control` that allows you to perform git operations with clicks

  <img src="/images/cursor/035.png" alt="flutter">

    - The `right edge` of the commit message field has a `generate commit message` feature that generates based on commit messages in the current git graph

      <img src="/images/cursor/036.png" alt="flutter">

    - However, in current experiments, it can't generate AirDroid's default template, even with the default format added to local git.
      `Expected`:<img src="/images/cursor/037.png" alt="flutter">

      `Actual`:<img src="/images/cursor/038.png" alt="flutter">

* Another method is to use `@Commit generate commit message` in `Chat` to generate specified formats. This has been experimentally confirmed to generate our default templates

  <img src="/images/cursor/039.png" alt="flutter">

<a id="personal-config"></a>
## Sharing Personal Cursor IDE Settings
* Change the left side of the IDE to `vertical`
    - Open the command function with shortcut key `CTRL/CMD + Shift + P`
    - Enter `Setting.json` and click `Preferences: Open User Settings (JSON)`

      <img src="/images/cursor/040.png" alt="flutter">

    - Add key `workbench.activityBar.orientation`, value `vertical` to the Json file, and restart Cursor

* `.cursorrules`
    - Add according to each project's requirements. Here are some commonly used ones I'll share
      ```
      - Don't make assumptions. 
      - Don't silently fix errors
      - Use my existing theme for colors,typography and spacing. 
      - Ask questions when uncertain about my code or design. 
      - Provide a list of tasks for accomplishing an implementation.
      - always include a :) at the end of your response
      ```
      (The `include a :)` here is a way to check if the current `.cursorrules` is effective)
    - Generate using the [cursor directory](https://cursor.directory/) on the internet
* Installing plugins
    - Cursor is currently based on vscode and doesn't have kotlin-related resources by default. To have kotlin recognized in cursor,
      download the plugin (this won't affect AI performance, but allows the IDE to identify .kt files)
    - Find and search for `MARKPLACE` or `EXTENSION`
    - Install other plugins (like git, java, etc.) according to your needs

      <img src="/images/cursor/041.png" alt="flutter">

<a id="thoughts"></a>
## Thoughts
* Cursor IDE integrates multiple features, simplifying the AI development process. It has features like directly applying AI suggestions to existing projects
    - Unfortunately, since this is an IDE extended from `vscode`, it lacks Android-related features like Android Studio
    - Advanced users overseas use cursor to generate code and AS to build and debug code. Example: [I Made an Android App in MINUTES with This AI Tool](https://www.youtube.com/watch?v=FbCA_qQSvYM)
* If you're doing a project in a language you're encountering for the first time `not Android development`, `theoretically` you can know where to place files faster and get started more quickly. Also, `even people who don't do related work can learn development quickly`.
* While generating with AI is certainly convenient, I recommend understanding why it's written that way. This way, you can decide whether to accept AI's approach.
* [Pricing](https://www.cursor.com/cn/pricing): There's a free usage limit, so try it first to see if it fits your development style before deciding to purchase.

  <img src="/images/cursor/042.png" alt="flutter">

* My free period ended, and `cursor composer` was locked, and I could no longer use the previous AI models XD.
  However, completely free `chat` (chat-only available) is provided, and if you set the model to `cursor-small`, you can still use it for free.

  <img src="/images/cursor/043.png" alt="flutter">

<a id="useful-sites"></a>
## Useful Sites
* [cursor usage documentation](https://cursor.document.top/tips/usage/basic-setting/)
* [cursor directory](https://cursor.directory/): You can search for some `.coursorrule` settings
* [cursor list](https://cursorlist.com/): You can search for some `.coursorrule` settings
* [cursor maker](https://cursorrules.agnt.one/chat): Use AI chat on the web to generate `.coursorrule` settings
* [Generate Cursor Project Rules](https://cursor.directory/generate): Use AI chat on the web to generate `.mdc` settings
* [User-compiled cursor rules](https://github.com/PatrickJS/awesome-cursorrules) 