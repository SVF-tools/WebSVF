import { useState, useEffect, useRef } from 'react';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import './styles.css';

const FontSizeMenu = ({
  fontSize,
  setFontSize,
}: {
  fontSize: number;
  setFontSize: (newFontSize: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const allowedFontSizes = () => {
    const allowedFontSizesList = [];
    for (let i = 8; i < 31; i++) {
      allowedFontSizesList.push(i);
    }
    return allowedFontSizesList;
  };
  const handleFontSizeDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeFontSize = (newFontSize: number) => {
    if (newFontSize < 8) {
      setFontSize(8);
    } else if (newFontSize > 30) {
      setFontSize(30);
    } else {
      setFontSize(newFontSize);
    }
  };

  // These functions allows the font size menu to be closed when the user clicks on other parts of the screen
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Adds an event listener to listen for clicks
  // When it listens to a click outside of the drop down menu button, it will close the menu list
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id="font-size-menu-container" ref={menuRef}>
      <div
        id="font-size-decrease"
        className={`font-size-incDec-button-div ${fontSize === 8 ? 'disabled' : ''}`}
        onClick={() => handleChangeFontSize(fontSize - 1)}
      >
        <TextDecreaseIcon fontSize="small" />
      </div>
      <div id="font-size-drop-down-container">
        <button id="font-size-dropdown-btn" onClick={handleFontSizeDropDown}>
          {fontSize}
        </button>
        {isOpen && (
          <div id="font-size-dropdown-menu">
            {allowedFontSizes().map((fontSizeNum) => (
              <div
                key={fontSizeNum}
                className={`font-size-drop-menu-item ${fontSizeNum === fontSize ? 'selected' : ''}`}
                onClick={() => handleChangeFontSize(fontSizeNum)}
              >
                {fontSizeNum}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        id="font-size-increase"
        className={`font-size-incDec-button-div ${fontSize === 30 ? 'disabled' : ''}`}
        onClick={() => handleChangeFontSize(fontSize + 1)}
      >
        <TextIncreaseIcon fontSize="small" />
      </div>
    </div>
  );
};
export default FontSizeMenu;
