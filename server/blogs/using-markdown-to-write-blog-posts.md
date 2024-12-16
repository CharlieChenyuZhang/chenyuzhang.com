---
title: Building My Own Blogging Platform - A Cost-Free Solution for Content Ownership and Control
subtitle: How I Developed a Self-Hosted Markdown-Based Blog Using AWS Amplify for Seamless Deployment
published: true
id: 0
author: Chenyu Zhang
date: January 17, 2024
keywords:
  - Others
  - English
chips:
  - Engineering
  - Completed
---

<img src="./images/ai-generated-8355516_1280.webp" alt="Girl in a jacket" width="500" height="600">

## Motivation

There are many blogging platforms available, generally falling into two categories:

1. Free blogging websites like Medium, which are easy for posting blogs. However, bloggers essentially exchange their content and traffic for the service. They do not retain ownership of their content or web traffic.
2. Paid services like [Posthaven](https://posthaven.com/), used by the likes of [Sam Altman](https://blog.samaltman.com/). These can integrate with your own web pages, but at the time of my research, Posthaven charged $5/month for 10 blogs. For someone who wants to blog extensively without incurring costs, this obviously wasn't an option.

This is why I spent time over the weekend devising my own blogging solution. I leveraged the convenience of Markdown to format my blogs easily, without worrying about which HTML tags to use. I've deployed my code to PaaS (Platform as a Service) AWS Amplify and App Runner so whenever I push my changes to Github, my blog will be deployed automatically to my personal site. [chenyuzhang.com](http://chenyuzhang.com/)

## Tech Architecture of my blogging site

![architecture](https://chenyuzhang-com-assets.s3.amazonaws.com/personal-blog-architecture.jpg "Blog Architecture")

## What is Markdown?

Markdown is a lightweight markup language with a plain text formatting syntax, designed to be converted to HTML and other formats using simple tools. Created by John Gruber and Aaron Swartz, Markdown's goal was to enable people to write in an easy-to-read, easy-to-write plain text format, and then convert it to structurally valid HTML.

## Challenges and Solutions

Challenge 1: how do i serve my own images if I am using

- Solution 1: Upload all the images / videos to AWS S3 bucket and serve the images there. But S3 bucket comes with an additional cost.
  - pros: S3 is easy to use and assets are sharable.
  - cons: S3 costs additional money and need to open a new browser window to upload these assets.
- Solution 2: Create a /images folder and serve the images in the backend. One approach is to use `iframe` like this
  ```
  <iframe src="/server/images/file_name.pdf" width="100%" height="600px">
    This browser does not support PDFs. Please download the PDF to view it:
    <a href="/server/images/file_name.pdf">Download PDF</a>
  </iframe>
  ```
  However, it turns out markdown cannot use relative path even I've added the following line in the server code.
  ```
  app.use("/server/images", express.static("./images"));
  ```
  - pro: everything is managed in the same backend repo.
  - cons: could slow down the deployment time when we add more assets with big files.
- Conclusion: Solution 1

## Next Step

I hosted the backend on AWS App Runner, but found it too costly for a blog post project. I might forgo this architecture in the future. However, I’ve preserved the source code on GitHub if you are interested in reviewing it.
