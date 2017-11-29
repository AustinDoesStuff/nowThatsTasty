const express = require('express');
const router = express.Router();

const storeConroller = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeConroller.getStores));

router.get("/stores", catchErrors(storeConroller.getStores));

router.get('/add', authController.isLoggedIn, storeConroller.addStore);
router.post("/add",
  storeConroller.upload,
  catchErrors(storeConroller.resize),
  catchErrors(storeConroller.createStore)
);
router.post("/add/:id", catchErrors(storeConroller.updateStore));

router.get('/stores/:id/edit', catchErrors(storeConroller.editStore));

router.get('/store/:slug', catchErrors(storeConroller.getStoreBySlug));

router.get('/tags', catchErrors(storeConroller.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeConroller.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post("/register",
  userController.checkEmail,
  userController.validateRegister,
  userController.register,
  authController.login);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot));

router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

router.get('/map', storeConroller.mapPage);




//API

router.get('/api/search', catchErrors(storeConroller.searchStores));
router.get("/api/stores/near", catchErrors(storeConroller.mapStores));


module.exports = router;
