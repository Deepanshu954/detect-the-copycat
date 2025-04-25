
import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Detect the Copycat</h1>
        <p className="text-sm md:text-base opacity-90">
          Advanced Plagiarism Detection System
        </p>
      </div>
    </header>
  );
};

export default Header;
