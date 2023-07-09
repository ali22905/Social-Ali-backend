# Social-Ali

## Description
Social-Ali is a social media app made with the MERN stack. This repository contains the API part of the app. It allows you to share your thoughts, moments, and photos with your friends and other people.

## Technologies Used
- Node.js
- Express.js
- jwt
- MongoDB

## Motivation
I created this website because I have always liked Instagram since I was a kid. I wanted to create something similar, so I put in a lot of effort and research to bring this project to life.

## Code Example
Here is an example code snippet from the API:

```javascript
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
```

## Contact Information
- Name: Ali Attia
- Email: aly2292005@gmail.com
- Phone Number: +201027393406