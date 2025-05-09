import Right from './_components/Right';
import Left from './_components/Left';
import Center from './_components/Center';

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Left />
        <Center />
        <Right toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};

export default Header;
