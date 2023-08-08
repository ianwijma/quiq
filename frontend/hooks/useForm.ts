import {useEffect, useRef, useState} from "react";

type FormState = {
    [key: string]: string|number
}

type FormElement = HTMLInputElement|HTMLTextAreaElement;

export default (initialFormState: FormState) => {
    const [formState, setFormState] = useState(initialFormState)
    const formRef = useRef<HTMLFormElement>();

    const updateFormStateOnChange = (event) => {
        const element: FormElement = event.currentTarget;

        let value: string|number = element.value;
        if (element.type === 'number') {
            value = parseInt(value, 10);
        }

        setFormState({
            ...formState,
            [element.name]: value
        })
    }

    useEffect(() => {
        const { current: formEl } = formRef

        if (formEl) {
            const nameElements = formEl.querySelectorAll('[name]');

            nameElements.forEach((element: FormElement) => {
                if (element.name in formState) {
                    element.value = formState[element.name] as string;
                }

                element.addEventListener('change', updateFormStateOnChange);
            })

            return () => nameElements
                .forEach(element => element.removeEventListener('change', updateFormStateOnChange))
        }
    }, [formRef])

    return [formRef, formState];
}
