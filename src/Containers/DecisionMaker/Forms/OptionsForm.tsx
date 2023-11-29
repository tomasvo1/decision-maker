import React, { useEffect } from 'react'

import { Divider, Button, Input, Dialog } from '../../../Components'
import { useOptions, useOptionsForm } from '../../../Contexts'

import { DeleteIconButton, ErrorBanner } from '../Shared'
import type { IOption, OptionInputManipulationFnType } from '../types'


interface OptionsFormEntryProps {
  index: number;
  option: IOption;
  error: string;
  deleteDisabled: boolean;
  isEditingOption: boolean;
  onDelete: (index: number) => void;
  onBlur: (index: number, value: string) => void;
  onChange: OptionInputManipulationFnType;
}


function OptionsFormEntry({
  index,
  option,
  error,
  deleteDisabled,
  isEditingOption,
  onDelete,
  onBlur,
  onChange,
}: OptionsFormEntryProps) {
  return (
    <div className="decision-maker__option-form-entry">
      <span className="decision-maker__option-form-entry-title">
        Option #{index + 1}
      </span>

      <div className="decision-maker__option-form-name-input">
        <Input
          label="Name"
          value={option.name}
          required
          error={!!error}
          onBlur={(e) => onBlur(index, e.target.value)}
          onChange={(e) => onChange(index, 'name', e.target.value)}
        />
        {!isEditingOption && (
          <DeleteIconButton
            disabled={deleteDisabled}
            onClick={() => onDelete(index)}
          />
        )}
      </div>

      <span className="decision-maker__option-form-entry-title">
        Scores
      </span>

      {Object.entries(option.attributes).map(([id, attribute]) => (
        <div key={id} className="decision-maker__option-form-attribute-row">
          <span className="decision-maker__option-form-attribute-col">
            {attribute.name} (Weight: {attribute.weight})
          </span>
          <Input
            containerClassname="decision-maker__option-form-attribute-col"
            value={attribute.score}
            type="number"
            onChange={(e) => {
              const updatedAttributes = { ...option.attributes }
              updatedAttributes[id].score = Number(e.target.value)
              onChange(index, 'attributes', updatedAttributes)
            }}
          />
        </div>
      ))}

      <ErrorBanner error={error} />
    </div>
  )
}


function OptionsForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    optionToEdit,
    setOptions,
  } = useOptions()

  const {
    formOptions,
    formOptionsErrors,
    onFormOptionDelete,
    onOptionsFormSubmit,
    validateOptionName,
    onOptionChange,
    onAddAnotherOption,
    setFormOptions,
    resetForm,
  } = useOptionsForm()

  useEffect(() => {
    if (optionToEdit) {
      setFormOptions([optionToEdit])
    }
  }, [optionToEdit, setFormOptions])

  function onSubmit() {
    onOptionsFormSubmit(setOptions, onClose, optionToEdit)
  }

  if (!isOpen) { return null }

  return (
    <Dialog
      title="Add an option"
      open={isOpen}
      onSubmit={onSubmit}
      className="decision-maker__form-dialog"
      onClose={() => {
        onClose()
        resetForm()
      }}
    >
      <form onSubmit={onSubmit} className="decision-maker__attribute-form">
        {formOptions.map((option, i) => (
          <React.Fragment key={option.id}>
            <OptionsFormEntry
              index={i}
              option={option}
              error={formOptionsErrors[i].name}
              deleteDisabled={formOptions.length === 1}
              isEditingOption={!!optionToEdit}
              onDelete={onFormOptionDelete}
              onBlur={validateOptionName}
              onChange={onOptionChange}
            />
            {formOptions.length > 1 && i !== formOptions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {!optionToEdit && (
          <Button
            variant="outlined"
            className="decision-maker__attribute-form-add-button"
            onClick={onAddAnotherOption}
          >
            Add another option
          </Button>
        )}
      </form>
    </Dialog>

  )
}


export default React.memo(OptionsForm)
