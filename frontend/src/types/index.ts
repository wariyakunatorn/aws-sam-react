export interface DynamicData {
  id: string;
  [key: string]: any;
}

export interface BackLinkProps {
  to: string;
  label: string;
}

export interface FormFieldProps {
  name: string;
  value: string;
}
