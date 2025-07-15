
export interface FormValue {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    type: 'text' | 'date' | 'email' | 'password' | 'textarea' | 'select';
    faIcon?: string;
    // validations?: { [key: string]: any };
    validations?: Validation;
    validationMessages?: ValidationMessage;
    // validationMessages?: { [key: string]: string };
    selectOption?: Selector[] | any[];
}

export interface Selector {
    id: any;
    name: string;
    value: string;
}

export interface Validation {
    required?: boolean;
    email?: boolean | string | RegExp;
    minLength?: number;
    maxLength?: number;
}

export interface ValidationMessage {
    required?: string;
    email?: string;
    minLength?: string;
    maxLength?: string;
}