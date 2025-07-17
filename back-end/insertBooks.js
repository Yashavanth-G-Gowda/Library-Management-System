import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BookModel from './models/bookModel.js';

dotenv.config();

// Branch mapping to convert non-standard names to correct codes
const branchMapping = {
  'chemical': 'che',
  'physics': 'phy', 
  'math': 'mat',
  'biotech': 'bt',
  'polymer': 'pst',
  'env': 'ev',
  'mech': 'me',
  'civil': 'cv'
};

// Books data
const booksData = [
  {
    "title": "Machine Learning",
    "author": "R.C. Hibbeler",
    "edition": "5",
    "branch": "ece",
    "booknumber": "BN1000",
    "copies": "2",
    "image": "https://example.com/images/book_1.jpg",
    "location": {
      "shelf": "C",
      "row": "1"
    },
    "tags": "hardware, biology, mathematics, software",
    "bestreccom": true
  },
  {
    "title": "Renewable Energy",
    "author": "Tanenbaum",
    "edition": "2",
    "branch": "che",
    "booknumber": "BN1001",
    "copies": "5",
    "image": "https://example.com/images/book_2.jpg",
    "location": {
      "shelf": "F",
      "row": "1"
    },
    "tags": "programming, ai",
    "bestreccom": false
  },
  {
    "title": "JavaScript Programming",
    "author": "Silberschatz",
    "edition": "2",
    "branch": "ca",
    "booknumber": "BN1002",
    "copies": "9",
    "image": "https://example.com/images/book_3.jpg",
    "location": {
      "shelf": "A",
      "row": "1"
    },
    "tags": "design, engineering, biology, ai",
    "bestreccom": false
  },
  {
    "title": "Computer Vision",
    "author": "Cormen",
    "edition": "4",
    "branch": "phy",
    "booknumber": "BN1003",
    "copies": "1",
    "image": "https://example.com/images/book_4.jpg",
    "location": {
      "shelf": "H",
      "row": "1"
    },
    "tags": "engineering, simulation, networks",
    "bestreccom": false
  },
  {
    "title": "Polymer Science",
    "author": "Jain & Jain",
    "edition": "3",
    "branch": "cse",
    "booknumber": "BN1004",
    "copies": "1",
    "image": "https://example.com/images/book_5.jpg",
    "location": {
      "shelf": "G",
      "row": "4"
    },
    "tags": "ai, simulation, networks, design",
    "bestreccom": false
  }
];

const insertBooks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing books (optional - remove this if you want to keep existing books)
    // await BookModel.deleteMany({});
    // console.log('Cleared existing books');

    // Process and insert books
    const processedBooks = booksData.map(book => {
      // Map branch name to correct code
      const correctBranch = branchMapping[book.branch] || book.branch;
      
      return {
        ...book,
        branch: correctBranch,
        availableBookNumbers: Array.from({ length: parseInt(book.copies) }, (_, i) => `${book.booknumber}-${String(i + 1).padStart(2, '0')}`)
      };
    });

    // Insert books
    const result = await BookModel.insertMany(processedBooks);
    console.log(`Successfully inserted ${result.length} books`);

    // Display summary
    const branchSummary = {};
    result.forEach(book => {
      branchSummary[book.branch] = (branchSummary[book.branch] || 0) + 1;
    });

    console.log('\nBooks by branch:');
    Object.entries(branchSummary).forEach(([branch, count]) => {
      console.log(`${branch}: ${count} books`);
    });

  } catch (error) {
    console.error('Error inserting books:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run insertion if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  insertBooks();
}

export default insertBooks; 