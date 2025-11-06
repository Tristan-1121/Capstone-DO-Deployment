//seed file for practitioner role
import Practitioner from './models/Practitioner.js';
import mongoose from 'mongoose';


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
                Password: "password123",
            },
            {
                Email: "alicejohnson@example.com",
                Name: "Alice Johnson",
                Password: "password123",
            },
        ];

        await Practitioner.insertMany(practitioners);
        console.log("Practitioners seeded successfully");
    } catch (error) {
        console.error("Error seeding practitioners:", error);
    } finally {
        mongoose.connection.close();
    }
};

export { seedPractitioners };