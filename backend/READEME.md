# Server
This project has no server. The data is fetched from dummy data, found in the ```data``` folder. Each file represents a different table in the database. 

### To initiate the backend, got to the backend folder location and do ```npm start``` in the terminal.

# API functionality
The API for the project represents simple CRUD operations for the three main data tables with some additional fuctionality for a bit more complex operations. All routes have a JWT authenticator function in them (can be found at the bottom of each route file).

## API endpoints:
### - /profile:
This route take care of all profile related operations.
- ```POST``` ```/```: creates a user profile and encrypts the password. Takes as input an object with keys ```username``` and ```password```.
- ```POST``` ```/login```: authenticates the user and creates a new JWT session. Takes as input ```username``` and ```password```.
- ```GET``` ```/user/:id```: searches for user profile by ```id```. Takes as parameted ```userID```.
- ```GET``` ```/search```: searches for user profile by ```username```. Takes in a string and returns all ```username``` instances which contain the string.
- ```DELETE``` ```/```: deletes the user profile. Checks if the user is logged in and take ```userID``` to delete from the user's JWT token.

### -/thread:
This route takes care of all thread related operations.
- ```POST``` ```/``` : checks if user is authenticated, if yes, creates a thread (post). Takes as input an object with keys ```title``` and ```text```
- ```GET``` ```/single/:id```: searches for a thread by id and returns a single object. Takes as parameter ```threadID```.
- ```GET``` ```/all```: returns all created threads in the web app.
- ```GET``` ```/all/:userid```: returns all threads created by a user. Takes is as parameters ```userID```.
- ```POST``` ```/search```: searches for threads with titles, that include the input. Takes in as input an object with ```title```.
- ```PUT``` ```/:id```: checks if the user is the owner of the thread, if yes, updates the thread and sets ```time_updated``` to the time submission of the request. Takes in as input an object with ```title``` and ```text```.
- ```PUT``` ```/votes/:id```: handles likes/dislikes of the thread. Takes in as input an object ```{ "type: "like" }``` or ```{ "type: "dislike" }``` and parameters ```threadID```.
- ```DELETE``` ```/:id```: deletes the thread. Checks if the user is logged in and the owner of the thread. If yes, takes ```threadID``` as parameters to delete the thread and cascade all comments.

### -/comment:
This route takes care of all comment related operations.
- ```POST``` ```/``` : checks if user is authenticated, if yes, creates a comment (reply). Takes as input an object with keys ```text``` and ```commentID``` (only in case of a reply to another comment).
- ```GET``` ```/thread/:id```: returns all comments with ```threadID===params.id```.
- ```GET``` ```/user/:username```: returns all comments by ```username```. It is important to note that this search can be done without confusion, as the route look for an exact match betweem the parameter and a username, and usernames cannot be duplicates.
- ```PUT``` ```/:id```: checks if the user is authenticated and is the owner of the comment, if yes, updates the comment ```text```. Takes in as input an object with key ```text``` and automatically updates ```date_updated``` to the time of submission.
- ```PUT``` ```/votes/:id/:type```: handles liking/disliking the comment. Takes in 2 parameters - ```commentID``` and ```type of action```, where the only valid ```type of action```s are ```"like"``` and ```"dislike"```.
- ```DELETE``` ```/:id```: handles deletion of comments. Checks if the user is authenticated and is the owner of comment with ```id===:id```. If yes, "deletes" the comment, by setting ```text==="Message was deleted"``` and ```upvotes === 0``` as to not have to cascade the whole comment thread

## .env
This file contains environment variables, specifically ```ACCESS_TOKEN_SECRET``` and ```PORT```. The former is used in JWT authentication, while the latter is the port to the localhost server.

# NOTE:
the inconsistency of API routes in similar functionalities (e.g ```thread/votes/:id``` and ```comment/votes/:id/:type``` is such for no particular reason. I tried to experiment with different methods of achieving the same thing.
