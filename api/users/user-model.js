const db = require("../../data/db-config.js");

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove,
};

async function findPosts(user_id) {
  const row = await db("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .select("p.id as post_id", "contents", "username")
    .where("p.user_id", user_id);
  console.log(row);
  return row;
  // SQL STUDIO COMMANDS:
  //select
  //   p.id as post_id,
  //   contents,
  //   username
  // from posts as p
  // join users as u
  //   on p.user_id = u.id;

  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

async function find() {
  const row = await db("users as u")
    .leftJoin("posts as p", "u.id", "p.user_id")
    .count("p.id as post_count")
    .groupBy("u.id")
    .select("u.id as user_id", "username");
  console.log(row);
  return row;

  //SQL STUDIO QUERY
  //   select
  //     u.id as user_id,
  //     username,
  //     count(p.id) as post_count
  // from users as u
  // left join posts as p
  //     on u.id = p.user_id
  // group by u.id;

  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const rows = await db("users as u")
    .leftJoin("posts as p", "u.id", "p.user_id")
    .select("u.id as user_id", "username", "contents", "p.id as post_id")
    .where("u.id", id);
  console.log(rows);
  const result = {
    user_id: rows[0].user_id,
    username: rows[0].username,
    posts: [],
  };
  rows.forEach((row) => {
    if (row.post_id) {
      result.posts.push({ post_id: row.post_id, contents: row.contents });
    }
  });
  return result;

  //  SQL STUDIO QUERY:
  //   select
  //     u.id as user_id,
  //     username,
  //     contents,
  //     p.id as post_id
  // from users as u
  // left join posts as p
  //     on u.id = p.user_id
  // where u.id = 2;
  //return db('users').where({ id }).first()
  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db("users")
    .insert(user)
    .then(([id]) => {
      // eslint-disable-line
      return findById(id);
    });
}

function remove(id) {
  // returns removed count
  return db("users").where({ id }).del();
}
