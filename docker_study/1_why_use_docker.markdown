
-: Hello and welcome. In this section, I wanna start to tackle two very important questions that we're going to be answering throughout this entire course. The two important questions are, 

1. what is Docker? 
2. why do we use Docker? 

We're gonna first tackle why we use Docker by going through a quick little demo right now. Now I'm gonna show you a little flow diagram and this is a flow of probably a process you've gone through at least once in your life before. It's a flow of installing software on your personal computer and I bet at least once for you, this is what has happened. Maybe you have downloaded some installer, you run that installer, and then inevitably at some point in time you end up getting an error message during installation. So what do you do? Well, you probably troubleshoot the issue by looking on Google. You try to find a solution, you eventually solve that issue. You then rerun the installer only to find, hey, ta-da, you have some other error appearing, and then you have to go through this entire troubleshooting process again. `So this is at its core what Docker is trying to fix.` 

Docker wants to make it really easy and really straightforward for you to install and run software on any given computer. Not just your computer, 

You kinda get into this endless cycle of trying to do all this troubleshooting as you are installing and running software. So let me now show you how easy it is to run Reddis, if you are making use of Docker instead. I'm gonna go back over to my command line and I'm gonna run one single command. I'll say Docker run, dash it, Reddis, like so. I'll hit enter, and then after a very brief pause, almost instantaneously I have an instance of Reddis up and running on my computer. And that's pretty much it. That is Docker in a nutshell, that is how easy it is to run software when you're making use of Docker. So to answer the question very directly of why we use Docker, well, we make use of it because it makes life really easy for installing and running software without having to go through a whole bunch of setup or installation of dependencies. Now, we're gonna learn many more reasons throughout this course of why we use Docker but I wanted to give you a very quick demo and show you how easy it can be to get up and running with some new piece of software when you are using Docker. Let's take a quick pause right here. We're gonna come back to the next section and start trying to answer the question of what Docker is. So I'll see you in just a minute.

* Wny use Docker : 
    - Docker makes it really easy to install and run software without worrying about setup or dependencies.

# 什麼是 Docker

we tried to answer the question of why use Docker? And we eventually said that we use Docker because it makes it really easy to install and run new software on our computer. We're not gonna try to answer the other big question here, which is, what is Docker? Well, this question is a lot more challenging to answer. Anytime you see someone refer to Docker in a blog post or an article or a forum or wherever it might be, they're kind of making reference to an entire ecosystem of different projects, tools, and pieces of software. So if someone says, "oh yeah, I use Docker on my project" they might be referring to Docker client or a Docker server. They might be referring to Docker hub or Docker Compose. Again, these are all projects, tools, pieces of software that come together to form a platform or ecosystem around creating and running something called containers. And so your immediate question might be, Okay well what's a container? That's a good question and that's a question that we're going to be trying to answer throughout this entire course. Just a moment ago, when I ran that command at my terminal of Docker run Redis, it went through a little series of actions behind the scenes and we're going to examine that entire series of actions very closely over time. But for right now, let me give you two important pieces of terminology. When I ran that command, something called the Docker CLI reached out to something called the Docker hub and it downloaded a single file called an image. An image is a single file containing all the dependencies and all the configuration required to run a very specific program. For example, Redis, which is what the image that I just downloaded was supposed to run. This is a single file that gets stored on your hard drive. And at some point in time, you can use this image to create something called a container. A container is an instance of an image and you can kind of think of it as being like a running program. We're gonna go into great detail over time, over behind to learn exactly how a container works exactly. But right now, all we really need to understand is that a container is a program with its own isolated set of hardware resources. So it kind of has its own little set or its own little space of memory, has its own little space of networking technology and its own little space of hard drive space as well. Okay, so I didn't really answer the question here of what Docker is, but we did learn at least that a reference to Docker is really talking about a whole collection of different projects and tools, and we also picked up two important pieces of terminology, a docker image and a container. Now these images and containers are the absolute backbone of what you and I are going to working with throughout the rest of this course. So let's take a quick pause right now. We're gonna come back to the next section and we're gonna start talking a little bit more about how we work with images and containers. So quick break and I'll see you in just a minute.


05-redis & 04-what
```console


```

We're going to be installing a piece of software called Docker for Windows, or Docker for Mac depending upon your operating system. Inside of this program are two very important tools that we're going to be making use of throughout this course. The first tool that's inside this package is something called the Docker client. The Docker client, also known as the Docker CLI is a program that you and I are going to interact with quite a bit from our terminal. We're going to enter in commands to our terminal, issue them to Docker client. It's gonna take our commands and figure out what to do with them. Now the Docker client itself doesn't actually do anything with containers or images. Instead, the Docker client is really just a tool or a portal of sorts to help us interact with another piece of software that is included in this Docker for Windows or Mac package called the Docker server. This is also frequently called the Docker Damon. This program right here is the actual tool or the actual piece of software that is responsible for creating containers, images, maintaining containers, uploading images, and doing just about everything you can possibly imagine around the world of Docker. So it's the Docker client that you and I issue commands to. It's a thing that we interact with. And behind the scenes, this client is interacting with the Docker server. You and I are never going to really reach directly out to this docker server. It's something that's just kind of running it behind the scenes. So again, we're gonna take a quick break right now. 

05-docker cli

```console
        Docker Ecosystem
    ┌───────────────────────┐
    │ ┌────────┐ ┌────────┐ │
    │ │ Docker │ │ Docker │ │
    │ │ Client │ │ Server │ │
    │ └────────┘ └────────┘ │
    │ ┌────────┐ ┌────────┐ │
    │ │ Docker │ │ Docker │ │
    │ │ Machine│ │ Images │ │
    │ └────────┘ └────────┘ │
    │ ┌────────┐ ┌────────┐ │
    │ │ Docker │ │ Docker │ │
    │ │ Hub    │ │ Compose│ │
    │ └────────┘ └────────┘ │
    └───────────────────────┘
```

## Using Docker Client



## What is Container??


Okay, so this is a quick overview of the operating system on your computer. Most operating systems have something called a kernel. This kernel is a running software process that governs access between all the programs that are running on your computer and all the physical hardware that is connected to your computer as well. So, up here at the top of this diagram, We have different programs that your computer is running such as Chrome, or Terminal, Spotify, or Node.js. If you've ever made use of Node.js before and you've written a file to the hard drive, it's technically not Node.jS that is speaking directly to the physical device. Instead, Node.js says to your kernel, "Hey, I want to write a file to the hard drive." The kernel then takes that information and eventually persist it to the hard disc. 


So, the `kernel is always kind of this intermediate layer that governs access between these programs and your actual hard drive`. The other important thing to understand here is that these running programs interact with the kernel through things called `system calls`. These are essentially like function invocations. The kernel exposes different endpoints to say, "Hey, if you want to write a file to the hard drive, call this endpoint or this function right here." It takes some amount of information and then that information will be eventually written to the hard disc, or memory, or whatever else is required. 


```console
┌────────────────────────────────────────────────────┐
│ ┌───────────┐ ┌─────────────┐ ┌────────┐ ┌────────┐│
│ │  Spotify  │ │Apple Podcast│ │ Chrome │ │ NodeJS ││
│ └───────────┘ └─────────────┘ └────────┘ └────────┘│
└──────────┬──────────────┬────────────────┬─────────┘
           │              │                │
           ▼              ▼                ▼              
    ┌─────────────┐  ┌─────────────┐ ┌─────────────┐
    │ System Call │  │ System Call │ │ System Call │
    └──────┬──────┘  └────┬────────┘ └─────┬───────┘
           │              │                │  
           ▼              ▼                ▼  
 ┌────────────────────────────────────────────────┐
 │                     Kernel                     │
 └────────┬───────────────┬────────────────┬──────┘
          │               │                │
          ▼               ▼                ▼     
    ┌────────────┐  ┌─────────────┐ ┌────────────┐
    │     CPU    │  │  Hard Disk  │ │   Memory   │
    └────────────┘  └─────────────┘ └────────────┘
```

Now, thinking about this entire system right here, I wanna post a kind of hypothetical situation to you. I want you to imagine for just a second that you and I have two programs running on our computer. Maybe one of them is Chrome, like Chrome the web browser and the other is Node.js, the JavaScript Service-side run time. I want you to imagine that we're in a crazy world where Chrome, in order to work properly, has to have Python version 2 installed and Node.js has to have version 3 installed. However, on our hard disc, we only have access to Python version 2. And for whatever crazy reason, `we are not allowed to have two identical installations of Python at the same time`. So, as it stands right now, Chrome would work properly because it has access to version 2, but Node.js would not because we do not have a version or a copy of Python version 3.

So, how could we solve this issue? Well, one way to do it would be used to make use of a `operating system feature known as namespacing`. With namespacing, we can look at all of the different hardware resources connected to our computer and we can essentially segment out portions of those resources. So, we could create a segment of our hard disc specifically dedicated to housing Python version 2. And we could make a second segment specifically dedicated to a housing Python version 3. Then, to make sure that Chrome has access to this segment over here and Node.js has access to this segment over here, anytime that either of them issues a system call to read information off the hard drive, the kernel will look at that incoming system call and try to figure out which process it is coming from. So, the kernel could say, "Okay, if Chrome is trying to read some information off the hard drive, I'm gonna direct that call over to this little segment of the hard disc over here, the segment that has Python version 2 and Node.js." Anytime that makes a system call to read the hard drive, the kernel can redirect that over to this segment for Python version 3. And so by making use of this kind of namespacing or segmenting feature, we can have the ability to make sure that Chrome and Node.js are able to work on the same machine.

## Namespacing & Contorl Groups(cgroups)

So, this entire process of kind of segmenting a hard, excuse me, a hardware resource based on the process that is asking for it is known as namespacing. With namespacing, we are allowed to isolate resources per a process or a group of processes, and we're essentially saying that anytime this particular process asks for a resource, we're gonna direct it to this one little specific area of the given piece of hardware. Now, namespacing is not only used for hardware, it can be also used for software elements as well. So for example, we can namespace a process to restrict the area of a hard drive that'd be available, or the network devices that are available, or the ability to talk to in other processes, or the ability to see other processes. These are all things that we can use namespacing for to essentially limit the resources or kind of redirect request for resource from a particular process. Very closely related to this idea of namespacing is another feature called control groups. A control group can be used to limit the amount of resources that a particular process can use. So, namespacing is for saying, "Hey, this area of the hard drive is for this process." A control group can be used to limit the amount of memory that a process can use, the amount of CPU, the amount of hard drive input, input. Or excuse me, input output, and the amount of network bandwidth as well. So, these two features put together can be used to really kind of isolate a single process and limit the amount of resources it can talk to, and the amount of bandwidth essentially, that it can make use of. 

```console
                      ┌─────────────────────────────────────────┐
                      │ ┌──────────┐ ┌───────────┐  ┌─────────┐ │
                      │ │processes │ │Hard Drive │  │ Network │ │
   ┌──────────────┐   │ └──────────┘ └───────────┘  └─────────┘ │
   │ Namespacing  │   │                        ┌───────────────┐│
   └──────────────┘   │ ┌───────┐  ┌─────────┐ │ Inter Process ││
  Isolating resources │ │ Users │  │Hostnames│ │ Communication ││
    per process       │ └───────┘  └─────────┘ └───────────────┘│
                      └─────────────────────────────────────────┘

                      ┌─────────────────────────────────────────┐
                      │  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
   ┌──────────────┐   │  │ Memory  │ │CPU Usage│ │ HD I/O  │    │
   │Control Groups│   │  └─────────┘ └─────────┘ └─────────┘    │
   └──────────────┘   │  ┌─────────┐                            │
    Limit amount of   │  │Network  │                            │
  resources used per  │  │Bandwidth│                            │
        process       │  └─────────┘                            │
                      └─────────────────────────────────────────┘

```

Now, as you might imagine, this entire kind of little section right here, this entire vertical of a running process, plus this little segment of a resource that it can talk to is what we refer to as a container. And so, when people say, "Oh yeah, I have a Docker Container." You really should not think of these as being like a physical construct that exists inside of your computer. Instead, a container is really a process or a set of processes that have a grouping of resources specifically assigned to it. And so, this is the diagram that we're gonna be looking at quite a bit anytime that we think about a container. We've got some running process that sends a system call to a kernel. The kernel is going to look at that incoming system call and direct it to a very specific portion of the hard drive, the RAM, CPU or whatever else it might need. And a portion of each of these resources is made available to that singular process. Now, the last question you might have here is, "Okay. Well, I get what a container is, but with that in mind, what is the real relation between one of those containers or that kind of singular process and grouping of resources to an image? How is that single file eventually create this container?" That's a good question. One more quick diagram. Anytime that we talk about an image, we're really talking about a file system snapshot. So, this is essentially kind of like a copy paste of a very specific set of directories or files. And so we might have an image that contains just Chrome and Python. An image will also contain a specific startup command. So, here's what happens behind the scenes when we take an image and turn it into a container. First off, the kernel is going to isolate a little section of the hard drive and make it available to just this container. And so we can kind of imagine that after that little subset is created, the file snapshot inside the image is taken and placed into that little segment of the hard drive. And so, now, inside of this very specific grouping of resources, we've got a little section of the hard drive that has just Chrome and Python installed and essentially, nothing else. The startup command is then executed which we can kind of imagine this case is like startup Chrome, just Chrome for me. And so Chrome is invoked, we created a new instance of that process and that created process is then isolated to this set of resources inside the container. So, that's pretty much it. That is the relationship between a container and an image, and it's how an image is eventually taken and turned into a running container. Now, there's still a tremendous amount more to learn


```console
  ┌────────────────────────────┐
  │ ┌────────────────────────┐ │
  │ │        Chrome          │ │
  │ └──────────┬─────────────┘ │
  │            │               │
  │            ▼               │
  │ ┌──────────────────────────┼───┐
  │ │        Kernel            │   │
  │ └──────────┬───────────────┼───┘
  │            │               │
  │            ▼               │
  │ ┌─────┐ ┌─────┐ ┌─────────┐│
  │ │ CPU │ │ RAM │ │ Network ││  
  │ └─────┘ └─────┘ └─────────┘│ CPU/RAM/Network/Hard Drive
  │ ┌─────────────────────────┐│ made available to process   
  │ │      Hard Drive         ││
  │ └─────────────────────────┘│
  └────────────────────────────┘
```
