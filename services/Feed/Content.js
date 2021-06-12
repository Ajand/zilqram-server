import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      enum: ["zweet", "photo"],
      default: "zweet",
    },
    body: {
      type: String,
      require: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    exclusive: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likers: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model("content", ContentSchema);

const create = (owner, { variant, body, exclusive }) => {
  const content = new Content({ owner, variant, body, exclusive });

  return content.save();
};

const like = (_id, liker) => {
  return new Promise((resolve, reject) => {
    get(_id)
      .then((nmeta) => {
        console.log(nmeta.likers, liker)
        if (nmeta.likers.includes(liker)) {
          const newLikers = nmeta.likers.filter(
            (lik) => String(lik) != String(liker)
          )
          Content.updateOne(
            { _id },
            {
              $set: {
                likers: newLikers,
                likes: newLikers.length,
              },
            },
            (err) => {
              if (err) return reject(err);
              return resolve("done");
            }
          );
        } else {
          Content.updateOne(
            { _id },
            {
              $set: {
                likers: [...nmeta.likers, liker],
                likes: nmeta.likes + 1,
              },
            },
            (err) => {
              if (err) return reject(err);
              return resolve("done");
            }
          );
        }
      })
      .catch((err) => reject(err));
  });
};

const remove = (_id) => {
  return new Promise((resolve, reject) => {
    Content.findOne({ _id }, (err, content) => {
      if (err) return reject(err);
      return resolve(content);
    });
  });
};

const get = (_id) => {
  return new Promise((resolve, reject) => {
    Content.findOne({ _id }, (err, content) => {
      if (err) return reject(err);
      return resolve(content);
    });
  });
};

const getOfOwner = (owner) => {
  return new Promise((resolve, reject) => {
    Content.find({ owner }, (err, contents) => {
      if (err) return reject(err);
      return resolve(contents);
    });
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    Content.find({}, (err, contents) => {
      if (err) return reject(err);
      return resolve(contents);
    });
  });
};

const methods = {
  queries: {
    get,
    getOfOwner,
    getAll
  },
  commands: {
    remove,
    create,
    like,
  },
};

export default methods;
