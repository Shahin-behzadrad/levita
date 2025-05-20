import Image from "next/image";
import { SignOutButton } from "../SignOutButton/SignOutButton";
import salLogo from "../../../public/SAL.webp";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-b-gray-300">
      <div className="flex items-center gap-2">
        <Image src={salLogo.src} width={60} height={60} alt="sal-logo" />
        <h2 className="text-xl font-semibold text-indigo-600">
          Sal Health Analyzer
        </h2>
      </div>
      <SignOutButton />
    </header>
  );
};

export default Header;
