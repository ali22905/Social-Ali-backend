import User from "../models/User.js";

/* READ */ 
export const getUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    res.status(200).json(user);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    // make Promise.all when there is many promises. in this case we will make a promise to get each friend by his id from the DB
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // this is to format the code properly to the frontend
    const formattedFriends = friends.map(
      // here you are deducting each user data as params instead of typing "user.id, user,firstName, more"
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    // return the formattedFriends to the frontend
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};




/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    // the route:  "users/userID/friendID"
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // if the user friend list includes the friend passed in the params then remove this friend from the user's friend list
    if (user.friends.includes(friendId)) {
      // this will remove the friend from the user's friend list
      user.friends = user.friends.filter((id) => id !== friendId);
      // this will remove the user from the friend's friend list
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // else add the friend entered in the params to the friend list of the user and add the user to the friend entered in the params friends list
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    // save the 2 changes made
    await user.save();
    await friend.save();

    // get all the friends of the user
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // this is to format the code properly to the frontend
    const formattedFriends = friends.map(
      // here you are deducting each user data as params instead of typing "user.id, user,firstName, more"
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    // finally return the user's friend list after all that
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};




