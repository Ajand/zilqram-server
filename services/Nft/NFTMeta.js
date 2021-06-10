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

const get = (_id) => {
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
  },
};

export default methods;
