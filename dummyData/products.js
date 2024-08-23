import DUMMY_USERS from "./users.js";

const date = new Date();
const currentMonth = date.getMonth();

date.setMonth(currentMonth - 3);

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    postedBy: DUMMY_USERS[0].id,
    postedAt: date,
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'",
    images: [
      "https://plus.unsplash.com/premium_photo-1684445034959-b3faeb4597d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHRhYmxlfGVufDB8fDB8fHww",
    ],
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    postedBy: DUMMY_USERS[1].id,
    postedAt: date,
    images: [
      "https://plus.unsplash.com/premium_photo-1705937171534-def8d344cf6b?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    postedBy: DUMMY_USERS[2].id,
    postedAt: date,
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: [
      "https://images.unsplash.com/photo-1459603677915-a62079ffd002?q=80&w=2134&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://plus.unsplash.com/premium_photo-1667251760504-096946b820af?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  {
    id: 4,
    name: "Book",
    price: 10.99,
    postedBy: DUMMY_USERS[1].id,
    postedAt: date,
    images: [
      "https://plus.unsplash.com/premium_photo-1667251760504-096946b820af?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://media.istockphoto.com/id/1460007178/photo/library-books-on-table-and-background-for-studying-learning-and-research-in-education-school.webp?b=1&s=170667a&w=0&k=20&c=TRED57BZuROoCEP9kR85pW38PLz32onmM8106OoXeGQ=",
    ],
  },
  {
    id: 5,
    name: "Product 5",
    price: 3.15,
    postedBy: DUMMY_USERS[2].id,
    postedAt: date,
    images: [
      "https://plus.unsplash.com/premium_photo-1678718713393-2b88cde9605b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
];

export default DUMMY_PRODUCTS;
