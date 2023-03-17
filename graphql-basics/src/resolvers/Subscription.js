const Subscription = {
  comment: {
    subscribe(parent, { postId }, { pubsub, db }, info) {
      const postExists = db.posts.find(
        (post) => Number(post.id) === Number(postId) && post.published
      );
      if (!postExists) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator(`post`);
    },
  },
};

export default Subscription;
