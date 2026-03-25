export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  quantity: number;
  available: number;
  coverUrl?: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  avatar?: string;
  joinedDate: string;
  borrowedBooks: number;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  lastUpdated: string;
  type: 'book' | 'supply';
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  type: 'borrow' | 'return' | 'add' | 'update';
}

export const books: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', isbn: '978-0743273565', quantity: 12, available: 8, status: 'available' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', isbn: '978-0061120084', quantity: 15, available: 2, status: 'low-stock' },
  { id: '3', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', isbn: '978-0062316097', quantity: 8, available: 0, status: 'out-of-stock' },
  { id: '4', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', isbn: '978-0132350884', quantity: 6, available: 4, status: 'available' },
  { id: '5', title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', isbn: '978-0735211292', quantity: 20, available: 15, status: 'available' },
  { id: '6', title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', isbn: '978-0441013593', quantity: 10, available: 1, status: 'low-stock' },
  { id: '7', title: 'The Art of War', author: 'Sun Tzu', category: 'Philosophy', isbn: '978-1590302255', quantity: 5, available: 5, status: 'available' },
  { id: '8', title: '1984', author: 'George Orwell', category: 'Fiction', isbn: '978-0451524935', quantity: 14, available: 10, status: 'available' },
  { id: '9', title: 'Design Patterns', author: 'Gang of Four', category: 'Technology', isbn: '978-0201633610', quantity: 3, available: 0, status: 'out-of-stock' },
  { id: '10', title: 'The Lean Startup', author: 'Eric Ries', category: 'Business', isbn: '978-0307887894', quantity: 7, available: 3, status: 'available' },
];

export const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@library.edu', role: 'admin', joinedDate: '2023-01-15', borrowedBooks: 0 },
  { id: '2', name: 'Bob Smith', email: 'bob@library.edu', role: 'staff', joinedDate: '2023-03-22', borrowedBooks: 2 },
  { id: '3', name: 'Carol Davis', email: 'carol@student.edu', role: 'student', joinedDate: '2024-09-01', borrowedBooks: 3 },
  { id: '4', name: 'Dan Wilson', email: 'dan@student.edu', role: 'student', joinedDate: '2024-09-01', borrowedBooks: 1 },
  { id: '5', name: 'Eve Martinez', email: 'eve@student.edu', role: 'student', joinedDate: '2024-01-15', borrowedBooks: 5 },
  { id: '6', name: 'Frank Brown', email: 'frank@library.edu', role: 'staff', joinedDate: '2023-06-10', borrowedBooks: 0 },
];

export const borrowRecords: BorrowRecord[] = [
  { id: '1', userId: '3', userName: 'Carol Davis', bookId: '1', bookTitle: 'The Great Gatsby', borrowDate: '2024-12-01', returnDate: '2024-12-15', status: 'borrowed' },
  { id: '2', userId: '4', userName: 'Dan Wilson', bookId: '2', bookTitle: 'To Kill a Mockingbird', borrowDate: '2024-11-20', returnDate: '2024-12-04', actualReturnDate: '2024-12-03', status: 'returned' },
  { id: '3', userId: '5', userName: 'Eve Martinez', bookId: '3', bookTitle: 'Sapiens', borrowDate: '2024-11-01', returnDate: '2024-11-15', status: 'overdue' },
  { id: '4', userId: '3', userName: 'Carol Davis', bookId: '5', bookTitle: 'Atomic Habits', borrowDate: '2024-12-05', returnDate: '2024-12-19', status: 'borrowed' },
  { id: '5', userId: '5', userName: 'Eve Martinez', bookId: '6', bookTitle: 'Dune', borrowDate: '2024-12-02', returnDate: '2024-12-16', status: 'borrowed' },
  { id: '6', userId: '2', userName: 'Bob Smith', bookId: '8', bookTitle: '1984', borrowDate: '2024-11-25', returnDate: '2024-12-09', actualReturnDate: '2024-12-08', status: 'returned' },
];

export const stockItems: StockItem[] = [
  { id: '1', name: 'The Great Gatsby', category: 'Fiction', quantity: 12, minStock: 3, lastUpdated: '2024-12-10', type: 'book' },
  { id: '2', name: 'To Kill a Mockingbird', category: 'Fiction', quantity: 2, minStock: 5, lastUpdated: '2024-12-08', type: 'book' },
  { id: '3', name: 'Sapiens', category: 'Non-Fiction', quantity: 0, minStock: 3, lastUpdated: '2024-12-05', type: 'book' },
  { id: '4', name: 'Printer Paper (Ream)', category: 'Supplies', quantity: 45, minStock: 20, lastUpdated: '2024-12-10', type: 'supply' },
  { id: '5', name: 'Ink Cartridges', category: 'Supplies', quantity: 3, minStock: 5, lastUpdated: '2024-12-09', type: 'supply' },
  { id: '6', name: 'Library Cards', category: 'Supplies', quantity: 150, minStock: 50, lastUpdated: '2024-12-01', type: 'supply' },
  { id: '7', name: 'Clean Code', category: 'Technology', quantity: 6, minStock: 2, lastUpdated: '2024-12-07', type: 'book' },
  { id: '8', name: 'Book Covers', category: 'Supplies', quantity: 8, minStock: 10, lastUpdated: '2024-12-06', type: 'supply' },
];

export const activityLogs: ActivityLog[] = [
  { id: '1', action: 'Book Borrowed', user: 'Carol Davis', details: 'Borrowed "The Great Gatsby"', timestamp: '2024-12-10 14:30', type: 'borrow' },
  { id: '2', action: 'Book Returned', user: 'Dan Wilson', details: 'Returned "To Kill a Mockingbird"', timestamp: '2024-12-10 11:15', type: 'return' },
  { id: '3', action: 'Stock Updated', user: 'Alice Johnson', details: 'Added 5 copies of "Atomic Habits"', timestamp: '2024-12-09 16:45', type: 'update' },
  { id: '4', action: 'Book Added', user: 'Bob Smith', details: 'Added new book "The Lean Startup"', timestamp: '2024-12-09 10:20', type: 'add' },
  { id: '5', action: 'Book Borrowed', user: 'Eve Martinez', details: 'Borrowed "Dune"', timestamp: '2024-12-08 09:00', type: 'borrow' },
  { id: '6', action: 'Book Returned', user: 'Bob Smith', details: 'Returned "1984"', timestamp: '2024-12-08 15:30', type: 'return' },
];

export const categories = ['Fiction', 'Non-Fiction', 'Technology', 'Self-Help', 'Sci-Fi', 'Philosophy', 'Business'];

export const categoryChartData = [
  { name: 'Fiction', count: 41 },
  { name: 'Non-Fiction', count: 8 },
  { name: 'Technology', count: 9 },
  { name: 'Self-Help', count: 20 },
  { name: 'Sci-Fi', count: 10 },
  { name: 'Philosophy', count: 5 },
  { name: 'Business', count: 7 },
];

export const stockTrendData = [
  { month: 'Jul', books: 85, supplies: 200 },
  { month: 'Aug', books: 92, supplies: 180 },
  { month: 'Sep', books: 88, supplies: 210 },
  { month: 'Oct', books: 95, supplies: 190 },
  { month: 'Nov', books: 90, supplies: 175 },
  { month: 'Dec', books: 100, supplies: 206 },
];
