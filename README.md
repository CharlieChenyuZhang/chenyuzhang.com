# chenyuzhang.com

chenyuzhang.com landing page

# how to run

`npm ci`

`npm run dev` this will run both the frontend and backend

# google analytics

log in to the google analytics account (contact@chenyuzhang.com) to view the stats.

# architecture

frontend - React deployed to AWS Amplify

backend - node.js, Docker, Amazon ECR, App Runner

# NOTE

Since I am using react-mathjax which only works with React16 but now, my React version is React18.
So I am adding `--legacy-peer-deps` flag to the npm ci so it reads `npm ci --legacy-peer-deps`

I've chagned the Build settings manually in the AWS Amplify.

# blog posts instruction

- write your new blog in the server/projects folder.
- If you want to use any digital assets, place them to the S3 buckets and use the absolute URL. https://s3.console.aws.amazon.com/s3/buckets/chenyuzhang-com-assets?region=us-east-1&bucketType=general&tab=objects
- The .md file name has it's naming convension. all lower case and separate each word with a dash. NOTE: the file name will become the title so make it descriptive.

# how to write math

I am using MathJax to display Math
https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference

# containerize and deploy server to AWS

Retrieve an authentication token and authenticate your Docker client to your registry.
Use the AWS CLI:

`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 925450674585.dkr.ecr.us-east-1.amazonaws.com`

Note: If you receive an error using the AWS CLI, make sure that you have the latest version of the AWS CLI and Docker installed.
Build your Docker image using the following command. For information on building a Docker file from scratch see the instructions here . You can skip this step if your image is already built:

`docker build -t chenyuzhang-com-server .`

After the build completes, tag your image so you can push the image to this repository:

`docker tag chenyuzhang-com-server:latest 925450674585.dkr.ecr.us-east-1.amazonaws.com/chenyuzhang-com-server:latest`

Run the following command to push this image to your newly created AWS repository:

`docker push 925450674585.dkr.ecr.us-east-1.amazonaws.com/chenyuzhang-com-server:latest`

# test your Dockerfile locally

`docker build -t chenyuzhang-com-server .`

`docker run -p 8080:8080 chenyuzhang-com-server`

To close it, you need to navigate to Docker and close it from UI.
