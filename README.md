# Mobilize Take Home Problem: Backend

## Running the app
### Requirements
Developed with:
- node v16.6.1
- yarn v1.22.11
- mongodb v5.0.1

### Setup
For development I ran MongoDB Community Edition locally. [Installation instructions](https://docs.mongodb.com/manual/administration/install-community)

You'll need to start up mongodb before you run the application. The command for this is different depending on your operating system. For example, if you installed it on a mac with homebrew, the command is `brew services start mongodb-community@5.0`.

### Run tests
`yarn test`

### Run the application
`yarn start`

### Hit the endpoints
The default URL of the application running locally is `http://localhost:5002`. Paths are appended to that, eg `http://localhost:5002/new`

Anything in <> below should be replaced with the values you want before use.
#### To get a random short link
**Endpoint**: `/new`

Send a POST request with the JSON body
```
{
    "arbitraryUrl": "<www.example.com>"
}
```

#### To get a custom short link
**Endpoint**: `/new`

Send a POST request with the body

```
{
    "arbitraryUrl": "<www.example.com>",
    "desiredShortPath": "<example>"
}
```

#### To see the stats for a link
**Endpoint**: `/stats/<shortPath>`

Send a GET request to see the stats.

#### To use the link
**Endpoint**: `/i/<shortPath>`

Send a GET request to get routed to the arbitrary URL referenced by the link.

## Deployed version
There is a deployed version of the app:

`https://backend-takehome-mobilize.herokuapp.com/`

## Design considerations
### Assigning short link path via hash
Using characters A-Z, a-z, and 0-9 for the random URL gives us 62 characters to choose from, and using 7 characters as the length of the path means we have 62^7 ≈ 3.5 trillion URLs available. If our service becomes popular enough that many of those URLs are taken, a random assignment of URLs will eventually lead to more and more "collisions" where the randomly picked URL is not available and our service takes longer to respond.

One way to lower the chance of collisions is to base the short URL on a hash of the arbitrary URL. However, this would not reduce collisions as much as we expect hashing usually to do, since we can only use 7 digits of the encoded hash value, which is much smaller than typical hash values.

Another method would be to assign the URLs incrementally. If all went perfectly, this would avoid all collisions. However this has its own difficulties at scale, since it requires a single point of failure (the memory of the last URL assigned). There are ways to address this with distributed system coordination, but that adds complexity to our application.

**My choice**: With the time allotted, and without knowledge of the expected volume of use of this service, I decided to use a hash to pick a URL, falling back on a random URL in the case of a collision. After a set number of random tries (likely indicating that a critical mass of all possible short paths are already taken) the service returns an error and logs what happened, to tell the owners of the service it's time to make some new architectural decisions.

### Testing
Along with unit tests I chose to do stateful e2e tests. Stateful tests can become brittle especially as the application and test suite complexity scales. However, in a context like this one with low complexity, they are a nice option since they reduce the need for mocking, and mocking can hide bugs.

### Open Source Libraries Used
##### base-x
Base-x is used to encode the hash value (see section "Assigning short link path via hash") into the set of characters we want to allow for our short paths. This would be a fairly easy task to automate ourselves if we're worried about having too many dependencies, but since this package is on major version 3 and has 450k weekly downloads it seems like a good bet for use at the moment.

##### mongodb
mongodb is a popular option for NoSQL databases. I chose NoSQL here because the current feature set only requires two entities: A mapping of arbitrary URLs to their short URLs, and the datetimes of visits to the URLs. With the limited analytics we are currently providing, setting up all the relations of a relational database would add unnecessary complexity. If more entities are added to our data model (for example tracking things about Users), a relational database should be considered.

##### TypeScript
TypeScript has a difficult learning curve, but a great payoff in the prevention of bugs. Since I am already familiar with TypeScript I decided it would speed up my process here. In a team context the tradeoff is more difficult, since you need to consider the potential cost of training people in TypeScript or hiring for TypeScript skills.

##### jest, supertest
These are well established testing libraries with good support.

##### nodemon
This speeds up development by restarting your server when your code changes. On everything but the shortest projects the small amount of time little tools like this saves you really adds up and helps you stay focused.

##### lodash
I lean on Lodash to feel less worried about the frequent JavaScript bug culprits 'null' and 'undefined' (with their isNull and isUndefined functions), as well as useful data aggregation methods like countBy().

### What I would do with more time
- More test coverage, especially of code involving dates, a common cause of bugs
- Defense against malicious arbitrary URLs
- Some protection against a scenario where one instance of the app checks if a URL is available, sees that it is, but before it assigns that URL another instance checks if that URL is available and also sees that it is, and we end up with two short URLs for the same arbitrary URL. This might be addressable via database transaction locking.