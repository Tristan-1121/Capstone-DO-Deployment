//seed file for practitioner role
import Practitioner from './models/Practitioner.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const seedPractitioners = async () => {
    try {
        const practitioners = [
            {
                Email: "johndoe@example.com",
                Name: "John Doe",
                Password: "password123",
               
            },
            {
                Email: "janesmith@example.com",
                Name: "Jane Smith",
                Password: "password1234",
            },
            {
                Email: "alicejohnson@example.com",
                Name: "Alice Johnson",
                Password: "password12345",
            }
        ];
        // Hash passwords before inserting
        for (let practitioner of practitioners) {
            const salt = await bcrypt.genSalt(10);
            practitioner.Password = await bcrypt.hash(practitioner.Password, salt);
        }
        await Practitioner.insertMany(practitioners);
        console.log("Practitioners seeded successfully");
    } catch (error) {
        console.error("Error seeding practitioners:", error);
    }
};

export { seedPractitioners };