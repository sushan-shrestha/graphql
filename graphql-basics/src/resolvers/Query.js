const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) return db.users;

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return posts;

    return db.posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    });
  },
  me() {
    return {
      id: "abc123",
      name: "Sushan Shrestha",
      email: "sushan.shr10@gmail.com",
    };
  },
  post() {
    return {
      id: "abc123",
      title: "My Photo",
      body: "This is a body of the title.",
      published: true,
    };
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export default Query;
