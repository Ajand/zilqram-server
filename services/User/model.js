import mongoose from "mongoose";
import keygen from "keygen";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    displayName: String,
    avatar: String,
    bio: String,
    setted: {
      type: Boolean,
      default: false,
    },
    nounce: {
      type: String,
      required: true,
    },
    addresses: [String],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("user", UserSchema);

const getUserByAddress = (address) => {
  return new Promise((resolve, reject) => {
    User.findOne({ addresses: { $in: [address] } }, (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error("No user found!"));
      return resolve(user);
    });
  });
};

const get = (_id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id }, (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error("No user found!"));
      return resolve(user);
    });
  });
};

const create = (address) => {
  return new Promise((resolve, reject) => {
    getUserByAddress(address)
      .then(() => {
        return reject(new Error("User already existed."));
      })
      .catch((err) => {
        const nounce = keygen.url(20);
        const user = new User({
          addresses: [address],
          nounce,
        });
        return resolve(user.save());
      });
  });
};

const reNounce = (user) => {
  return new Promise((resolve, reject) => {
    const nounce = keygen.url(20);
    User.updateOne(
      { _id: user._id },
      {
        $set: { nounce },
      },
      (err) => {
        if (err) return reject(err);
        return resolve("Ronounced Successfully.");
      }
    );
  });
};

const completeProfile = (userId, { avatar, username, displayName, bio }) => {
  return new Promise((resolve, reject) => {
    User.updateOne(
      { _id: userId },
      {
        $set: {
          avatar,
          username,
          displayName,
          bio,
          setted: true,
        },
      },
      (err) => {
        if(err) return reject(err)
        return resolve('done')
      }
    );
  });
};

export const methods = {
  queries: {
    getUserByAddress,
    get,
  },
  commands: {
    create,
    reNounce,
    completeProfile,
  },
};

export default {
  User,
  methods,
};
