# Project name: orm-group3-articles-management

## Install Modules
### npm install

## Run App
### npm run start:dev

## API Routes Documentation
### Tables
#### users {id,username, password, is_admin, role_id}
#### user_details {id, firstname, lastname, email, user_id, created_at, updated_at}
#### roles {id, role}
#### articles {id, title, contents, created_by, is_published, created_at, updated_at}

### Get All Users
http://localhost:8080/users?pageSize=5&page=1 , Method: GET

### Get User By ID
http://localhost:8080/users/:id , Method: GET

### Update User by ID
http://localhost:8080/users/:id , Maethod: PUT

### Delete User by ID
http://localhost:8080/users/:id , Method: DELETE

### Create User
http://localhost:8080/users , Method: POST , 
required fields: {username, password, is_admin, role_id, firstname, lastname, email}

Note: username & email must be unique

### Search Users by Username
http://localhost:8080/search/users?username=james, Method: GET, required param :{username}

### Search User Details by (firstname or lastname
http://localhost:8080/search/users/details?firstname=ang , Method: GET , required params: {firstname or lastname}

### User Registeration
http://localhost:8080/register , Method: POST , required fields: {username, password, firstname, lastname, email}

Note: username & email must be unique

### Get All Articles
http://localhost:8080/articles , Method: GET

### Create Article
http://localhost:8080/articles , Method: POST, required fields: { title, contents, created_by, is_published, created_at, updated_at }

### Update Article
http://localhost:8080/articles/:id , Method: PUT, required, param:{id}, fields: { title, contents, created_by, is_published, created_at, updated_at }

### Delete Article
http://localhost:8080/articles/:id , Method: DELETE, require param: id

### Get Article by ID
http://localhost:8080/articles/:id , Method: GET, require param: id

### Search Article
http://localhost:8080/search/articles/list?created_by=string, Method GET, required param: created_by

