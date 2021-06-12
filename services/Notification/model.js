import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      enum: ["like", "comment", "follow"],
    },
    subject: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    actor: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    payload: {
      type: mongoose.Types.ObjectId,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("notification", NotificationSchema);

const create = ({ variant, subject, actor, payload }) => {
  const notif = new NotificationSchema({ variant, subject, actor, payload });

  return notif.save();
};

const getOfSubject = (subject) => {
  return new Promise((resolve, reject) => {
    Notification.find({ subject }, (err, notifs) => {
      if (err) return reject(err);
      return resolve(notifs);
    });
  });
};

const makeSeen = (userId) => {
  return new Promise((resolve, reject) => {
    Notification.updateMany({ subject: userId }, { seen: true }, (err) => {
      if (err) return reject(err);
      return resolve("seen");
    });
  });
};

const methods = {
  queries: {},
  commands: {
    create,
  },
};
