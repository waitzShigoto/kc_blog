---
layout: post
title: "ChatGPT Tutorial - Integrating Line Bot with Open AI ChatGPT"
date: 2023-02-02 16:24:56 +0800
image: cover/kotlin-cht-gpt-line-bot-open-ai-1.png
tags: [OpenAI,Chat GPT,AI]
permalink: /easy_use_chat_gpt_with_line_bot
categories: AI
excerpt: "The wave of Chat GPT is rising, integrate Chat GPT into your messaging app chat room and make it work for you!"
---

<div class="c-border-main-title">Introduction: Chat with ChatGPT</div>

<div align="center">
  <div class="c-border-content-title-4">1. Register an account, click Sign Up to register: <a href="https://chat.openai.com/auth/login" target="_blank">ChatGPT Login Page</a>
</div>

  <img src="/images/linebot/line_bot_0000.png" width="60%"/>

  <div class="c-border-content-title-4">2. Create your Account</div>

  <img src="/images/linebot/line_bot_00000.png" width="45%"/>

  <div class="c-border-content-title-4">3. Start chatting, enter your question in the dialogue box below</div>

  <img src="/images/linebot/line_bot_009.png" width="70%"/>

  <div class="c-border-content-title-4">4. For example... Predicting the 2023 WBC Championship</div>

  <img src="/images/linebot/line_bot_010.png" width="70%"/>

  <div class="c-border-content-title-4">5. Or... How to write a prediction program in Kotlin?</div>

  <img src="/images/linebot/line_bot_011.png" width="70%"/>
  <img src="/images/linebot/line_bot_012.png" width="70%"/>
  <img src="/images/linebot/line_bot_013.png" width="70%"/>
  <p>&#11014; It looks like ChatGPT provided an example for predicting weight based on height, which seems quite decent</p>

</div>

<h5>This powerful AI can answer all sorts of questions, but how can you make it work for you? Let's continue...</h5>

<div class="c-border-main-title">Try Integrating the ChatGPT API</div>

<div align="center">
  <div class="c-border-content-title-4">
    1. Register an account and get API keys: <a href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI Login Page</a>
  </div>

  <img src="/images/linebot/line_bot_014.png" width="30%"/>

  <p>&#11014; After clicking, you will see the above interface by clicking on the avatar in the top right corner. Click View API keys</p>
  <img src="/images/linebot/line_bot_015.png" width="60%"/>

  <p>&#11014; Click Create new Security key, this key will be used to verify your identity when calling the API</p>

  <div class="c-border-content-title-4">
    2. Next, you can check the official API documentation:
    <a href="https://platform.openai.com/docs/api-reference/models/list" target="_blank">OpenAI API Documentation</a>  
  </div>

<p>Refer to the documentation to see how to integrate, and follow the instructions provided in the documentation.</p>

<img src="/images/linebot/line_bot_017.png" width="45%"/>

<p>However, if you have some experience with curl or API requests, you can directly find the curl examples provided by the official documentation and convert them into the language you are familiar with.</p>
<img src="/images/linebot/line_bot_016.png" width="45%"/>

<pre style="text-align: left;">
<code>
curl https://api.openai.com/v1/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $YOUR_API_KEY" \
-d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}'
</code>
</pre>

<p class="table_container">
&#11014; A quick introduction to the meaning of the above curl command:

1. The URL we need to send the request to is https://api.openai.com/v1/completions

2. If you want to break it down further, you can see it as the domain name https://api.openai.com/ and the API endpoint v1/completions

3. The part in the middle with -H is the Header

Content-Type: application/json indicates that the format of our request body should be JSON

Authorization: Bearer $YOUR_API_KEY is the API key you need to use to authenticate with the OpenAI API

This is the key we generated earlier

4. -d '{....}' The -d at the end is the JSON format to be sent to the endpoint, and the content inside the {} is the JSON data to be sent

5. Simple JSON key explanation:

model: This is the model of ChatGPT. The official documentation provides different models for integration,

each with its own maximum tokens, pricing, and reliability. You can test them according to the documentation:
<a href="https://platform.openai.com/docs/models/gpt-3" target="_blank">GPT-3 model documentation</a>

prompt: This is the question you want to ask, similar to what you would input directly into the ChatGPT web chat,

but now you are sending the request programmatically

max_tokens: This is the maximum number of tokens you want to limit for this request,

as the official pricing is likely based on the number of tokens,

so you can use max_tokens to control the usage,

which might be useful for those who plan to use the API long-term to manage their usage.

(Note: The tokens here are used by the official documentation to calculate usage and billing, and are not the same as the tokens commonly used for authentication.)
</p>

<div class="c-border-content-title-4">
3. At this point, you have obtained everything you need to integrate with the OpenAI API...
</div>

<p>You can start developing the API using the language you are familiar with.</p>
<p>Kotlin program for integrating with the OpenAI API</p>

<script src="https://gist.github.com/waitzShigoto/4bcd72e0ba21a76eb545112113be7cfa.js"></script>

<p class="table_container">
&#11014; Here, I prefer to extract reusable code into separate files, such as ChatGptAPI.kt, ChatGptCompletionRequest.kt, ChatGptCompletionResult.kt, etc.

Since this is not a large project, I didn't bother writing thread operations myself.

I used the simplest built-in Callback of Retrofit,

which already handles the switching between UI Thread and sub Thread.
</p>

<script src="https://gist.github.com/waitzShigoto/04e812ff6d93a27e1ba8a91834b2f140.js"></script>
<p style="text-align:left;">
&#11014; This mainly uses Retrofit to separate the integration endpoints.
</p>

<script src="https://gist.github.com/waitzShigoto/a4b7da41bfe56c408b879fdc8ceac03b.js"></script>
<p style="text-align:left;">
&#11014; This is where you create an HTTP connection class</p>

<div class="c-border-content-title-4">
  4. After completing the above steps, you have successfully integrated the ChatGpt API~
</div>

<p>Now you just need to call the LineBot chatroom API at the place where you successfully called the ChatGpt API

to send the returned message to the actual Line chatroom you are using.</p>
</div>

<div class="c-border-main-title">Start Creating a LineBot Account</div>

<div class="c-border-content-title-4">
  1. Apply for a Line Bot account: First, you need to apply for a Line Bot account at the Line Bot Developer Center and create a new Line Bot Channel.
</div>

Click this link to apply or log in directly with your Line account: [Line Business ID](https://account.line.biz/login?redirectUri=https%3A%2F%2Fdevelopers.line.biz%2Fconsole%2Fchannel%2F1656655880%2Fmessaging-api)

<div align="center">
  <img src="/images/linebot/line_bot_001.png" width="45%"/>
  <img src="/images/linebot/line_bot_002.png" width="45%"/>
</div>

<div class="c-border-content-title-4">
  2. Configure the Line Bot Channel: After creating the Line Bot Channel, you need to configure the basic information of the Channel, Webhook, Messaging API, Line Login, and other functions.
</div>

After registration, enter this screen and click Create to create a new chatroom:

<div align="center">
  <img src="/images/linebot/line_bot_003.png" width="50%"/>
  <img src="/images/linebot/line_bot_004.png" width="40%"/>
</div>

After creation, go to this page and click Create a Messaging API Channel to enable the messaging API for the Line bot:

<div align="center">
  <img src="/images/linebot/line_bot_005.png" width="100%"/>
</div>

Enter the information as shown in the picture below

<div align="center">
  <img src="/images/linebot/line_bot_006.png" width="100%"/>
</div>

<div align="center">
  <img src="/images/linebot/line_bot_007.png" width="100%"/>
</div>

After entering the information

Remember to check the agreement and create

<div align="center">
  <img src="/images/linebot/line_bot_008.png" width="100%"/>
</div>

<div class="c-border-content-title-4">
  3. After creation, you can see your Channel secret and Channel access token on the Basic Setting and Messaging API pages respectively.
</div>

These two keys are needed to call the LineBot related interfaces
<div align="center">
  <img src="/images/linebot/line_bot_018.png" width="100%"/>

  <img src="/images/linebot/line_bot_019.png" width="100%"/>
</div>

<div class="c-border-content-title-4">
  4. Next, refer to the official LineBot API documentation to see how to integrate: <a href="https://developers.line.biz/en/docs/messaging-api/sending-messages/#methods-of-sending-message" target="_blank">LineBot Messaging API Documentation</a>
</div>

<div align="center">
  <img src="/images/linebot/line_bot_020.png" width="100%"/>

</div>

<div class="c-border-content-title-4">
  5. At this point, you have obtained everything needed to connect to the LineBot API...
</div>

<p>You can start developing the API using the language you are familiar with</p>
<p>Connecting to the LineBot API with Kotlin</p>
<script src="https://gist.github.com/waitzShigoto/a21b726e6cde1d2f171ca77b66b78abb.js"></script>
<p style="text-align:left;">
&#11014; This is similar to the process of connecting to ChatGPT earlier, also using Retrofit
</p>

<script src="https://gist.github.com/waitzShigoto/371d803d654c0050574da73df02d3f16.js"></script>
<p style="text-align:left;">
&#11014; Extracted Line Messaging interface
</p>

<div class="c-border-content-title-4">
  6. At this point, the simple connection is complete.. You can start deploying the code to the server
</div>

You can use some cloud servers or set up a server on your local IP to upload the written code

You can start your LineBot connection to the ChatGPT service

After that, repeatedly test your online features for bugs and perform subsequent maintenance

The rest is up to you to explore, give it a try!

<h3 align="center">Final Result</h3>
<div align="center">
  <img src="/images/linebot/line_bot_021.png" width="40%"/>

</div>

<div class="c-border-main-title">How to deploy to LineBot after development is complete?</div>
<div class="c-border-content-title-4">
  1. Once development is complete, you just need to open your code interface and deploy it to the server, then provide the Webhook URL to the Line Developer backend
</div>

<p class = "table_container">
Here, go back to the <a href="https://developers.line.biz/" target="_blank">Line Developer</a> page

Enter the Messaging API page

Input your open interface
</p>
<div align="center">
  <img src="/images/linebot/line_bot_022.png" width="100%"/>

  <img src="/images/linebot/line_bot_025.png" width="100%"/>

</div>
<p style="text-align:center;">
&#11014; Update your URL to the Line backend</p>

<img src="/images/linebot/line_bot_023.png" width="100%"/>
<p style="text-align:center;">
&#11014; After inputting, you can check if your server is connected</p>
<img src="/images/linebot/line_bot_024.png" width="100%"/>
<p style="text-align:center;">
&#11014; The result after clicking Verify, if there is an error, it will feedback an error code</p>

<div class="c-border-content-title-4">
  2. Here I use Kotlin's Ktor to develop my own backend, such as..
</div>

<img src="/images/linebot/line_bot_026.png" width="100%"/>
<p style="text-align:center;">
&#11014; Open a /line_callback interface</p>

<div class="c-border-content-title-4">
  3. I recommend a free online server: <a href="https://ngrok.com/" target="_blank">ngrok</a>
</div>

<p style="text-align:center;">
Because this has a low entry threshold, it is very suitable for beginners.

Just follow the official website documentation.

It almost painlessly helps you convert a local port into an external URL.

Quite convenient.
</p>

<div align="center">
  <img src="/images/linebot/line_bot_027.png" width="100%"/>

</div>
<p style="text-align:center;">
&#11014; After logging in, you will see the ngrok dashboard. At this point, just follow the steps above.

1. Download the zip and install it.

2. Copy and enter the command above in the command line (Linux/mac) / DOS (Windows).

3. Finally, select a port to convert to an external port.
</p>

<div class="c-border-content-title-4">
  4. After converting the port with ngrok, you will see the following screen.
</div>

<div align="center">
  <img src="/images/linebot/line_bot_028.png" width="100%"/>

  <img src="/images/linebot/line_bot_029.png" width="100%"/>

</div>

<div class="c-border-content-title-4">
  5. Go back to the Line Developer backend and enter the URL to complete the integration.

</div>

<div align="center">
  <img src="/images/linebot/line_bot_030.png" width="100%"/>

</div>

<div class="c-border-content-title-4">
  6. Sample Code
</div>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">ChatGpt + LineBot</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/KuanChunChen/Chat-gpt-with-line-bot-messaging-exmaple">Sample Code</a>
        </div>
    </div>
</div>
