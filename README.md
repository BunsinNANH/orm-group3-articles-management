# orm-group3-articles-management

## Install Modules
### npm install

## Run App
### npm run start:dev

## API Routes Documentation
++ Tables
** users {id,username, password, is_admin, role_id}
** user_details {id, firstname, lastname, email, user_id, created_at, updated_at}
** roles {id, role}

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
