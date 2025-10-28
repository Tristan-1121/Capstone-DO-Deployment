import mongoose from 'mongoose';
import bcrypt from 'bcryptjs' 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


//Before saing a user data to the DB, automatically hash the password:
userSchema.pre("save", async function(next){

    //So if the password wasn't changed, we skip the hashing
    if(!this.isModified("password")) return next();

    //Generate a salt (random string to strengthen the hash)
     const salt = await bcrypt.genSalt(10);

     //Hash the password with the salt
     this.password = await bcrypt.hash(this.password, salt)

     //Then we move to the next middleware
     next();
})

//Let add our custom method to compare the entered password with the hashed password to see if they match
userSchema.methods.matchPassword = async function (enteredPassword) {
     return await bcrypt.compare(enteredPassword, this.password);
};



/*The reason why I proposed to hash the passwords here is instead in the routes,
 is because this ensure they are ashed consistently and securely no matter
where or how user is saved to avoid repetions and potential erors*/

const User = mongoose.model("User", userSchema);

export default User;
