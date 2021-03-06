import mongoose from "mongoose";

const NFTMetaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    external_url: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    properties: [
      {
        trait_type: String,
        value: String,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    views: {
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

const NFTMeta = mongoose.model("nftMeta", NFTMetaSchema);

const create = ({
  _id,
  name,
  image,
  external_url,
  properties,
  description,
}) => {
  const nftMeta = new NFTMeta({
    _id,
    name,
    image,
    external_url,
    properties,
    description,
  });

  return nftMeta.save();
};

const like = (_id, liker) => {
  return new Promise((resolve, reject) => {
    getInternal(_id)
      .then((nmeta) => {
        if (nmeta.likers.includes(liker)) {
          NFTMeta.updateOne(
            { _id },
            {
              $set: {
                likers: nmeta.likers.filter(
                  (lik) => String(lik) != String(liker)
                ),
                likes: nmeta.likes - 1,
              },
            },
            (err) => {
              if (err) return reject(err);
              return resolve("done");
            }
          );
        } else {
          NFTMeta.updateOne(
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

const increaseView = (_id) => {
  return new Promise((resolve, reject) => {
    NFTMeta.updateOne(
      { _id },
      {
        $inc: { views: 1 },
      },
      (err) => {
        if (err) reject(err);
        return resolve("done");
      }
    );
  });
};

const get = (_id) => {
  return new Promise((resolve, reject) => {
    NFTMeta.findOne({ _id }, (err, nmta) => {
      if (err) return reject(err);
      increaseView(_id)
        .then(() => resolve(nmta))
        .catch((err) => resolve(nmta));
    });
  });
};

const getInternal = (_id) => {
  return new Promise((resolve, reject) => {
    NFTMeta.findOne({ _id }, (err, nmta) => {
      if (err) return reject(err);
      return resolve(nmta);
    });
  });
};

const methods = {
  queries: {
    get,
  },
  commands: {
    create,
    like
  },
};

export default methods;
