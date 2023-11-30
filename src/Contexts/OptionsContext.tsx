import React, {
  useState,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from 'react'

import type { IAttribute, IOption } from '../types'

import { getTotalScore } from './utils'


interface Context {
  options: IOption[];
  optionToDelete: IOption | null;
  optionToEdit: IOption | null;
  setOptionToEdit: Dispatch<SetStateAction<IOption | null>>;
  setOptionToDelete: Dispatch<SetStateAction<IOption | null>>;
  onOptionDelete: (id?: string) => void;
  onOptionEdit: (id: string) => void;
  setOptions: Dispatch<SetStateAction<IOption[]>>;
  updateOptionsAttributes: (attributes: IAttribute[], deleted?: boolean) => void;
}


const OptionsContext = React.createContext<{
  options: IOption[];
  optionToDelete: IOption | null;
  optionToEdit: IOption | null;
  setOptionToEdit: Dispatch<SetStateAction<IOption | null>>;
  setOptionToDelete: Dispatch<SetStateAction<IOption | null>>;
  setOptions: Dispatch<SetStateAction<IOption[]>>;
} | undefined>(undefined)


function OptionsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [options, setOptions] = useState<IOption[]>(
    JSON.parse(localStorage.getItem('options')) ?? [],
  )
  const [optionToDelete, setOptionToDelete] = useState<IOption | null>(null)
  const [optionToEdit, setOptionToEdit] = useState<IOption | null>(null)

  useEffect(() => {
    localStorage.setItem('options', JSON.stringify(options))
  }, [options])

  return (
    <OptionsContext.Provider value={{
      options,
      optionToDelete,
      optionToEdit,
      setOptionToEdit,
      setOptionToDelete,
      setOptions,
    }}>
      {children}
    </OptionsContext.Provider>
  );
}


function useOptions(): Context {
  const context = useContext(OptionsContext)

  if (context === undefined) {
    throw new Error('useOptions must be used within a OptionsContext')
  }

  const {
    options,
    optionToDelete,
    optionToEdit,
    setOptionToEdit,
    setOptionToDelete,
    setOptions,
  } = context

  function onOptionEdit(id: string): void {
    const option = options.find(option => option.id === id)

    if (!option) { return; }

    setOptionToEdit(option)
  }

  function onOptionDelete(id?: string): void {
    if (!optionToDelete) {
      const otd = options.find(option => option.id === id)
      setOptionToDelete(otd)
      return
    }

    setOptions(options => options.filter(option => option.id !== optionToDelete.id))
    setOptionToDelete(null)
  }

  const updateOptionsAttributes = useCallback(function updateOptionsAttributes(
    attributes: IAttribute[],
    deleted?: boolean,
  ): void {
    const updatedOptions = [...options]

    if (deleted) {
      const attributeIds = attributes.map(attribute => attribute.id)
      const filteredOptions = updatedOptions
        .filter(option => {
          const keysLeft = Object.keys(option.attributes).filter(id => !attributeIds.includes(id))

          for (const key of keysLeft) {
            if (option.attributes[key]) {
              delete option.attributes[key]
            }
          }

          return option
        })
        .map(option => ({
          ...option,
          totalScore: getTotalScore(option)
        }))

      setOptions(filteredOptions)
      return
    }

    for (const option of updatedOptions) {
      for (const attribute of attributes) {
        const { id } = attribute

        if (option.attributes[id]) {
          option.attributes[id].name = attribute.name
          option.attributes[id].weight = attribute.weight
        } else {
          option.attributes[id] = {
            ...attribute,
            score: 0,
          }
        }
      }
      option.totalScore = getTotalScore(option)
    }

    setOptions(updatedOptions)
  }, [options])

  return {
    options,
    optionToDelete,
    optionToEdit,
    setOptionToEdit,
    setOptionToDelete,
    onOptionEdit,
    onOptionDelete,
    setOptions,
    updateOptionsAttributes
  }
}


export { useOptions, OptionsProvider }
