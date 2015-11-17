/**
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
