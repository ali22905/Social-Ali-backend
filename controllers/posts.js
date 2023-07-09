import Post from "../models/Post.js";
import User from "../models/User.js";


/* CREATE */
export const createPost = async (req, res) => {
  try {
    // this is only the data coming from the frontend
    const { userId, description, picturePath } = req.body;

    // get the logged in user who created the post
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    // to return all the posts
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};





/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    // return all the posts for the discover feed in frontend
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};





/* UPDATE */
export const likePost = async (req, res) => {
  try {
    // the id of the registered user
    const { userId } = req.body;
    // the id of the post from params
    const { id } = req.params;
    const post = await Post.findById(id);

    // will get the key with the userId from the post.likes object
    // ex for the post.likes object:  {id1: true, id2: true, id3: true}
    const isLiked = post.likes.get(userId);

    // if the logged in user is found in the post.likes remove him (remove like from post)
    if (isLiked) {
      post.likes.delete(userId);
    } else {
    // if logged in user is not found in the post liked users object add the logged user (like post)
      post.likes.set(userId, true);
    }

    // update the post and return a the new updated post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

