export interface IAttribute {
  id: string;
  name: string;
  weight: number;
}

export interface IAttributeError {
  id: string;
  name: string;
  weight: string;
}

export type AttributeMap = Record<string, { weight: number; score: number; name: string }>

export interface IOption {
  id: string;
  name: string;
  attributes: AttributeMap;
  totalScore: number;
}

export interface IOptionNode extends IOption {
  onOptionEdit: (id: string) => void;
  onOptionDelete: (id?: string) => void;
}

export interface IAttributeNode extends IAttribute {
  onAttributeEdit: (id: string) => void;
  onAttributeDelete: (id?: string) => void;
}

export interface IOptionError {
  name: string;
  id: string;
}

export type AttributeInputManipulationFnType = <
  T extends keyof IAttribute
>(index: number, key: T, value: IAttribute[T]) => void | boolean;

export type OptionInputManipulationFnType = <
  T extends keyof IOption
>(index: number, key: T, value: IOption[T]) => void | boolean;
