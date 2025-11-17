// seedPractitioners.js
import bcrypt from "bcryptjs";
import Practitioner from "./models/Practitioner.js";

export const seedPractitioners = async () => {
  try {
    const practitioners = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "jd12@students.uwf.edu",
        password: "Password123!",
        role: "practitioner",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "js34@students.uwf.edu",
        password: "Password1234!",
        role: "practitioner",
      },
      {
        firstName: "Alice",
        lastName: "Johnson",
        email: "aj56@students.uwf.edu",
        password: "Password12345!",
        role: "practitioner",
      },
    ];

    // Remove all existing practitioners
    await Practitioner.deleteMany({});

    for (const data of practitioners) {
      const hashed = await bcrypt.hash(data.password, 10);

      await Practitioner.create({
        ...data,
        password: hashed,
      });
    }

    console.log("Practitioners seeded successfully!");
  } catch (err) {
    console.error("Error seeding practitioners:", err);
  }
};
