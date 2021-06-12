import mongoose from "mongoose";

const TierSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    benefits: [String],
    icon: {
      type: String,
      default: "bronze",
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Tier = mongoose.model("tiers", TierSchema);


const create = (owner, {title, description, benefits, icon}) => {
    const tier = new Tier({title, description, benefits, icon, owner})
    return tier.save()
}

const remove = (_id) => {
    return new Promise((resolve, reject) => {
        Tier.remove({_id}, (err, tier) => {
            if(err) return reject(err)
            return resolve("done")
        })
    })
}

const get = (_id) => {
    return new Promise((resolve, reject) => {
        Tier.findOne({_id}, (err, tier) => {
            if(err) return reject(err)
            return resolve(tier)
        })
    })
}

const getOfOwner = (owner) => {
    return new Promise((resolve, reject) => {
        Tier.find({owner}, (err, tiers) => {
            if(err) return reject(err)
            return resolve(tiers)
        })
    })
}

const methods = {
    queries: {
        get,
        getOfOwner
    },
    commands: {
        create,
        remove
    }
}

export default methods