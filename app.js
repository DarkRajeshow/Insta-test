// Importing modules
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import cors from 'cors';
import { initializeSession, serializeUser, isAuthenticated, isLoggedIn, loginUser, logoutUser, registerUser } from './routes/auth/auth.js';


// Importing routes
// import registerRouter from './routes/auth/register.js';
// import loginRouter from './routes/auth/login.js';
// import isLoggedIn from './routes/auth/isLoggedIn.js';
// import logoutRouter from './routes/auth/logout.js';
import uploadRouter from './routes/actions/upload.js';
import likeRouter from './routes/actions/like.js';
import toggleFollowRouter from './routes/actions/toggleFollow.js';
import saveRouter from './routes/actions/save.js';
import userRouter from './routes/actions/user.js';
import commentsRouter from './routes/data/comments.js';
import feedRouter from './routes/data/feed.js';
import usernameRouter from './routes/data/username.js';
import likedRouter from './routes/data/liked.js';
import savedRouter from './routes/data/saved.js';
import postRouter from './routes/query/post.js';
import followersRouter from './routes/query/followers.js';
import followingRouter from './routes/query/following.js';
import searchRouter from './routes/query/search.js';
import exploreRouter from './routes/data/explore.js'
import messageRouter from './routes/data/message.js'


// Importing models and utilities
import connectToMongo from './utility/connectToMongo.js';
import { createServer } from 'http'
import socketIo from './connection/socket.js';
import store from './connection/sessionStore.js';

// Configuring environment variables
dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Connecting to MongoDB
connectToMongo();

// Authentication setup
app.use(cookieParser());
app.use(isAuthenticated);
app.use(flash());

const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = isProduction ? process.env.CLIENT_DOMAIN ? `${process.env.CLIENT_DOMAIN}` : '' : 'localhost';

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: store,
    proxy: true,
    cookie: {
        domain: cookieDomain,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'strict'
    }
}));


app.use(initializeSession);
app.use(serializeUser);


//cores setup
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Default setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files from the 'dist' folder
app.use(express.static("dist"));

// Route for the default GET request
app.get('/', (req, res) => {
  // Send the 'index.html' file as the response
  res.sendFile(__dirname + '/dist/index.html');
});
app.use("/api/uploads", express.static("public/uploads"));


// API routes
// Auth
// app.use('/api/login', loginUser);
// app.use('/api/register', registerUser);
// app.use('/api/logout', logoutUser);
// app.use('/api/isloggedin', isLoggedIn);


app.post('/api/login', loginUser);
app.post('/api/register', registerUser);
app.get('/api/logout', logoutUser);
app.get('/api/isloggedin', isLoggedIn);

// User actions
app.use('/api/upload', uploadRouter);
app.use('/api/like', likeRouter);
app.use('/api/toggle-follow', toggleFollowRouter);
app.use("/api/save", saveRouter);
app.use('/api/user', userRouter);

// Data retrieval
app.use('/api/feed', feedRouter);
app.use('/api/username', usernameRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/liked', likedRouter);
app.use('/api/saved', savedRouter);
app.use("/api/explore", exploreRouter)
app.use("/api/messages", messageRouter)

// Query
app.use("/api/posts", postRouter);
app.use("/api/followers", followersRouter);
app.use("/api/following", followingRouter);
app.use("/api/search", searchRouter);

// Error handling
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    res.status(err.status || 500).json({
        success: false,
        status: err.message || 'Internal Server Error'
    });
});

const httpServer = createServer(app)

socketIo(httpServer);

// Starting the server
httpServer.listen(PORT, () => {
    console.log("Server is running : " + PORT);
});

// Exporting the app
export default app;
