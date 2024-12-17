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

### Challenge 1: How do I serve my own images when using Markdown?

#### Solution 1: Use AWS S3 Bucket

Upload all images and videos to an **AWS S3 bucket** and serve the assets from there.

- **Pros**:
  - S3 is easy to use and allows assets to be shared seamlessly.
- **Cons**:
  - S3 incurs additional costs.
  - Uploading assets requires opening a new browser window, which can add friction to the process.

#### Solution 2: Create a Local `/images` Folder and Serve via Backend

Host images directly in the backend by creating an `/images` folder. One way to render assets, such as PDFs, is by using an `iframe` like this:

```html
<iframe src="/server/images/file_name.pdf" width="100%" height="600px">
  This browser does not support PDFs. Please download the PDF to view it:
  <a href="/server/images/file_name.pdf">Download PDF</a>
</iframe>
```

To serve these images, you can add a static file middleware to your backend, for example:

```javascript
app.use("/server/images", express.static("./images"));
```

However, this approach has limitations: Markdown does not support relative paths for assets, even with the server configuration above.

- **Pros**:
  - Everything is managed within the same backend repository.
- **Cons**:
  - Large assets can increase deployment times.
  - Managing big files locally may become cumbersome as the project scales.

### Conclusion

**Solution 1** (using AWS S3 bucket) is the preferred choice for serving images and other assets. While it comes with additional costs, it provides a seamless and scalable approach to asset management.

## Next Step

I hosted the backend on AWS App Runner, but found it too costly for a blog post project. I might forgo this architecture in the future. However, I’ve preserved the source code on GitHub if you are interested in reviewing it.
