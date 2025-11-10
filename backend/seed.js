//seed file for practitioner role
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import practitioner from './models/Practitioner.js';


export const seedPractitioners = async () => {
  try {

    const practitioners = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'jd12@students.uwf.edu',
        password: 'Password123!',
        role: 'practitioner',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'js34@students.uwf.edu',
        password: 'Password1234!',
        role: 'practitioner',
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'aj56@students.uwf.edu',
        password: 'Password12345!',
        role: 'practitioner',
      },
    ];


    // Remove existing practitioner users (avoid duplicates while dev’ing)
    await User.deleteMany({ role: 'practitioner' });

    // Remove existing practitioners from the Practitioner model
    await practitioner.deleteMany({});
    // Create each practitioner so pre('save') middleware hashes passwords
    for (const data of practitioners) {
      const user = new User(data); 
      await user.save()
      const practitionerInstance = new practitioner(data);
      practitionerInstance.password = await bcrypt.hash(data.password, 10);
      await practitionerInstance.save();
    }

    console.log('Practitioner users seeded successfully');
  } catch (error) {
    console.error('Error seeding practitioners:', error);
  }
};