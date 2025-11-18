import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["candidate", "employer"],
      required: true,
    },

    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },

    phone: { type: String, default: "" },
    skills: [{ type: String }],
    experience: { type: String, default: "" },
    resume: { type: String, default: "" },

    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    companyLogo: { type: String, default: "" },

    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ============================
   HASH PASSWORD
============================ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ============================
   COMPARE PASSWORD
============================ */
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
