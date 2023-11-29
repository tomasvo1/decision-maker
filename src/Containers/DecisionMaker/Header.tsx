import React from 'react'

import { Button } from '../../Components';


interface HeaderProps {
  displayAddOptionButton: boolean;
  setIsAttributesFormOpen: () => void;
  setIsOptionsFormOpen: () => void;
}


function Header({
  displayAddOptionButton,
  setIsAttributesFormOpen,
  setIsOptionsFormOpen
}: HeaderProps) {
  return (
    <header className="decision-maker__header">
      <h2 className="decision-maker__header-title">Decision maker</h2>
      <div className="decision-maker__header-actions">
        <Button onClick={setIsAttributesFormOpen}>
          Add an attribute
        </Button>

        {displayAddOptionButton && (
          <Button onClick={setIsOptionsFormOpen}>
            Add an option
          </Button>
        )}
      </div>
    </header>
  )
}


export default React.memo(Header)
