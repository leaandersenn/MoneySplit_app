export interface StyledButtonProps {
    title: string;
    onClick: () => void;
}

export interface TextInputProps {
    placeholder: string,
    value: string;
    onChangeText: (text: string) => void;
}