import mongoose from "mongoose";

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const errorMessages = {
  email: {
    required: "وارد کردن پست الکترونیکی الزامی است.",
    notValid: "پست الکترونیکی صحیح نمی‌باشد.",
  },
  username: {
    required: "وارد کردن نام‌ کاربری الزامی است.",
    min: "نام کاربری می‌بایست حداقل ۳ حرفی باشد.",
    max: "نام کاربری می‌بایست حداکثر ۱۸ حرفی باشد.",
  },
  password: {
    required: "رمز‌عبور الزامی می‌باشد.",
  },
};

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: errorMessages.email.required,
      validate: [validateEmail, errorMessages.email.notValid],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        errorMessages.email.notValid,
      ],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: errorMessages.username.required,
      min: [3, errorMessages.username.min],
      max: [18, errorMessages.username.max],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    credentials: {
      password: {
        type: String,
        required: true,
      },
      verificationKey: String,
      resetPassword: {
        key: String,
        dueDate: Date,
      },
    },
    personal: {
      firstName: String,
      lastName: String,
      birthDay: String,
      avatar: String,
      bio: String,
      setted: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

export default User;
