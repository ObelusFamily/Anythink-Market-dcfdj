const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

const NUMBER_OF_USERS = 100;
const NUMBER_OF_ITEM = 100;
const NUMBER_OF_COMMENT = 100;

const createMockUser = (overrides) => ({
  username: faker.name.firstName() + faker.random.alphaNumeric(5),
  email: faker.internet.email(),
  bio: faker.lorem.paragraph(),
  image: faker.image.avatar(),
  role: faker.helpers.arrayElement(["user", "admin"]),
  ...overrides,
});

const createMockItem = (overrides) => ({
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  image: faker.image.image(),
  ...overrides,
});

const createMockComment = (override) => ({
  body: faker.lorem.paragraph(),
  ...override,
});

const createMockList = (length, builder) => Array.from({ length }).map(builder);

if (!process.env.MONGODB_URI) {
  console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}

seedDB();

async function seedDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  require("./models/User");
  require("./models/Item");
  require("./models/Comment");
  const User = mongoose.models.User;
  const Item = mongoose.models.Item;
  const Comment = mongoose.models.Comment;

  await User.deleteMany({});
  await User.insertMany(createMockList(NUMBER_OF_USERS, createMockUser));

  await Item.deleteMany({});
  await Item.insertMany(createMockList(NUMBER_OF_ITEM, createMockItem));

  await Comment.deleteMany({});
  await Comment.insertMany(
    createMockList(NUMBER_OF_COMMENT, createMockComment)
  );

  process.exit();
}
