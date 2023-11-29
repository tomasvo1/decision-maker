import { useMemo, useState } from 'react'
import { MarkerType, Edge, Node } from 'reactflow'

import { Dialog } from '../../Components'
import {
  useAttributes,
  useOptions,
  AttributesFormProvider,
  OptionsFormProvider,
} from '../../Contexts'
import DecisionMakerFlow from '../../core'

import type { IOption } from './types'
import { NodeTypes } from './enums'
import { AttributeForm, OptionsForm } from './Forms'
import Header from './Header'


const STEP_X = 250
const SPACE_X = 20


export function DecisionMaker() {
  const [isAttributesFormOpen, setIsAttributesFormOpen] = useState(false)
  const [isOptionsFormOpen, setIsOptionsFormOpen] = useState(false)

  const {
    options,
    optionToDelete,
    optionToEdit,
    onOptionDelete,
    setOptionToEdit,
    setOptionToDelete,
    updateOptionsAttributes,
  } = useOptions()

  const {
    attributes,
    attributeToEdit,
    attributeToDelete,
    setAttributeToEdit,
    onAttributeDelete,
    setAttributeToDelete,
  } = useAttributes(updateOptionsAttributes)

  const attributesNodes: Node[] = useMemo(() => attributes.map((attribute, i) => ({
    id: `attribute-${attribute.id}`,
    position: { x: i * STEP_X + SPACE_X, y: 0 },
    type: NodeTypes.attributes,
    data: {
      ...attribute,
      type: NodeTypes.attributes,
    },
  })), [attributes])

  const optionsNodes: Node[] = useMemo(() => options.map((option, i) => ({
    id: `option-${option.id}`,
    position: { x: i * STEP_X + SPACE_X, y: 200 },
    type: NodeTypes.options,
    data: {
      ...option,
      type: NodeTypes.options,
    },
  })), [options])

  const winnerNodes: Node[] = useMemo(() => {
    if (!optionsNodes.length && attributesNodes.length) { return [] }

    const optionsWithHighestScore: IOption[] = options.reduce((topScoreOptions: IOption[], currentOption: IOption) => {
      if (!topScoreOptions.length || currentOption.totalScore > topScoreOptions[0].totalScore) {
        return [currentOption]
      }
      if (currentOption.totalScore === topScoreOptions[0].totalScore) {
        return [...topScoreOptions, currentOption]
      }
      return topScoreOptions
    }, [])

    return optionsWithHighestScore.map((option, i) => ({
      id: `winner-option-${option.id}`,
      position: { x: i * STEP_X + SPACE_X, y: 600 },
      type: NodeTypes.winner,
      data: {
        ...option,
        type: NodeTypes.winner,
      },
    }))
  }, [optionsNodes.length, attributesNodes.length, options])

  const calculatedEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    for (const attributeNode of attributesNodes) {
      for (const optionNode of optionsNodes) {
        const edge = {
          id: `edge-from-${attributeNode.id}-to-${optionNode.id}`,
          source: attributeNode.id,
          target: optionNode.id,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }
        edges.push(edge)
      }
    }

    if (winnerNodes?.length < 1) {
      return edges
    }

    for (const optionNode of optionsNodes) {
      for (const winnerNode of winnerNodes) {
        const edge = {
          id: `edge-from-${optionNode.id}-to-${winnerNode.id}`,
          source: optionNode.id,
          target: winnerNode.id,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }
        edges.push(edge)
      }
    }

    return edges
  }, [attributesNodes, optionsNodes, winnerNodes])

  const calculatedNodes = useMemo(() => [...attributesNodes, ...optionsNodes, ...winnerNodes], [
    attributesNodes, optionsNodes, winnerNodes,
  ])

  const isDeleteDialogOpen: boolean = !!attributeToDelete || !!optionToDelete
  const deleteDialogTitle: string = `
    Do you want to delete ${(attributeToDelete ? attributeToDelete?.name : optionToDelete?.name) || 'this attribute'}?
  `
  const deleteDialogSubmitFn: () => void = attributeToDelete
    ? () => onAttributeDelete()
    : () => onOptionDelete()
  const deleteDialogCloseFn: () => void = attributeToDelete
    ? () => setAttributeToDelete(null)
    : () => setOptionToDelete(null)

  return (
    <div className="decision-maker">
      <Dialog
        title={deleteDialogTitle}
        open={isDeleteDialogOpen}
        onSubmit={deleteDialogSubmitFn}
        className="decision-maker__delete-dialog"
        onClose={deleteDialogCloseFn}
        deleteMode
      />

      <AttributesFormProvider>
        <AttributeForm
          isOpen={isAttributesFormOpen || !!attributeToEdit}
          onClose={() => {
            setIsAttributesFormOpen(false)
            if (attributeToEdit) {
              setAttributeToEdit(null)
            }
          }}
        />
      </AttributesFormProvider>

      <OptionsFormProvider>
        <OptionsForm
          isOpen={isOptionsFormOpen || !!optionToEdit}
          onClose={() => {
            setIsOptionsFormOpen(false)
            if (optionToEdit) {
              setOptionToEdit(null)
            }
          }}
        />
      </OptionsFormProvider>

      <Header
        displayAddOptionButton={!!attributes.length}
        setIsAttributesFormOpen={() => setIsAttributesFormOpen(true)}
        setIsOptionsFormOpen={() => setIsOptionsFormOpen(true)}
      />

      <DecisionMakerFlow
        calculatedNodes={calculatedNodes}
        calculatedEdges={calculatedEdges}
      />
    </div>
  )
}
