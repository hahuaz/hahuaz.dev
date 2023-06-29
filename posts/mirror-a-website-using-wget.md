---
title: "Mirror a website using wget"
summary: "Wget is a command-line tool used to download files from the internet for offline viewing."
createdAt: "2023-01-13"
tags: ['docker']
image: '/images/posts/mirror-a-website-using-wget/wget.webp'
---

"wget" is a command-line utility used to download files from the internet. It supports HTTP, HTTPS, and FTP protocols and can be used to download single files, multiple files, or an entire website.

### # Spin up Docker

Docker allows for a consistent environment for applications to run in, regardless of the host operating system. This greatly reduces the risk of OS-related errors. Head over to [docker.com](https://docs.docker.com/get-docker/) to install it.

Open up your terminal and run the following commands:
  
```bash
docker pull ubuntu
docker run -it ubuntu
```
The "docker pull ubuntu" will download the official Ubuntu image from the Docker hub to the local machine.

"docker run -it ubuntu" will start a new container using this image.

Execute the following commands to install "wget":

```bash
su
apt-get update
apt-get install wget
wget --version
```

We executed the 'su' command to gain superuser privileges (root) and installed the library.

### # Download entire website

We're ready to mirror the website. It's a very long command.

```bash
wget --recursive \
--no-clobber \
--content-disposition \
--html-extension \
--page-requisites \
--convert-links \
--restrict-file-names=windows \
--directory-prefix wget-mirror \
-e robots=off \
--span-hosts \
--domains cdn.shopify.com,uppercasebrands.com \
https://uppercasebrands.com
```

Let's explain some important params in the above command:

- --recursive: Download the website recursively, i.e., follow all links on the website to download all the linked pages and resources.
- --restrict-file-names=windows: Modify file names so that they will work better on Windows systems. You can omit it if you're on a different OS.
- --html-extension: Append .html extension to files of type text/html. This parameter is crucial. If you omit it, the browser will download the pages when you click a link instead of routing them.
- --page-requisites: Download all files necessary to properly display the page, such as images, stylesheets, and scripts.
- --convert-links: Convert links in downloaded files to point to the local files, so that the website can be viewed offline.
- --directory-prefix wgetdownload: Save all files in a directory called "wgetdownload".
- --domains cdn.shopify.com,uppercasebrands.com: Only download files from the specified domains, even if other domains are linked to in the downloaded files.

These are the params that I found most useful. You can visit [gnu.org](https://www.gnu.org/software/wget/manual/wget.html) to learn more.

### # View the website offline

We'll zip the downloaded directory and copy it from the container to our machine.

Execute the following command in the container:

```bash
zip -r wget-mirror.zip wget-mirror
```

Then, open up a new terminal in your machine (not in Docker) and execute:

```bash
docker container ls
```
Above command will log your container ids. Select the appropriate one and use it on next command.

```bash
docker cp <your-container-id>:/wget-mirror.zip .
```

You should be able to see wget-mirror directory in your folder. Go ahead and check all the files.