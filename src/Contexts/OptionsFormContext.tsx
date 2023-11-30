import React, {
  useState,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

import type { IOption, OptionInputManipulationFnType, IOptionError, IAttribute, AttributeMap } from '../types'

import { useAttributes } from './AttributesContext'
import { getTotalScore } from './utils'


interface Context {
  formOptions: IOption[];
  formOptionsErrors: IOptionError[];
  setFormOptions: Dispatch<SetStateAction<IOption[]>>;
  onAddAnotherOption: () => void;
  onFormOptionDelete: (index: number) => void;
  onOptionChange: OptionInputManipulationFnType;
  validateOptionName: (index: number, value: string) => boolean;
  resetForm: () => void;
  onOptionsFormSubmit: (
    setterFn: Dispatch<SetStateAction<IOption[]>>,
    closeFormFn: () => void,
    optionToEdit: IOption | null,
  ) => void;
}


const OptionsFormContext = React.createContext<{
  formOptions: IOption[];
  formOptionsErrors: IOptionError[];
  resetForm: () => void;
  setFormOptionsErrors: Dispatch<SetStateAction<IOptionError[]>>;
  setFormOptions: Dispatch<SetStateAction<IOption[]>>;
} | undefined>(undefined)


const FORM_OPTIONS_BASE_INITIAL_VALUE: { name: string; totalScore: number } = { name: '', totalScore: 0 }
const FORM_OPTIONS_ERRORS_INITIAL_VALUE: { name: string; weight: string } = { name: '', weight: '' }


function formAttributeMap(attributes: IAttribute[]): AttributeMap {
  const map: AttributeMap = {}

  for (const attribute of attributes) {
    map[attribute.id] = {
      weight: attribute.weight,
      name: attribute.name,
      score: 0,
    }
  }

  return map
}


function OptionsFormProvider({ children }: { children: ReactNode }): JSX.Element {
  const { attributes } = useAttributes()

  const id: string = uuidv4()

  const [formOptions, setFormOptions] = useState<IOption[]>([{
    ...FORM_OPTIONS_BASE_INITIAL_VALUE,
    id,
    attributes: formAttributeMap(attributes),
  }])
  const [formOptionsErrors, setFormOptionsErrors] = useState<IOptionError[]>([{
    ...FORM_OPTIONS_ERRORS_INITIAL_VALUE,
    id,
  }])

  function resetForm(): void {
    const id = uuidv4()
    setFormOptions([{
      ...FORM_OPTIONS_BASE_INITIAL_VALUE,
      id,
      attributes: formAttributeMap(attributes),
    }])
    setFormOptionsErrors([{ ...FORM_OPTIONS_ERRORS_INITIAL_VALUE, id }])
  }

  useEffect(() => {
    resetForm()
  }, [attributes])

  return (
    <OptionsFormContext.Provider value={{
      formOptions,
      formOptionsErrors,
      setFormOptionsErrors,
      setFormOptions,
      resetForm,
    }}>
      {children}
    </OptionsFormContext.Provider>
  );
}


function useOptionsForm(): Context {
  const context = useContext(OptionsFormContext)

  if (context === undefined) {
    throw new Error('useOptionsForm must be used within a OptionsFormContext')
  }

  const {
    formOptions,
    formOptionsErrors,
    resetForm,
    setFormOptionsErrors,
    setFormOptions,
  } = context

  const { attributes } = useAttributes()

  const validateOptionName = useCallback(function validateOptionName(
    index: number,
    value: string,
  ): boolean {
    if (value) {
      setFormOptionsErrors(errs => {
        const updatedErrors = [...errs]
        updatedErrors[index] = {
          ...updatedErrors[index],
          name: '',
        }
        return updatedErrors
      })
      return false
    }

    setFormOptionsErrors(errs => {
      const updatedErrors = [...errs]
      updatedErrors[index] = {
        ...updatedErrors[index],
        name: 'Name cannot be empty',
      }
      return updatedErrors
    })
    return true
  }, [])

  const onOptionChange = useCallback(function onOptionChange<T extends keyof IOption>(
    index: number,
    key: T,
    value: IOption[T],
  ): void {
    setFormOptions(options => {
      const updatedOptions = [...options]
      updatedOptions[index] = {
        ...updatedOptions[index],
        [key]: value,
      }

      return updatedOptions
    })

    if (key === 'name') {
      validateOptionName(index, String(value))
    }
  }, [])

  function onAddAnotherOption(): void {
    const id: string = uuidv4()

    setFormOptions(options => ([
      ...options,
      {
        ...FORM_OPTIONS_BASE_INITIAL_VALUE,
        id,
        attributes: formAttributeMap(attributes),
      }
    ]))
    setFormOptionsErrors(errs => ([...errs, { name: '', id }]))
  }

  function onFormOptionDelete(index: number): void {
    setFormOptions(options => options.filter((_, i) => i !== index))
    setFormOptionsErrors(errs => errs.filter((_, i) => i !== index))
  }

  const onOptionsFormSubmit = useCallback(function onOptionsFormSubmit(
    setterFn: Dispatch<SetStateAction<IOption[]>>,
    closeFormFn: () => void,
    optionToEdit: IOption | null,
  ): void {
    let hasErrors: boolean = false

    for (let i = 0; i < formOptions.length; i++) {
      const option = formOptions[i]
      hasErrors = validateOptionName(i, option.name)
    }

    if (hasErrors) {
      return;
    }

    if (optionToEdit) {
      setterFn(options => {
        const updatedOptions = options.map(option => {
          if (option.id === optionToEdit.id) {
            return {
              ...formOptions[0],
              totalScore: getTotalScore(option),
            }
          }
          return option
        })

        return updatedOptions
      })
    } else {
      setterFn(options => {
        const updatedOptions = formOptions.map(option =>({
          ...option,
          totalScore: getTotalScore(option),
        }))

        return [...options, ...updatedOptions]
      })
    }

    closeFormFn()
    resetForm()
  }, [formOptions])

  return {
    formOptions,
    formOptionsErrors,
    validateOptionName,
    onOptionChange,
    onAddAnotherOption,
    onOptionsFormSubmit,
    onFormOptionDelete,
    setFormOptions,
    resetForm,
  }
}


export { useOptionsForm, OptionsFormProvider }
