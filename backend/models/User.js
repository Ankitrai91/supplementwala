import mongoose from "mongoose"
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    supercashBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})



// export default mongoose.model("User", userSchema)
const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
console.log("User model collection:", User.collection.name)