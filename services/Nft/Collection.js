import mongoose from "mongoose";

const NFTCollectionSchema = new mongoose.Schema(
  {
      logo: {
          type: String,
          required: true
      },
      name: {
          type: String,
          required: true,
          unique: true
      },
      description: {
          type: String,
          max: 1000
      },
      creator: {
          type: mongoose.Types.ObjectId,
          required: true
      }
  },
  {
    timestamps: true,
  }
);

export const NFTCollection = mongoose.model("nft_collections", NFTCollectionSchema);

const create = (userId, {logo, name, description}) => {
    const nftCol = new NFTCollection({logo, name, description, creator: userId})

    return nftCol.save()
}

const getUserCollections = (userId) => {
    return new Promise((resolve, reject) => {
        NFTCollection.find({creator: userId}, (err, colls) => {
            if(err) return reject(err)
            return resolve(cols)
        })
    })
}


export const methods = {
    queries: {
        getUserCollections
    },
    commands: {
        create
    }
};

export default {
    NFTCollection,
  methods,
};
