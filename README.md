# CRUD API with In-Memory Database

This project is a simple implementation of a CRUD (Create, Read, Update, Delete) API, utilizing an in-memory database for data storage.

## Getting Started

### Installation

1. Clone this repository (user `git clone` command);
2. Install the dependencies: `npm run install`;
3. Rename **.example.env** to **.env**

### Running the API

There are 2 modes of running application (**_development_** and **_production_**):

`npm run start:dev ` for development mode

`npm run start:prod` for production mode

Access the API at **[http://localhost:4000/api/](http://localhost:4000/)** (you can change the port in your .env file).

### API Endpoints

1. **POST api/users**: Create a new item.

   - Request body: JSON object with item details.
   - Response: Newly created item with a unique identifier.

2. **GET api/users**: Retrieve a list of all items.

   - Response: Array of items.

3. **GET api/users/{id}**: Retrieve a single item by its ID.

   - Response: Item object or 404 if not found.

4. **PUT api/users/{id}**: Update an existing item by its ID.

   - Request body: JSON object with updated item details.
   - Response: Updated item object or 404 if not found.

5. **DELETE api/users/{id}**: Delete an item by its ID.

   - Response: Success message or 404 if not found.

### Users are stored as objects that have following properties:

- **id** — unique identifier (string, uuid) generated on server side
- **username** — user's name (_string_, **required**)
- **age** — user's age (_number_, **required**)
- **hobbies** — user's hobbies (_array of strings or empty array_, **required**)

### User object example:

- request example:
  ```
  {
    "name" : "John",
    "age" : 18,
    "hobbies" : ["reading"]
  }
  ```
- response example:

  ```
    {
    "id" : "37e23660-23e0-4ecb-8dd8-16d763cbd07b",
    "name" : "John",
    "age" : 18,
    "hobbies" : ["reading"]
  }
  ```

## Note: The in-memory database is volatile; all data will be lost when the server restarts.
