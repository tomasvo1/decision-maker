import React, {
  useState,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

import type { IAttribute, AttributeInputManipulationFnType, IAttributeError } from '../types'


interface Context {
  formAttributes: IAttribute[];
  formAttributesErrors: IAttributeError[];
  validateAttributeInputs: AttributeInputManipulationFnType;
  onAttributeChange: AttributeInputManipulationFnType;
  onAddAnotherAttribute: () => void;
  onFormAttributeDelete: (index: number) => void;
  setFormAttributes: Dispatch<SetStateAction<IAttribute[]>>;
  resetForm: () => void;
  onAttributesFormSubmit: (
    setterFn: Dispatch<SetStateAction<IAttribute[]>>,
    closeFormFn: () => void,
    attributeToEdit: IAttribute | null,
  ) => void;
}


const AttributesFormContext = React.createContext<{
  formAttributes: IAttribute[];
  formAttributesErrors: IAttributeError[];
  setFormAttributesErrors: Dispatch<SetStateAction<IAttributeError[]>>;
  setFormAttributes: Dispatch<SetStateAction<IAttribute[]>>;
} | undefined>(undefined)


const FORM_ATTRIBUTES_INITIAL_VALUE: { name: string; weight: number } = { name: '', weight: 0 }
const FORM_ATTRIBUTES_ERRORS_INITIAL_VALUE: { name: string; weight: string } = { name: '', weight: '' }


function AttributesFormProvider({ children }: { children: ReactNode }): JSX.Element {
  const id: string = uuidv4()

  const [formAttributes, setFormAttributes] = useState<IAttribute[]>([{
    ...FORM_ATTRIBUTES_INITIAL_VALUE,
    id,
  }])
  const [formAttributesErrors, setFormAttributesErrors] = useState<IAttributeError[]>([{
    ...FORM_ATTRIBUTES_ERRORS_INITIAL_VALUE,
    id,
  }])

  return (
    <AttributesFormContext.Provider value={{
      formAttributes,
      formAttributesErrors,
      setFormAttributesErrors,
      setFormAttributes,
    }}>
      {children}
    </AttributesFormContext.Provider>
  );
}

function useAttributesForm(
  updateOptionsAttributes: (attributes: IAttribute[], deleted?: boolean) => void,
): Context {
  const context = useContext(AttributesFormContext)

  if (context === undefined) {
    throw new Error('useAttributesForm must be used within a AttributesFormContext')
  }

  const {
    formAttributes,
    formAttributesErrors,
    setFormAttributesErrors,
    setFormAttributes,
  } = context

  const validateAttributeInputs = useCallback(function validateAttributeInputs<T extends keyof IAttribute>(
    index: number,
    key: T,
    value: IAttribute[T],
  ): boolean {
    const erroneousConditions: boolean[] = [
      key === 'name' && !value,
      key === 'weight' && Number(value) <= 0,
    ]

    if (erroneousConditions.some(x => x)) {
      setFormAttributesErrors(errs => {
        const updatedErrors = [...errs]
        updatedErrors[index] = {
          ...updatedErrors[index],
          [key]: key === 'name' ? 'Name cannot be empty' : 'Weight must be greater than 0',
        }
        return updatedErrors
      })
      return true
    }

    setFormAttributesErrors(errs => {
      const updatedErrors = [...errs]
      updatedErrors[index] = {
        ...updatedErrors[index],
        [key]: '',
      }
      return updatedErrors
    })
    return false
  }, [])

  const onAttributeChange = useCallback(function onAttributeChange<T extends keyof IAttribute>(
    index: number,
    key: T,
    value: IAttribute[T],
  ): void {
    setFormAttributes(attributes => {
      const updatedAttributes = [...attributes]
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [key]: value,
      }

      return updatedAttributes
    })

    validateAttributeInputs(index, key, value)
  }, [])

  function onAddAnotherAttribute(): void {
    const id: string = uuidv4()
    setFormAttributes(attributes => ([...attributes, { ...FORM_ATTRIBUTES_INITIAL_VALUE, id }]))
    setFormAttributesErrors(errs => ([...errs, { ...FORM_ATTRIBUTES_ERRORS_INITIAL_VALUE, id }]))
  }

  function onFormAttributeDelete(index: number): void {
    setFormAttributes(attributes => attributes.filter((_, i) => i !== index))
    setFormAttributesErrors(errs => errs.filter((_, i) => i !== index))
  }

  function resetForm(): void {
    const id: string = uuidv4()
    setFormAttributes([{ ...FORM_ATTRIBUTES_INITIAL_VALUE, id }])
    setFormAttributesErrors([{ ...FORM_ATTRIBUTES_ERRORS_INITIAL_VALUE, id }])
  }

  const onAttributesFormSubmit = useCallback(function onAttributesFormSubmit(
    setterFn: Dispatch<SetStateAction<IAttribute[]>>,
    closeFormFn: () => void,
    attributeToEdit: IAttribute | null,
  ): void {
    let hasErrors: boolean = false

    for (let i = 0; i < formAttributes.length; i++) {
      const attribute = formAttributes[i]
      const hasNameErrors = validateAttributeInputs(i, 'name', attribute.name)
      const hasWeightErrors = validateAttributeInputs(i, 'weight', attribute.weight)

      hasErrors = hasNameErrors || hasWeightErrors
    }

    if (hasErrors) {
      return;
    }

    if (attributeToEdit) {
      setterFn(attributes => {
        const updatedAttributes = attributes.map(attribute => {
          if (attribute.id === attributeToEdit.id) {
            return {
              ...formAttributes[0],
            }
          }
          return attribute
        })

        updateOptionsAttributes(updatedAttributes)
        return updatedAttributes
      })
    } else {
      setterFn(attributes => {
        const updatedAttributes = [...attributes, ...formAttributes]
        updateOptionsAttributes(updatedAttributes)
        return updatedAttributes
      })
    }

    closeFormFn()
    resetForm()
  }, [formAttributes])

  return {
    formAttributes,
    formAttributesErrors,
    setFormAttributes,
    validateAttributeInputs,
    onAttributeChange,
    onAddAnotherAttribute,
    onAttributesFormSubmit,
    onFormAttributeDelete,
    resetForm,
  }
}


export { useAttributesForm, AttributesFormProvider }
