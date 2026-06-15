// import { testConnection } from './src/models/db.js';
// import express from 'express';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import session from 'express-session';

// import router from './src/routes.js';
// import flash from './src/middleware/flash.js';


// // Define the the application environment
// const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// // Define the port number the server will listen on
// const PORT = process.env.PORT || 3000;

// // SESSION SECRET
// const SESSION_SECRET = process.env.SESSION_SECRET;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// /**
//  * Configure Express middleware
//  */

// // Set up session management
// app.use(session({
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
// }));

// // Use flash message middleware
// app.use(flash);

// // Allow Express to receive and process common POST data
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Set EJS as the templating engine
// app.set('view engine', 'ejs');

// // Tell Express where to find your templates
// app.set('views', path.join(__dirname, 'src/views'));

// // Middleware to log all incoming requests
// app.use((req, res, next) => {
//     if (NODE_ENV === 'development') {
//         console.log(`${req.method} ${req.url}`);
//     }
//     next(); // Pass control to the next middleware or route
// });

// // Middleware to make NODE_ENV available to all templates
// app.use((req, res, next) => {

//     res.locals.isLoggedIn = false;
//     if (req.session && req.session.user) {
//         res.locals.isLoggedIn = true;

//     }
//     res.locals.user = req.session.user || null;

//     res.locals.NODE_ENV = NODE_ENV;
//     next();
// });

// // Use the imported router to handle routes
// app.use(router);



// // Catch-all route for 404 errors
// app.use((req, res, next) => {
//     const err = new Error('Page Not Found');
//     err.status = 404;
//     next(err);
// });

// // Global error handler
// app.use((err, req, res, next) => {
//     // Log error details for debugging
//     console.error('Error occurred:', err.message);
//     console.error('Stack trace:', err.stack);

//     // Determine status and template
//     const status = err.status || 500;
//     const template = status === 404 ? '404' : '500';

//     // Prepare data for the template
//     const context = {
//         title: status === 404 ? 'Page Not Found' : 'Server Error',
//         error: err.message,
//         stack: err.stack
//     };

//     // Render the appropriate error template
//     res.status(status).render(`errors/${template}`, context);
// });

// const server = app.listen(PORT, () => {
//     console.log(`Server is running at http://127.0.0.1:${PORT}`);
//     console.log(`Environment: ${NODE_ENV}`);

//     testConnection().catch((error) => {
//         console.error('Error connecting to the database:', error.message || error);
//     });
// });

// server.on('error', (error) => {
//     if (error.code === 'EADDRINUSE') {
//         console.error(`Port ${PORT} is already in use. Try changing PORT in .env.`);
//         process.exit(1);
//     }

//     console.error('Server failed to start:', error);
//     process.exit(1);
// });



import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';

/**
 * Environment configuration
 */
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

/**
 * File paths
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create Express app
 */
const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */

// Session middleware
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
    })
);

// Flash middleware
app.use(flash);

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Request logger (dev only)
 */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/**
 * Global template variables
 */
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session?.user;
    res.locals.user = req.session?.user || null;
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * Routes
 */
app.use(router);

/**
 * 404 handler
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error(err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });
});

/**
 * Start server AFTER DB connection check
 */
const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Server running at http://127.0.0.1:${PORT}`);
            console.log(`Environment: ${NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

startServer();