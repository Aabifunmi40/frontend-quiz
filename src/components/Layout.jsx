import Header from "./Header";

export default function Layout({ children }) {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header user={user} /> {/* pass user info to header */}
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-800 text-white text-center py-4">
        © {new Date().getFullYear()} QuizMaster | Built with ❤️
      </footer>
    </div>
  );
}
