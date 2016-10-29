var mongoose = require('mongoose');

// Instructor Schema

var instructorSchema = mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  address: [{
    street_address:{type: String},
    city:{type: String},
    state:{type: String},
    zip:{type: String}
  }],
  username: {
    type: String
  },
  email: {
    type: String
  },
  classes:[{
    class_id:{type: [mongoose.Schema.Types.ObjectId]},
    class_title:{type: String},
  }]
});

var Instructor =  module.exports = mongoose.model('Instructor', instructorSchema);


// Fetch Single Class
module.exports.getInstructorByUsername = function(username, callback){
    var query = {username: username};
    Instructor.findOne(query, callback);
};

// Register Instructor for Class
module.exports.register = function(info, callback){

    instructor_username = info['instructor_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];

    var query = {username: instructor_username};

    Instructor.findOneAndUpdate(
      query,
      {$push: {"classes":
      {
        class_id: class_id,
        class_title: class_title
      }}},
      {save: true, upsert: true},
      callback
    );
};