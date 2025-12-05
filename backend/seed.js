// backend/seed.js
// Seeds practitioner accounts only when none exist.
// Prevents data loss on server restart.

import bcrypt from "bcryptjs";
import Practitioner from "./models/Practitioner.js";
import User from "./models/User.js";

export const seedPractitioners = async () => {
  try {
    // Check if practitioners already exist
    const existing = await Practitioner.countDocuments();

    // If any practitioners exist, do NOT run seeding again
    if (existing > 0) {
      console.log("Practitioners already exist — skipping seeding.");
      return;
    }

    console.log("No practitioners found — running initial seed…");

    const list = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "jd14@uwf.edu",
        password: "Password123!",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "js36@uwf.edu",
        password: "Password1234!",
      },
      {
        firstName: "Alice",
        lastName: "Johnson",
        email: "aj57@uwf.edu",
        password: "Password12345!",
      },
    ];

    for (const p of list) {
      // hash password for Practitioner model
      const hashed = await bcrypt.hash(p.password, 10);

      // create Practitioner entry
      const practitioner = await Practitioner.create({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email.toLowerCase(),
        password: hashed,
        role: "practitioner",
      });

      // create matching User entry
      await User.create({
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: `${p.firstName} ${p.lastName}`,
        email: p.email.toLowerCase(),
        password: p.password, // User model will hash automatically
        role: "practitioner",
        practitionerId: practitioner._id,
      });

      console.log(`✓ Created Practitioner + User for ${p.email}`);
    }

    console.log("Practitioner seeding complete.");
  } catch (err) {
    console.error("Error seeding practitioners:", err);
  }
};
