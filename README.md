# ECOMMERCE MERN STACK PROJECT


## Back Setup

1. Course plan
2. Environment setup
3. Create express server --> express
4. HTTP request and response
5. nodemon and morgan package --> nodemon, morgan
6. API testing with postman
7. Middleware & Types of Middleware
8. Express Error Handling Middleware --> body-parser
9. How to handle HTTP errors --> http-errors
10. How to secure API --> xss-clean, express-rate-limit
11. Environment variable & .gitignore
12. MVC Architecture --> Model View Controller
13. Connect to MongoDB database
14. Schema & Model for User
15. Create seed route for testing
16. GET /api/v1/users --> isAdmin --> getAllUsers --> searchByName + pagination functionality
17. responseHandler controller for error or success
18. GET /api/v1/users/:id --> get a single user by id
19. How to create services in the backend
20. Delete /api/v1/users/:id --> delete a single user by id
21. Refactoring & reusability, dynamic
22. delete image helper
23. POST /api/v1/users/process-register --> Process the registration
        * Fetch data from request body
        * User exist 
        * JWT --> temporary store data
        * Email --> JWT    
24. Create JWT --> JSON WEB TOKEN
        * JWT --> temporary store data
        * Email --> JWT  
25. Setup SMTP server & prepare email
26. Send Email
27. POST /api/users/verify --> verify + register into data
        * token 
        * verify token?
        * fetch data from token 
        * finally store the user
28. add multer middleware for file upload --> npm install multer
29. add express validator middleware 
30. add express validator middleware
31. Should we store image as string or buffer
32. PUT /api/v1/users/:id --> update a single user by id authentication and authorization
33. POST /api/v1/auth/login --> user login
34. POST /api/v1/auth/logout --> user logout
35. Middlewares --> isLoggedIn, isLoggedOut, isAdmin
36. Input validation when signed in and refactoring
37. PUT /api/v1/users/banned-user/:id --> banned user
38. PUT /api/v1/users/unbanned-user --> unbanned user
39. PUT /api/v1/users/update-password --> update the password
40. POST /api/v1/users/forget-password --> forget the password
41. PUT /api/v1/users/reset-password --> reset the password
42. GET /api/auth/refresh --> refresh the token
43. Refactoring
44. Modular code structure
45. winston logger library

<!-- Product Category -->
46. Category Model and Input validation
47. Category CRUD - Create category - POST: api/categories
48. Category CRUD - Read Category
        GET: api/categories
        GET: api/categories/:slug
49. Category CRUD - Update Category - PUT: api/categories/:slug
50. Category CRUD - Delete Category - DELETE: api/categories/:slug

<!-- Product -->
51. Product API - Product Model
52. Product API - Create seed route for testing products
53. Product API - Create Product
54. Product API - Read product
55. Product API - Update product
56. Product API - Delete Product

<!--  -->