// config/passport.js
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User');
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
passport.use('local-user',User.createStrategy({usernameField: 'email',})); // Use passport-local-mongoose strategy
passport.use('local-admin', Admin.createStrategy({usernameField: 'email',}));
// Serialize user to session
passport.serializeUser((user, done) => {
    const userType = user instanceof User ? 'user' : 'admin';
    done(null, { id: user._id, type: userType });
  });
  
  passport.deserializeUser(async ({ id, type }, done) => {
    try {
      const Model = type === 'user' ? User : Admin;
      const user = await Model.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  

// module.exports = passport;
export default passport;