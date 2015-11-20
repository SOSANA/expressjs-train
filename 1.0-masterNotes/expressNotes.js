/**
 * Express:
 * 	- express is a connect framework which means it uses the connect middleware.
 * 		Connecting internally has a stack of functions that hanlde requests
 * 	- when a request comes in, the first function in the stack is given the
 * 		request and response objet with the 'next()' function. The 'next()' functions
 * 		when called, delegates to the next function in the middleware stack. your
 * 		could also specify a path for your middleware, so it is only called on
 * 		certain paths
 *  - lets you add middleware to an application using the 'app.use()' functions
 *  - internally express has one level of middleware for the router, which
 *  	delegates to the appropirate handler
 *
 * Middleware:
 * 	- is extraordinary useful for logging, serving, static files, error handling,
 * 		and more. In fact, passport utilizes middleware for authentication. Before
 * 		anything else happens, passport looks for a cookie in the request, finds
 * 		metadata, and then loads the user from the database, adds it to req, user,
 * 		and then continues down the middleware stack.
 *
 * REST:
 * 	- an architectural style for building APIs
 * 	- stands for 'Representational State Transfer'
 * 	- we decide that HTTP verbs and URLs mean something
 *
 * The Uniform Interface:
 * 	- behaves in a specific way, that is uniform from one service to the next
 * 	- is an interface that should always operate this way
 * 		- Resources: your dealing with nouns (built around things not actions),
 * 			not verbs (autherize or login)
 * 			- ex: books http://.../Book, authors http://.../Author
 * 	  - HTTP Verbs: dictates the type of activity we are trying to do on the
 * 	  	resource
 * 	  	- ex:
 * 	  		- HTTP Get: request data, returns a list of objects or a
 * 	  			specific objects
 * 	  		- HTTP Post: used to add data
 * 	  		- HTTP Delete: will remove
 * 	  		- HTTP Put: update or replace a resource an entire
 * 	  		- HTTP Patch: updating a piece of a resource
 * 		- HATEOS
 * 			- stands for "Hypermedia as the Engine of Application State"
 * 			- in each a request will be a set of hyper links that you can use to
 * 				navigate the api, its the api way of letting you know what other
 * 				actions you can take on this particular resource
 */
