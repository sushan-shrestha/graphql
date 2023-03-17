import { v4 as uuidV4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    console.log(args.data);
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email Taken");
    }
    const user = {
      id: uuidV4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(
      (user) => Number(user.id) === Number(args.id)
    );

    if (userIndex === -1) {
      return new Error("User not found");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    // remove associated posts
    db.posts = db.posts.filter((post) => {
      const match = post.author === Number(args.id);

      if (match) {
        // remove comments of given post
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    // remove associated comments
    db.comments = db.comments.filter((post) => post.author !== Number(args.id));

    return deletedUsers;
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === Number(id));

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email has already been taken");
      }
      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (data.age !== undefined) {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    // createPost(title: String!, body: String!, published: Boolean!, author: User!): Post!
    const isValidUser = db.users.some((user) => {
      return user.id === Number(args.data.author);
    });

    if (!isValidUser) {
      throw new Error("User not found.");
    }

    const post = {
      id: uuidV4(),
      ...args.data,
      author: Number(args.data.author),
    };

    db.posts.push(post);

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === Number(id));
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (!post.published && originalPost.published) {
        // deleted
        pubsub.publish(`post`, {
          post: {
            mutation: "DELETED",
            data: post,
          },
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish(`post`, {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      } else if (post.published && originalPost.published) {
        pubsub.publish(`post`, {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(
      (post) => Number(post.id) === Number(args.id)
    );

    if (postIndex === -1) {
      return new Error("Post not found");
    }

    const deletedPosts = db.posts.splice(postIndex, 1);

    // remove comments of given post
    db.comments = db.comments.filter(
      (comment) => comment.post !== Number(args.id)
    );

    if (deletedPosts[0].published) {
      pubsub.publish(`post`, {
        post: {
          mutation: "DELETED",
          data: deletedPosts[0],
        },
      });
    }

    return deletedPosts[0];
  },

  createComment(parent, args, { db, pubsub }, info) {
    // text post author
    const isValidUser = db.users.some(
      (user) => user.id === Number(args.data.author)
    );
    const isValidPost = db.posts.some(
      (post) => post.id === Number(args.data.post) && post.published
    );

    if (!isValidPost || !isValidUser) {
      throw new Error("Invalid data provided");
    }

    const comment = {
      id: uuidV4(),
      ...args.data,
      author: Number(args.data.author),
      post: Number(args.data.post),
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const deletedCommentIndex = db.comments.findIndex(
      (comment) => Number(comment.id) === Number(args.id)
    );

    if (deletedCommentIndex === -1) {
      throw new Error("Invalid comment ID");
    }

    const deletedComments = db.comments.splice(deletedCommentIndex, 1);

    pubsub.publish(`comment ${deletedComments[0].post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComments[0],
      },
    });

    return deletedComments[0];
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === Number(id));

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof comment.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export default Mutation;
