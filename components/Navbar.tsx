import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Smart Room IoT</div>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/camera" className="hover:text-gray-300">
            Camera
          </Link>
        </div>
      </div>
    </nav>
  );
}
