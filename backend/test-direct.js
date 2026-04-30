const bcrypt = require('bcryptjs');

// Test with the exact password you used
const password = "123123123";

// Hash it
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log("New hash for '123123123':", hash);

// Test comparison
const isMatch = bcrypt.compareSync(password, hash);
console.log("Compare result:", isMatch);