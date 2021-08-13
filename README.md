# Mobilize Take Home Problem: Backend

## Design considerations
### Assigning short link path via hash
Using characters A-Z, a-z, and 0-9 for the random URL gives us 62 characters to choose from, and using 7 characters as the length of the path means we have 62^7 ≈ 3.5 trillion URLs available. If our service becomes popular enough that many of those URLs are taken, a random assignment of URLs will eventually lead to more and more "collisions" where the randomly picked URL is not available and our service takes longer to respond.

One way to lower the chance of collisions is to base the short URL on a hash of the arbitrary URL. However, this does not reduce collisions as much as the hashes we use day-to-day typically do, since we can only use 7 digits of the encoded hash value, which is much smaller than typical hash values.

Another method would be to assign the URLs incrementally. This has its own difficulties at scale, since it creates a single point of failure (the memory of the last URL assigned). There are ways to address this with distributed system coordination, but that adds complexity to our application.

**My choice**: With the time allotted, and without knowledge of the expected volume of use of this service, I decided to use a hash to pick a URL, falling back on a random URL in the case of a collision. After a set number of random tries (likely indicating that a critical mass of all possible short paths are already taken) the service returns an error and logs what happened, to tell the owners of the service it's time to make some new architectural decisions.

### Testing
Along with unit tests I chose to do stateful e2e tests. Stateful tests can become brittle especially as the application and test suite complexity scales, but in a context of low complexity like this one are a great way to avoid the hiding of bugs that mocking out everything can sometimes lead to.

### Open Source Libraries Used
##### base-x
Base-x is used to encode the hash value (see section "Assigning short link path via hash") into the set of characters we want to allow for our short paths. This would be a fairly easy task to automate ourselves if we're worried about having too many dependencies, but since it's on major version 3 and has 450k weekly downloads it seems like a good bet for use at the moment.

##### mongodb
mongodb is a popular option for NoSQL databases. I chose NoSQL here because with the current features the application has we only need to think about two entities: A mapping of arbitrary URLs to their short URLs, and the datetimes of visits to the URLs. With the limited analytics we are currently providing, setting up all the relations of a relational database would add unnecessary complexity. If more entities are added to our data model (for example tracking things about Users), a relational database should be considered.

##### TypeScript
TypeScript has a difficult learning curve, but a great payoff in the prevention of bugs. Since I am already familiar with TypeScript I decided it would speed up my process here. In a team context the tradeoff is more difficult, since you need to consider the potential cost of training people in TypeScript or hiring for TypeScript skills.

##### jest, supertest
These are well established testing libraries with good support.

##### nodemon
This speeds up development by restarting your server when your code changes. On everything but the shortest projects the small amount of time little tools like this saves you really adds up and helps you stay focused.

##### lodash
I lean on Lodash to feel less worried about the frequent JavaScript bug culprits 'null' and 'undefined' (with their isNull and isUndefined) functions, as well as useful data aggregation methods like countBy().

### What I would do with more time
- More test coverage, especially of code involving dates, a common cause of bugs
- Defense against malicious arbitrary URLs