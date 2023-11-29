import React, { useEffect } from 'react'
import classnames from 'classnames'

import { Button, Input, Divider, Dialog } from '../../../Components'
import { useAttributesForm, useAttributes, useOptions } from '../../../Contexts'

import { DeleteIconButton, ErrorBanner } from '../Shared';
import type { IAttribute, IAttributeError, AttributeInputManipulationFnType } from '../types'


interface AttributeFormEntryProps {
  attribute: IAttribute;
  error: IAttributeError;
  index: number;
  deleteDisabled: boolean;
  isEditingAttribute: boolean;
  onDelete: (index: number) => void;
  onBlur: AttributeInputManipulationFnType;
  onChange: AttributeInputManipulationFnType;
}


function AttributeFormEntry({
  attribute,
  index,
  error,
  deleteDisabled,
  isEditingAttribute,
  onDelete,
  onBlur,
  onChange,
}: AttributeFormEntryProps) {
  return (
    <>
      <div className={classnames('decision-maker__attribute-form-entry', {
        'decision-maker__attribute-form-entry--inline': isEditingAttribute,
      })}>
        {!isEditingAttribute && (
          <span className="decision-maker__attribute-form-entry--full-width">
            Attribute #{index + 1}
          </span>
        )}
        <div className="decision-maker__attribute-form-entry--first-col">
          <Input
            label="Name"
            value={attribute.name}
            required
            error={!!error.name}
            onBlur={(e) => onBlur(index, 'name', e.target.value)}
            onChange={(e) => onChange(index, 'name', e.target.value)}
          />
        </div>
        <div className="decision-maker__attribute-form-entry--second-col">
          <Input
            label="Weight"
            type="number"
            required
            value={attribute.weight}
            error={!!error.weight}
            onBlur={(e) => onBlur(index, 'weight', Number(e.target.value))}
            onChange={(e) => onChange(index, 'weight', Number(e.target.value))}
          />
        </div>
        {!isEditingAttribute && (
          <DeleteIconButton
            disabled={deleteDisabled}
            onClick={() => onDelete(index)}
          />
        )}
      </div>
      <ErrorBanner error={error.name} />
      <ErrorBanner error={error.weight} />
    </>
  )
}


function AttributeForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    attributeToEdit,
    setAttributes,
  } = useAttributes()

  const { updateOptionsAttributes } = useOptions()

  const {
    formAttributes,
    formAttributesErrors,
    onFormAttributeDelete,
    onAttributesFormSubmit,
    validateAttributeInputs,
    onAttributeChange,
    onAddAnotherAttribute,
    setFormAttributes,
    resetForm,
  } = useAttributesForm(updateOptionsAttributes)

  useEffect(() => {
    if (attributeToEdit) {
      setFormAttributes([attributeToEdit])
    }
  }, [attributeToEdit, setFormAttributes])

  function onSubmit() {
    onAttributesFormSubmit(setAttributes, onClose, attributeToEdit)
  }

  if (!isOpen) { return null }

  return (
    <Dialog
      title={attributeToEdit ? 'Edit an attribute' : 'Add an attribute'}
      open={isOpen}
      onSubmit={onSubmit}
      className="decision-maker__form-dialog"
      onClose={() => {
        onClose()
        resetForm()
      }}
    >
      <form
        onSubmit={onSubmit}
        className="decision-maker__attribute-form"
      >
        {formAttributes.map((attribute, i) => (
          <React.Fragment key={attribute.id}>
            <AttributeFormEntry
              index={i}
              attribute={attribute}
              error={formAttributesErrors[i]}
              deleteDisabled={formAttributes.length === 1}
              isEditingAttribute={!!attributeToEdit}
              onDelete={onFormAttributeDelete}
              onBlur={validateAttributeInputs}
              onChange={onAttributeChange}
            />
            {formAttributes.length > 1 && i !== formAttributes.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {!attributeToEdit && (
          <Button
            variant="outlined"
            className="decision-maker__attribute-form-add-button"
            onClick={onAddAnotherAttribute}
          >
            Add another attribute
          </Button>
        )}
      </form>
    </Dialog>

  )
}


export default React.memo(AttributeForm)
