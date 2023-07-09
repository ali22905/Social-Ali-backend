import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    // the likes is an object not string to increase performance because for ex: if a user has 20000 likes you will have to loop through each one and that will decrease preformeance and effiency
    // it will be like this {"some_user_id": true, "other_user": true}
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  // this will make the created and updated values in the object
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;