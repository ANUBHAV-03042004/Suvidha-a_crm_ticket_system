
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import User from '../models/User.js';
// import Admin from '../models/Admin.js';
// passport.use('local-user',User.createStrategy({usernameField: 'email',})); // Use passport-local-mongoose strategy
// passport.use('local-admin', Admin.createStrategy({usernameField: 'email',}));
// // Serialize user to session
// passport.serializeUser((user, done) => {
//     const userType = user instanceof User ? 'user' : 'admin';
//     done(null, { id: user._id, type: userType });
//   });
  
//   passport.deserializeUser(async ({ id, type }, done) => {
//     try {
//       const Model = type === 'user' ? User : Admin;
//       const user = await Model.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });
  

// // module.exports = passport;
// export default passport;


import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

passport.use('local-user', User.createStrategy({ usernameField: 'email' }));
passport.use('local-admin', Admin.createStrategy({ usernameField: 'email' }));

// Serialize user to session
passport.serializeUser((user, done) => {
  const userType = user instanceof User ? 'user' : 'admin';
  console.log('Serializing user:', { id: user._id, type: userType, email: user.email });
  done(null, { id: user._id, type: userType });
});

// Deserialize user from session
passport.deserializeUser(async ({ id, type }, done) => {
  try {
    console.log('Deserializing user:', { id, type });
    const Model = type === 'user' ? User : Admin;
    const user = await Model.findById(id);
    if (!user) {
      console.log('User not found:', { id, type });
      return done(null, false);
    }
    console.log('Deserialized user:', { id: user._id, email: user.email });
    done(null, user);
  } catch (err) {
    console.error('Deserialize error:', err);
    done(err);
  }
});

export default passport;