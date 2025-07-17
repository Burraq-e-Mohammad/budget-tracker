const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BudgetEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  transactionName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
  type: String,
  required: true,
  unique: true,
},
  password: String,
  amount: Number ,
  budgetEntries: [BudgetEntrySchema],
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Compare entered password with hashed password
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
