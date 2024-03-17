1. create package.json files
	- npm init
2. npm install
	- express
	- body-parser
	- morgan
	- dotenv
	- mongoose
	- slugify
3. create
	- app.js
	- server.js
	- config.env
	- folder: routes
		- tourRoutes.js
		- userRoutes.js
	- folder: controller
		- tourController.js
		- userController.js
		- errorController.js
	- folder: models
		- tourModel.js
	- folder: utils
4. start server
	- app.js create app
	- server.js require the app and start the server
5. app.js
	- require body-parser and use it
	- require morgan and display on development environment
	- set static files
6. create db in mongo db atlas
7. in tourModel.js create 
	- tourSchema with all the validations
8. in tourController create
	- getAllTours
	- getTourById
	- createTour
	- updateTour
	- deleteTour
9. in tourRoutes create routes for all above controller and then add as middleware in app.js
10. import dev data into db
11. add db connection in server.js
12. test semuanya kat postman
13. if semua ok, then add query, limit fields, sort & paginate features into tourController
14. add tour alias
15. move the above query features into apiFeatures.js
16. create getTourStats & getMonthlyPlan using Tour.aggregate
17. if semua ok, then dalam tourModel
	- create virtual properties
	- add document middleware
	- add query middleware
	- add aggregation middleware
18. handle errors
	- unhandle routes
	- create global error handling middleware
	- create AppError class
	- create catchAsync
	- create 404 not found error when tour id is not found
	- create development vs production error message
	- handle invalid database ID
	- handle duplicate database fields
	- handle mongoose validation error
	- handle error outside express - unhandled rejections
	- catch uncaught exceptions



	
