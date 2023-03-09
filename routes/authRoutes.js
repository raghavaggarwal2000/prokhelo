const router = require('express');
const authController = require('../controllers/authController');
const app = router();
const {loginAndSignupPage} = require('../middleware/authMiddleware');


app.get('/login', loginAndSignupPage, authController.login_get);

app.get('/signup', loginAndSignupPage, authController.signup_get);

app.post('/login', authController.login_post);

app.post('/signup', authController.signup_post);

app.get('/logout', authController.logout_get);

module.exports = app;