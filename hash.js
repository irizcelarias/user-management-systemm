const bcrypt = require('bcryptjs');

bcrypt.hash("pass123", 10).then(hash => {
    console.log("✅ Paste this into your DB:");
    console.log(hash);
});
