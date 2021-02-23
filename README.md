<div align="center"><h1>GraphScript</h1></div>


GraphScript is a personal experimental project intended to provide some feature: register, login, add/remove application, add/remove friends, get friend's applications, logout so that candidate can have a tool to share companies that they have applied to their peers.

| Domain   | Technology Stack   |
| -------- | ------------------ |
| Backend  | ![](https://img.shields.io/static/v1?label=&message=Typescript&logo=Typescript&color=blue&logoColor=white&style=flat-square) ![](https://img.shields.io/static/v1?label=&message=aws&logo=amazon-aws&color=orange&logoColor=white&style=flat-square) ![](https://img.shields.io/static/v1?label=&message=serverless&logo=serverless&color=black&logoColor=red&style=flat-square) ![](https://img.shields.io/static/v1?label=&message=graphql-compose&logo=graphql&color=purple&logoColor=ff69b4&style=flat-square) |
| Database | ![](https://img.shields.io/static/v1?label=&message=mongoDB&logo=mongodb&color=white&logoColor=green&style=flat-square)     |
| Frontend | TBD |
| UnitTest | ![](https://img.shields.io/static/v1?label=&message=Jest&logo=jest&color=white&logoColor=red&style=flat-square)  |
  

## REQUIREMENT
Need to have an AWS account with AWS access key and secret key. [Here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/) is how to configure it.   
Inside of the graphscript directory, create a .env file
```
.env
SECRET_KEY=[your_secret_key]
MONGO_CONNECTION_STRING_ATLAS=[mongodb_uri]
```
## INSTALLATION
```
yarn
```

## CONFIGURATION 
### Unit Test
```
yarn test
```
### Format
```
yarn format
```
### Local testing
```
yarn dev
```

## DEPLOYMENT
```
yarn deploy:dev
```

## PROJECT STRUCTURE
```
src
 |__Databases
 |      |_____index.ts
 |__Errors
 |      |_____index.ts
 |__Models
 |      |_____User.ts
 |__Resolvers
 |      |_____application.ts
 |      |_____index.ts
 |      |_____user.ts
 |__TypeCompose
 |      |_____index.ts
 |__main.ts
```
TypeCompose/index contains all the type definitions. These are exported to Resolvers.  
Resolvers/index contains all the logic and database interaction. These modified type definitions are exported to main.  
main defines the Query and Mutation and how to use which resolver for a specific query or mutation.
