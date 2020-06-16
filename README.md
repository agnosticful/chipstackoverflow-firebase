# chipstackoverflow-firebase

Firebase backend for chipstackoverflow

## Development

We're using Firebase Emulators for local development. Hit `npm run dev` to run emulators after installing dependencies with `npm install`.

```
# install dependencies
npm install

# run firebase emulators
npm run dev
```

## System Architecture

![](https://user-images.githubusercontent.com/4289883/84722320-bbf9e500-af37-11ea-9981-4a3f86a4cc59.png)

We're using 5 Firebase products:

- Authentication
- Cloud Firestore
- Cloud Functions
- Cloud Storage
- Hosting

All users' API call is towards GraphQL cloud function, instead of directly fetching data from Firestore in order to make API playground and clear auto-generated documentation. Therefore, security rules of Firestore denies all.

## Application Architecture (Deep Inside GraphQL Cloud Function)

- We're using Firestore as a datastore that allows alomost infinite number of connections. So that we can use cloud functions as a Web API.
- Authenticaion is resolved by JSON Web Token, therefore we don't have extra datastore fetch to verify authentication token.
- We're using [Apollo GraphQL server implementation](https://github.com/apollographql/apollo-server) and [resolver chains](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains) hard to fetch child-layer data by users' demand.
- Models are well typed by TypeScript. We check pessimisticly data types to write to datastores but cast optimisticly data to be typed from datastores. Type checking are working on TypeScript's [Branded Types](https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d), which can be added in TypeScript as "Nominal Types" ([discussion](https://github.com/Microsoft/Typescript/issues/202)), and [Assertion Functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions).
- We're using [dataloader](https://github.com/graphql/dataloader) to prevent N+1 fetch to datastores.

## License

No license
