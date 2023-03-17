// Demo User Data

const users = [
  {
    id: 1,
    name: "Sushan",
    email: "sushan@example.com",
    age: 29,
  },
  {
    id: 2,
    name: "Subha",
    email: "subha@example.com",
  },
  {
    id: 3,
    name: "Shanvi",
    email: "shanvi@example.com",
    age: 3,
  },
];

// Demo Post Data

const posts = [
  {
    id: 1,
    title: "The Boys",
    body: "This is the body of The Boys",
    published: false,
    author: 1,
  },
  {
    id: 2,
    title: "Coolest System",
    body: "This is the body of coolest system",
    published: true,
    author: 1,
  },
  {
    id: 3,
    title: "Hardy Boys",
    body: "This is the body of Hardy Boys",
    published: false,
    author: 3,
  },
  // {
  //   id: 4,
  //   title: "The Joy",
  //   body: "This is the body of The Joy",
  //   published: false,
  //   author: 2,
  // },
];

// comments
const comments = [
  {
    id: 1,
    text: "First Comment",
    author: 1,
    post: 1,
  },
  {
    id: 2,
    text: "Second Comment",
    author: 2,
    post: 1,
  },
  {
    id: 3,
    text: "Third Comment",
    author: 1,
    post: 2,
  },
  {
    id: 4,
    text: "Fourth Comment",
    author: 3,
    post: 3,
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
