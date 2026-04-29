import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db.js";

const seedUserEmail = process.env.SEED_USER_EMAIL ?? "seed@movies.local";
const seedUserPassword = process.env.SEED_USER_PASSWORD ?? "SeedUser123!";

const movies = [
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    genres: ["Sci-Fi"],
    runtime: 148,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "The Dark Knight",
    overview:
      "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    genres: ["Action"],
    runtime: 152,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["Adventure"],
    runtime: 169,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseYear: 1999,
    genres: ["Sci-Fi"],
    runtime: 136,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    releaseYear: 2001,
    genres: ["Fantasy"],
    runtime: 178,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "The Shawshank Redemption",
    overview:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    genres: ["Crime"],
    runtime: 154,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    genres: ["Crime"],
    runtime: 175,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
  {
    title: "The Godfather: Part II",
    overview:
      "The early life and career of Vito Corleone in 1920s New York City is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.",
    releaseYear: 1974,
    genres: ["Crime"],
    runtime: 202,
    posterUrl: "https://m.media-amazon.com/images/I/51s+qjv9ZlL._AC_.jpg",
  },
];

const ensureSeedUser = async () => {
  const password = await bcrypt.hash(seedUserPassword, 10);

  return prisma.user.upsert({
    where: { email: seedUserEmail },
    update: {},
    create: {
      name: "Movie Seed User",
      email: seedUserEmail,
      password,
    },
  });
};

const main = async () => {
  console.log("Seeding database with movies...");

  const seedUser = await ensureSeedUser();

  for (const movie of movies) {
    const existingMovie = await prisma.movie.findFirst({
      where: {
        title: movie.title,
        createdBy: seedUser.id,
      },
      select: { id: true },
    });

    if (existingMovie) {
      console.log(`Skipped existing movie: ${movie.title}`);
      continue;
    }

    await prisma.movie.create({
      data: {
        ...movie,
        createdBy: seedUser.id,
      },
    });

    console.log(`Created movie: ${movie.title}`);
  }

  console.log("Database seeding completed.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
