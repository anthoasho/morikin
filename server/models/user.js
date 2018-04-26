var mongoose = require("mongoose"),
    bcrypt   = require("bcryptjs");

var userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  displayName:{
    type:String
  },
  description:{
    type:String
  },
  password:{
    type: String,
    required: true,
    select: false
  },
  profileImgUrl:{
    type: String,
  },
  profileColor:{
    type: String,
    default: "purple"
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }]
});
//Putting a follow count, should I do a following or followers, or both?

userSchema.pre('save', function(next){
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10).then(function(hashedPassword) {
      user.password = hashedPassword;
      next();
  }, function(err){
    return next(err);
  });
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return next(err);
    next(null, isMatch);
  });
};
var User = mongoose.model("User", userSchema);
module.exports = User;