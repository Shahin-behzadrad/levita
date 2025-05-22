import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500 dark:text-white">
            © 2025 HealthAI. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm text-gray-500 hover:underline dark:text-white"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gray-500 hover:underline dark:text-white"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
