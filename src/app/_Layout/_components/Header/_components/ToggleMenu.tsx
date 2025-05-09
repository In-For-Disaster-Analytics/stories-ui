interface ToggleMenuProps {
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({ setIsMenuOpen }) => {
  const signOut = () => {};
  const authStatus = 'authenticated';
  return (
    <div className="w-full h-full relative">
      {/* Close button */}
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        {authStatus === 'authenticated' ? (
          <>
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                // history.push('/signup');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Registrarse
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ToggleMenu;
