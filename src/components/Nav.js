import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

const Nav = ({ libraryOpen, setLibraryOpen }) => {
  return (
    <nav>
      <h1>Waves</h1>
      <button onClick={() => setLibraryOpen(!libraryOpen)}>
        Library
        <FontAwesomeIcon icon={faMusic} />
      </button>
    </nav>
  );
};

export default Nav;
