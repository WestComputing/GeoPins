const user = {
  _id: "1",
  name: "THX-1138",
  email: "thx@1138.com",
  picture: "https://cloudinary.com/1138"
};

module.exports = {
  Query: {
    me: () => user
  }
};
