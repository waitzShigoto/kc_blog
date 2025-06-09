---
layout: post
title: "PMs and RDs, Look Here: Starting from Scratch to Develop or Create an App Browser!"
date: 2023-06-08 18:35:06 +0800
image: cover/safe_browser_post-1.png
tags: [Kotlin,Android]
permalink: /safe_browser
categories: 其他筆記
excerpt: "Having a convenient and easy-to-use app browser has become an indispensable part of modern life. This article will explore the direction of developing or creating an app browser solution."
---

## Introduction
<p>

  <div class = "table_container">
    <p>Guide to Creating Your Own Browser</p>
    Having a convenient and easy-to-use app browser has become an indispensable part of modern life.

    This article will explore the direction of developing or creating an app browser solution,

    providing references for collaboration between project management (PM) and research and development teams (RD), ensuring a smooth development process and high-quality results through preliminary research.

  </div>

</p>

<div class="c-border-content-title-4">
    Here are the problems we might encounter
</div>
<p>
<ol>
    <li><b>Requirements</b>
      <ul>
        <li>Want to create an app browser that includes most of the features available in mainstream browsers, such as search, tabs, downloads, favorites, sharing, etc.</li>
        <li>Support for URL filtering, site blocking, etc.</li>
      </ul>
    </li>

    <li><b>Compatibility Testing:</b>
      <ul>
        <li>
        Developing your own browser,

        so you need to ensure that most of the browser's features are present,

        to avoid the embarrassment of other browsers having features that yours lacks...

        </li>

        <li>Developing a web browser might have compatibility issues with various web pages. You can refer to <a href="https://blog.user.today/inapp-browser-webview-problem">this article</a> for more information.</li>

        <li>Need to test whether your self-developed browser supports HTML tags:
          <ul>
            <li><a href="http://beta.html5test.com/">HTML5 Feature Detection</a></li>
          </ul>
        </li>
      </ul>
    </li>

    <li><b>Confirming Requirements for Self-Developed Browser</b>
      <ul>
        <li>Since development hasn't started yet, first confirm the target level for your browser.

          If there is no clear goal for the browser,

          you can research several third-party browsers,

          and decide whether to start from WebView or modify some open-source projects.

          Of course, if you use open-source projects, you also need to pay attention to licensing issues.

        </li>

        <li>
        This table lists the differences between two third-party browsers and a browser developed from WebView.

        It provides references for subsequent requirements and discussions on the actual features needed,

        and helps in deciding whether to use third-party sources or develop independently.

        <img src="/images/browser/001.png" alt="safe browser 01" />

        </li>
      </ul>
    </li>

</ol>
</p>

## URL Content Filtering

<p>

  <div class = "table_container">
    <p>Developing a Secure Browser for an App...</p>
      To implement a secure strategy for the browser, including filtering web browsing content,

      such as restricting access to certain rated websites to make your browser safer...

      you need to filter URLs.
  </div>

</p>

<div class="c-border-content-title-4">
    Reference Directions for Solutions (Recommended for PMs)
</div>

<ul>
  <li>
  Implementing <b>content filtering</b> solutions,

  mainly divided into <b>integrating third-party SDKs</b> and <b>self-implementation</b>,

  </li>

<li><b>Both options need to be considered</b>
    <ul>
        <li>Developing browser content filtering on your own is simpler. If you want to restrict all browsers within the system, you need to consider whether to use auxiliary permission schemes (the following schemes list the implementation methods of competitors for reference). Some vendors use proxy or DNS to solve this issue. However, developing auxiliary permissions or proxies will require **more time**, which should also be taken into account.</li>
        <li>When considering these methods, you need to consider whether they are available on both platforms.</li>
    </ul>
</li>
<li>**Integrate third-party SDK**:
    <ul>
        <li>Different third-party SDKs provide different types of threats. If some types are not provided, you will need to maintain them yourself.</li>
        <li>If using Google's **Web Risk API** (available on both platforms when connecting to the network request API), you need to review the following to understand its rules:
            <ol>
                <li><a href="https://cloud.google.com/web-risk/sla">Web Risk Service Level Agreement</a></li>
                <li><a href="https://cloud.google.com/web-risk/quotas?hl=zh-cn">Quotas and Limits</a></li>
                <li><a href="https://cloud.google.com/web-risk/docs/reference/rest/v1/ThreatType?hl=zh-cn">Threat Types</a></li>
            </ol>
        </li>
        <li>If integrating **Trend Micro HNS SDK**, you need to understand whether the SDK provides the data we target.
            <ul>
                <li>Since this SDK requires contacting the company's customer service, and the development documents are not displayed on the webpage, you can only understand the approximate range provided through the following images:</li>
                <li>Scope and details provided</li>
                <img src="/images/browser/002.png" alt="safe browser 02" />
                <img src="/images/browser/003.png" alt="safe browser 03" />
                <li>System requirements and the range of dual-platform support</li>
                <img src="/images/browser/004.png" alt="safe browser 04" />
                <li>Or you can refer to the analysis of Trend Micro's app below to speculate that the content behavior might be similar to that app.</li>
            </ul>
        </li>
        <li>If integrating **CleanBrowsing**, note the following:
            <ol>
                <li>Supports Android 9.0 and above. Set DNS through the **DNS-over-TLS (DOT) protocol** in the settings: <a href="https://cleanbrowsing.org/help/docs/setup-private-dns-on-android-version-9/">Method</a> (Since this implementation method uses the function within Android, it is speculated that iOS might not support it)</li>
                <li>You also need to contact the company's customer service. Here is the filtering range provided on the website:</li>
                <img src="/images/browser/005.png" alt="safe browser 05" />
            </ol>
        </li>
    </ul>
</li>

<li><b>Develop a content-filtering browser on your own</b>
    <ul>
        You can use some third-party open-source resources, such as `PhishTank` (actual examples are listed below), which provides open-source data that might be phishing websites.
    </ul>
    <ul>Additionally, you need to consider whether the target types provided are as expected. If not, how do you want to maintain them, etc.</ul>
</li>
</ul>

<div class="c-border-content-title-4">
    Development <b>Content Filtering</b> Function Reference (Recommended for RD Reading)
</div>

<ul>
    <li>
        Integrate existing SDKs in the market, such as Google's
        <a href="https://developers.google.com/safe-browsing">Safe Browsing API</a>,
        <a href="https://cloud.google.com/web-risk?hl=zh-cn">Web Risk API</a>, or Trend Micro's
        <a href="https://www.trendmicro.com/zh_tw/business/products/iot/home-network-security-sdk.html">HNS SDK</a>, etc.

        <a href="https://cleanbrowsing.org/filters/">CleanBrowsing</a> can perform filtering by setting DNS.

        Below, we list various methods for developers to reference.

        <ul>
            <li>
                <b>Safe Browsing API</b> (Non-commercial) vs <b>Web Risk API</b> (This solution requires payment)
                <ul>
                    <li>
                        Safe Browsing API is for non-commercial use only. For commercial use, you need to use
                        <a href="https://cloud.google.com/web-risk?hl=zh-tw">Web Risk API</a>.
                    </li>
                    <li>
                        <a href="https://cloud.google.com/web-risk/docs/apis">Web Risk Rest API Documentation</a>
                         : This API checks and filters URLs to see if they are of a threat type, implemented via HTTPS requests during actual development.
                    </li>
                    <li>
                        Types of APIs provided by Web Risk
                        <ol>
                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/update-api?hl=zh-cn">Lookup API</a>
                                : After specifying <b>threatTypes</b> and target URL, the backend queries and returns the threat type and the last valid time.
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/update-api?hl=zh-cn">Update API</a>
                                : Downloads the web risk hash list, stores it locally, allowing developers to check locally and use other APIs to confirm if a match is found.
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/evaluate-api?hl=zh-cn">Evaluate API</a>
                                : After specifying <b>threatTypes</b> and target URL, the backend queries and returns the threat type and trust level.
                            </li>

                            <li>
                                <a href="https://cloud.google.com/web-risk/docs/submission-api?hl=zh-cn">Submission API</a>
                                : Reports URLs considered risky to the server.
                            </li>

                        </ol>
                    </li>
                    <li>
                        Types of threats provided by Web Risk API
                        

                        <img src="/images/browser/006.png" alt="safe browser 06" >
                    </li>
                </ul>
            </li>
            <li>
                <b>HNS SDK</b> This platform does not provide SDK development documentation. If using this solution, you need to contact them for more information (However, after researching the company's security products, it is speculated that this SDK should meet these requirements).
            </li>
            <li>
                CleanBrowsing If using this solution, you may need to understand if it can be set via code for Encrypted DNS – DNS over TLS support.
                <ul>
                    <li>
                        Check the product, it also has auxiliary permissions and admin:
                        <a href="https://cleanbrowsing.org/help/docs/cleanbrowsing-on-android/#step-2-give-accessibility-control-to-app">Process Documentation</a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li>
        <b>Internal Development</b>
        <ul>
            <li>
                URL blacklist, content parsing and filtering data sources
                <ul>
                    <li>
                        There is an open-source maintained third-party phishing site list <a href="https://www.phishtank.com/phish_search.php?verified=u&active=y">PhishTank</a>
                        It appears to be continuously maintained, providing about 70,000 confirmed active phishing sites, and also provides suspected phishing sites.
                        

                        <img src="/images/browser/007.png" alt="safe browser 07" >

</li>
</ul>
  <li>
    <b>
      The official website FAQ states that it can be used commercially
    </b>

    <img src="/images/browser/008.png" alt="safe browser 08" >
  </li>
</li>
<li>
    Refer to competitors to develop URL blacklists and content parsing filters
    <ul>
        <li>
            Later, I checked the <a href="https://www.trendmicro.com/zh_tw/forHome/products/ms.html">Trend Micro Mobile Security app</a> which also provides browser protection features
            

        </li>

        <li>
          It is speculated that it also uses accessibility permissions to obtain the browser URL for corresponding processing

          The place where the app enables accessibility permissions also mentions this method

          <img src="/images/browser/009.png" alt="safe browser 09" width="40%" >
        </li>

        <li>
          Here is a demo to capture the Chrome URL

          First, create Accessibility, then add the <b>target package name</b> in the declaration XML

          Then, in the code, retrieve the EditText to get the URL on the screen:

          <div>
               <img src="/images/browser/010.png" alt="safe browser 10" width = "45%"/>
               <img src="/images/browser/011.png" alt="safe browser 11" width = "45%"/>
           </div>
        </li>

        <li>
          Log of the actual URL obtained

          <img src="/images/browser/012.png" alt="safe browser 12" >
        </li>

        <li>
          Additionally,

          it seems to handle commonly used apps,

          if it is not a commonly used app or difficult to capture the package name,

          the competitor provides an option to select the app to protect,

          and then connects through a VPN (presumably with a proxy or DNS filtering)

          <img src="/images/browser/013.png" alt="safe browser 13" >
        </li>

        <li>
          The app also performs website type filtering,

          it appears to subdivide websites by category for filtering

          <img src="/images/browser/015.png" alt="safe browser 15" >
          <img src="/images/browser/014.gif" alt="safe browser 14" >
        </li>

    </ul>
</li>  
</ul>
</li>
</ul>

## Browser Feature Development Reference
<p>

  <div class = "table_container">
    <p>Custom Browser Guide</p>
    This section is mainly for implementing certain browser features. Currently, I am documenting the ones I have encountered.
  </div>

</p>

<div class="c-border-content-title-4">
    custom tabs
</div>

<ul>
  <li>
  This solution mainly involves,

  using the library provided by Google itself,

  by sending an intent,

  to open the specified URL in Chrome.

  If the device does not have Chrome or a browser that supports custom tabs,

it will still send an intent to invoke the system browser (usually the default browser).

  Additionally, the page using custom tabs will have fixed menu options,

  one of which allows opening in Chrome.

  The customization scope of the page is also limited within Chrome.

  <a href="https://qq157755587.github.io/2016/08/12/custom-tabs-best-practices/"><b>reference</b></a>

  </li>
</ul>

<div class="c-border-content-title-4">
  Browser Whitelist and Blacklist
</div>

<ul>
  <li>
    When setting the webViewClient in WebView,

    if a URL does not meet the restrictions, it will redirect to another page.

     <pre>
     public boolean shouldOverrideUrlLoading(WebView view, String url) {
         if (!isUrlValid(url)) {
             view.loadUrl("file:///android_asset/error.html");
             return true;
         }
         return false; // Returning false means the URL will load normally
     }
     </pre>

  </li>
</ul>

<div class="c-border-content-title-4">
  If You Encounter Version Issues
</div>

<ul>
  <li>
    Set the userAgentString of the WebView,

    and adapt according to the version (but the server of the URL must also support it).

     <pre>
     currentWebView!!.settings.userAgentString = resources.getStringArray(R.array.user_agent_data)[2]
     currentWebView!!.reload()
     </pre>

  </li>
  <li>
    The default browser agent settings in user_agent_data

    <img src="/images/browser/016.png" alt="safe browser 16" >

  </li>

  <li>
    If some web components do not display, check if the component requires JavaScript.

    <pre>
    currentWebView!!.settings.javaScriptEnabled = true // or false
    </pre>
  </li>

  <li>
    To support WebView search,

    you can input the corresponding URL for the target search engine and modify the value at the end.

    <pre>
    Example using Google search:
    https://www.google.com/search?q=search content
    </pre>
    Then provide the user with the option to set the default search engine in the app.

    <img src="/images/browser/017.png" alt="safe browser 17" >

  </li>
</ul>

<div class="c-border-content-title-4">
    If You Want to Use Open Source Directly
</div>

<p>

  <div class = "table_container">
    <p>Modify Through Third-Party Open Source</p>
    Since there are many open-source projects now, many good things are available from others.

    If you can directly modify their projects,

    it can save a lot of time.

    However, you need the capability to make those modifications,

    and when formulating a plan, you need to ensure the open-source license allows commercial use.

    Below are a few I have researched for your reference.

  </div>

<h4>1. <a href="https://github.com/arunkumar9t2/lynket-browser">lynket</a></h4>

<ul>
  <li>License: GNU v3 Public License.</li>
</ul>

<h4>2.<a href="https://github.com/duckduckgo/Android"> duckduckgo </a> </h4>
<p></p>
<ul>
  <li>Currently, the most complete one is duckduckgo.

  Implemented purely in Kotlin, source code is easy to read.</li>
  <li>License: Apache 2.0 license.</li>
</ul>

<h4>3. <a href="https://github.com/scoute-dich/browser">foss browser</a></h4>

<ul>
  <li>License: AGPL-3.0</li>
  <li>Due to license issues, not considered for now.</li>
  <li>It is FOSS, developed purely in Java.</li>
  <li>Has the features of open source.</li>
</ul>

<h4>4. <a href="https://github.com/hazuki0x0/YuzuBrowser">Yuzu browser</a> </h4>
<ul>
  <li>Apache License 2.0</li>
  <li>Implemented purely in Kotlin,

  but when I downloaded the official code to build,

  I encountered some issues with the mac version.

  If anyone else encounters this, adjustments may be needed.</li>
</ul>
</p>
