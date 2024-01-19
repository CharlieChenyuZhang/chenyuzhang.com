# chenyuzhang.com

chenyuzhang.com landing page

# architecture

frontend - React deployed to AWS Amplify

backend - node.js, Docker, Amazon ECR, App Runner

# blog posts instruction

- write your new blog in the public/posts folder
- it won't appear to the website until you add it to the src/blog2show.js. Remember, FIFO.
- The .md file name has it's naming convension. all lower case and separate each word with a dash. NOTE: the file name will become the title so make it descriptive.

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
