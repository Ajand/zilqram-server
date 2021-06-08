import mongoose from "mongoose";

const NFTCollectionSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      max: 1000,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    contractAddress: {
      type: String,
      requried: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NFTCollection = mongoose.model(
  "nft_collections",
  NFTCollectionSchema
);

const create = (userId, { logo, name, description, contractAddress }) => {
  const nftCol = new NFTCollection({
    logo,
    name,
    description,
    creator: userId,
    contractAddress,
  });

  return nftCol.save();
};

const getUserCollections = (userId) => {
  return new Promise((resolve, reject) => {
    NFTCollection.find({ creator: userId }, (err, colls) => {
      if (err) return reject(err);
      return resolve(colls);
    });
  });
};

const get = (_id) => {
  return new Promise((resolve, reject) => {
    NFTCollection.findOne({ _id }, (err, coll) => {
      if (err) return reject(err);
      return resolve(coll);
    });
  });
};

export const methods = {
  queries: {
    getUserCollections,
    get,
  },
  commands: {
    create,
  },
};

export default {
  NFTCollection,
  methods,
};
