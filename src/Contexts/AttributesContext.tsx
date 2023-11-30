import React, {
  useState,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'

import type { IAttribute } from '../types'


interface Context {
  attributes: IAttribute[];
  attributeToDelete: IAttribute | null;
  attributeToEdit: IAttribute | null;
  setAttributeToEdit: Dispatch<SetStateAction<IAttribute | null>>;
  onAttributeDelete: (id?: string) => void;
  onAttributeEdit: (id: string) => void;
  setAttributes: Dispatch<SetStateAction<IAttribute[]>>;
  setAttributeToDelete: Dispatch<SetStateAction<IAttribute | null>>;
}


const AttributesContext = React.createContext<{
  attributes: IAttribute[];
  attributeToDelete: IAttribute | null;
  attributeToEdit: IAttribute | null;
  setAttributeToEdit: Dispatch<SetStateAction<IAttribute | null>>;
  setAttributeToDelete: Dispatch<SetStateAction<IAttribute | null>>;
  setAttributes: Dispatch<SetStateAction<IAttribute[]>>;
} | undefined>(undefined)


function AttributesProvider({ children }: { children: ReactNode }): JSX.Element {
  const [attributes, setAttributes] = useState<IAttribute[]>(
    JSON.parse(localStorage.getItem('attributes')) ?? [],
  )

  const [attributeToEdit, setAttributeToEdit] = useState<IAttribute | null>(null)
  const [attributeToDelete, setAttributeToDelete] = useState<IAttribute | null>(null)

  useEffect(() => {
    localStorage.setItem('attributes', JSON.stringify(attributes))
  }, [attributes])

  return (
    <AttributesContext.Provider value={{
      attributes,
      attributeToEdit,
      attributeToDelete,
      setAttributeToDelete,
      setAttributeToEdit,
      setAttributes,
    }}>
      {children}
    </AttributesContext.Provider>
  );
}


function useAttributes(
  updateOptionsAttributes?: (attributes: IAttribute[], deleted?: boolean) => void,
): Context {
  const context = useContext(AttributesContext)

  if (context === undefined) {
    throw new Error('useAttributes must be used within a AttributesContext')
  }

  const {
    attributes,
    attributeToDelete,
    attributeToEdit,
    setAttributeToEdit,
    setAttributeToDelete,
    setAttributes,
  } = context

  function onAttributeEdit(id: string): void {
    const attribute = attributes.find(attribute => attribute.id === id)

    if (!attribute) { return; }

    setAttributeToEdit(attribute)
  }

  function onAttributeDelete(id?: string): void {
    if (!attributeToDelete) {
      const atd = attributes.find(attribute => attribute.id === id)
      setAttributeToDelete(atd)
      return
    }

    setAttributes(attrs => {
      const updatedAttributes = attrs.filter(attribute => attribute.id !== attributeToDelete.id)
      updateOptionsAttributes?.(updatedAttributes, true)
      return updatedAttributes
    })
    setAttributeToDelete(null)
  }

  return {
    attributes,
    attributeToDelete,
    attributeToEdit,
    setAttributeToDelete,
    setAttributeToEdit,
    onAttributeDelete,
    onAttributeEdit,
    setAttributes,
  }
}


export { useAttributes, AttributesProvider }
