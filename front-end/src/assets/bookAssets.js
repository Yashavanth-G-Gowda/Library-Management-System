import co_6 from '../assets/books/cseBooks/co-6.jpg'
import daa_3 from '../assets/books/cseBooks/daa-3.webp'
import se_8 from '../assets/books/cseBooks/se-8.jpg'
import os_9 from '../assets/books/cseBooks/os-9.jpg'

// ece books
import ece_1 from '../assets/books/eceBooks/ece-1.jpg'

export const books = [
    {
        _id: "ansic",
        title: "Programming in Ansi C",
        edition: "6",
        author: "E Balaguruswamy",
        branch:"cse",
        booknumber: "111",
        copies: "1",
        image: "https://rukminim2.flixcart.com/image/832/832/kjabs7k0-0/book/v/c/u/programming-in-ansi-c-original-imafyw6h8bycv3pg.jpeg",
        location: {
            shelf: "A3",
            row: "2",
        },
        tags: "C Programming",
        bestreccom: true,
    },
    {
        _id: "javar",
        title: "Java: The Complete Reference",
        edition: "11",
        author: "Herbert Schildt",
        branch:"cse",
        booknumber: "121",
        copies: "2",
        image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjDD1JYHVa3UVIFztJz-Oc9LxzpQumNbOdt91bd5Vb_b3epOWuULRhGE24UA4TGF7YfqChDaer-duvb0v7GcbMJqZyBQIbqpQCokzOEJ4z9-_QUi-sglKLodPhOAxrt4-_0LsiSUHLGk6f5v9Aw0AE8pppUJ9n4pUGO7s4VI2tJvvpNoe1jPxsOIMv/s561/Background+-+Copy+(11).jpeg",
        location: {
            shelf: "A3",
            row: "3",
        },
        tags: "Java Programming",
        bestreccom: true,
    },
    {
        _id: "dsdesgn",
        title: "Digital Principles and Applications",
        edition: "7",
        author: "Donald P Leach, Albert Paul Malvino and Goutam Saha ",
        booknumber: "131",
        branch:["cse","ece","eee"],
        copies: "1",
        image: "https://universalbooksellers.com/wp-content/uploads/2021/02/digital-principles-and-applications-original-imafscf2athmdrur.jpeg",
        location: {
            shelf: "A3",
            row: "1",
        },
        tags: "digital design",
        bestreccom: true,
    },
    {
        _id: "coes",
        title: "Computer Organization and Embedded Systems ",
        edition: "6",
        author: "Carl V Hamacher, Zvonko Vranesic",
        booknumber: "141",
        branch:"cse",
        copies: "1",
        image:co_6,
        location: {
            shelf: "A3",
            row: "4",
        },
        tags: "Computer Organisation",
        bestreccom: false,
    },
    {
        _id: "opsytm",
        title: "Operating system concepts",
        edition: "9",
        author: "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne ",
        booknumber: "151",
        branch:"cse",
        copies: "0",
        image:os_9,
        location: {
            shelf: "A3",
            row: "5",
        },
        tags: "OS",
        bestreccom: true,
    },
    {
        _id: "stwreng",
        title: "Software Engineering-A Practitioners approach ",
        edition: "8",
        author: "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne ",
        booknumber: "161",
        branch:"cse",
        copies: "1",
        image:se_8,
        location: {
            shelf: "A2",
            row: "1",
        },
        tags: "Software",
        bestreccom: false,
    },{
        _id: "addalg",
        title: "Introduction to The Design & Analysis of Algorithms",
        edition: "3",
        author: "Anany Levitin",
        booknumber: "171",
        branch:"cse",
        copies: "1",
        image:daa_3,
        location: {
            shelf: "A2",
            row: "2",
        },
        tags: "DAA",
        bestreccom: true,
    },
    {
        _id: "ecect",
        title: "Electronic Devices and Circuit Theory",
        edition: "11",
        author: "Robert Boyelstad",
        booknumber: "211",
        branch:"ece",
        copies: "1",
        image:ece_1,
        location: {
            shelf: "B2",
            row: "1",
        },
        tags: "ECE",
        bestreccom: true,
    },
];
books.forEach(book => {
    book.status = Number(book.copies) === 0 ? "unavailable" : "available";
});