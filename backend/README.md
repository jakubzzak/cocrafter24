# Solution

## Comments

I personally believe comments in code are suggesting a failure of the author to write clean code. In majority of the cases, the code itself can and should act as comments hence I aim to avoid them. There are indeed cases where they are necessary, to express a followup, thought of some kind that needs to be worked on soon or clarified (this should always have a followup task linked instead, which explains the details) OR a very complex calculations, where namings in the code aren't sufficient (this rarely happens tho).

The comments I left in the code are a quick expression of my thoughts on a particular part that normally wouldn't be there, if it wasn't a coding assignment.

## Run

As required, all you need to do to run the project is the following command

```bash
docker compose up
```

## How long it took you to solve this?

Together I took something over 6h, together with README about 7. When I realized it was coming up on the 6th, I wrapped up what I had and added metadata (such as my thoughts and this readme). As I was told, it should have taken 2-4h, and at that moment it felt like cheating if I was going forward. There is always something to improve, make it look better, more efficient.. In the end its about the requirements.

## How did you approach the problem?

I started with running the project, looking around. It took me ~45 min to understand the assignment, setup my backend and run everything together via docker. From here on it sucked me in and I spent more than initially planned, as stated above.
Once setup was done, I opened FE and started "typing" - derived necessary types and API contract schemas from FE repo. This strategy is sometimes being leveraged during early project development, where requirements are unclear, unstable hence FE is built first and then BE follows. It can save quite some time, because we don't have to make any assumptions that would need to be adjusted, or possibly even completely reworked, later on. Eventually, the assignment was to build BFF (backend for frontend). It means the BE is dedicated for a specific web. I have, however, structured my code to be extendable with scope beyond BFF.

## What was the most difficult part & how did you solve it?

I came across 4 major challenges (complex/time-consuming)

1. _data modeling_
   This part was puzzling coz it could have gone multiple ways. From my experience its important to not overcomplicate right from the beginning, especially in early stage startups due to lack of resources. This will take its toll on maintenance and prevent from pushing features and significantly improving the product. Thus I've aimed for the simplest solution.

2. _Docker setup_
   Here I run into troubles, such as accessing the db server running in the container from my BE server running in the terminal, not in a container. It slowed me down and I was doing research on it, but eventually decided to drop it as it worked from within the container. It still bothers me I didn't make it work. I assume it has something to do with network as it cannot properly determine host?

3. _Express setup_
   I spent quite some time setting up express server and overall project structure, but I would argue its due to the fact that this is not part of our everyday tasks. These things you simply don't remember and usually keep a setup instructions (sources) saved somewhere. Most recently I've been working a lot with lambdas thus serverless was the #1 framework to go to. Lambdas are not the best solution for FE (scaling) but in the early stage with low traffic I would argue it could be a nice cost saver. Even more, serverless local is still not supported with docker.

4. _CORS_
   Although I confirmed I was sending correct response headers within the response, when running BE within a container these headers wouldn't be exposed. When I searched the common issues no one seemed to encounter the same issue, ever. This gave me an idea that building the container might be wrong and found out it was indeed the issue. Building on its own somehow didn't work, via docker compose it did - possibly some cache troubles.

## What would you have done differently/ added it this feature would be shipped into production

When searching for "TODO", you will find areas where I wanted to go further but had to abandon them due to lack of time. I can also think of a few more things:

- _the functionality of creating a folder_ - I would expect a name right away, so we don't have to call create followed by update right after
- _wrapping response in "data" object_ - It adds more flexibility and its easier to extend with additional data. I like to structure it as { data: "main data", meta: "metadata about the response" }. This doesn't seem as critical until we start working on API for a mobile app.
- _authorization_ - There is no auth present and I also assumed there is only one company consuming the data, thus it has access to everything
- _input validation_ - I've quickly sketched some simple input validation but it hardly covers all the cases
- _folder - document data structure_ - As part of my initial thoughts, I still wonder if this whole thing could have been achieved solely in s3. It would be surely much more complex
- _different engine for the API_ - I would reconsider if TS is the best for the job. In this tiny example there isn't much happening, but we all know the performance of TS. This is only relevant if performance is in question
- _test before deploy_ - I haven't included any tests and was thinking about dropping some examples, but as I didn't find a single word on it in the assignment I decided to skip. This would be surely one of the next things I would work on
- _documentation_ - Same as with tests, didn't find it critical as scope of this assignment
- _deployment pipeline_ - I don't see any deployment pipeline here, so that would be the next thing
