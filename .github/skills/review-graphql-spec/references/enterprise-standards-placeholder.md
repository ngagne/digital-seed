# Enterprise GraphQL Guidelines

**A001:** All data types, fields, queries and mutations must have a description.
**A002:** Fields representing dates must use the `Date` custom scalar.
**A003:** Fields representing date-times must use the `DateTime` custom scalar.
**A004:** Query names must not contain a verb, but just the noun which represents the data returned (e.g., use `accounts` instead of `getAccounts`).
**A005:** Mutation names must start with a verb (e.g., `changeAddress`, `sendUserNotification`, `deleteDocument`).
**A006:** Use the `@deprecated` directive to indicate a deprecated field, mutation, or query, and provide a reason, indicating another field to use if possible (e.g., '@deprecated(reason: "Use `products` instead.")')
**A007:** Use `Float` for fields representing a financial amount or rate, instead of `Int` (e.g., an account balance, product cost, investment return rate)
