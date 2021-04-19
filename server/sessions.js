/**
 * @author Brandon T, Taylor R., Remy M., Jacob J., Daniel F.
 * @version 0.0.1
 * @description This is the API for the Syncopate client which handles user requests to either
 * create, join, or destroy music listening sessions. The API stores user session data within a
 * MongoDB cluster. The POST method ensures user is creating unique session name, and GET method
 * to join a session ensures session already exists and user has provided valid password.
 */
 import swaggerJSDoc from 'swagger-jsdoc'; // Will be used for creating API specific documentation in the future
 import pkg from 'swagger-ui-express'; // Will be used to generate nice HTML/CSS pages for documentation in future
 import express, { json } from 'express'; // Express API library
 import session from 'express-session'; // Used to store and manage user sessions
 import MongoStore from 'connect-mongo'; // Database for backend storage of user data
 import mongoose from 'mongoose';
 // eslint-disable-next-line import/extensions
 import { sessionSecret, URL } from './secrets.js'; // Holds private backend information not to be displayed on GitHub

 const { serve, setup } = pkg;

 //     var privateName = ID();
//     var o = { 'public': 'foo' };
//     o[privateName] = 'bar';
var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  function checkDuplicates(generator, count){
    var hash = {};
    var dupe = [];
    for(var idx = 0; idx < count; ++idx){
      var gen = generator(idx); // generate our unique ID
  
      // if it already exists, then it has been duplicated
      if(typeof hash[gen] != 'undefined'){
        dupe.push({
          duplicate: gen,
          indexCreated: hash[gen],
          indexDuplicated: idx,
          duplicateCount: dupe.filter(function(cur){return cur.duplicate == gen}).length,
        });
      }
      hash[gen] = idx;
    }
    return dupe;
  }

  var syncopateID = ID();
  while(checkDuplicates(syncopateID, 1).length != 0)
  {
      syncopateID = ID();
  }
