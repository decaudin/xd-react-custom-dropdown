# xd-react-custom-dropdown

A **React dropdown component** styled with Tailwind CSS, ready to use with built-in styles but customizable through props.

## Installation & Import

To install the package in your project, run:

```
npm install xd-react-custom-dropdown
```

or 

```
yarn add xd-react-custom-dropdown
```

To import the component:

```
import CustomDropdown from "xd-react-custom-dropdown";
```

## Usage

### Basic Example

To use the CustomDropdown component, you can import it and pass the necessary props. Here's an example:

```
import React, { useState } from "react";
import CustomDropdown from "react-custom-dropdown";

const MyComponent = () => {
    const [selected, setSelected] = useState<string>("");

    const handleChange = (value: string) => {
        setSelected(value);
    };

    const options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];

    return (
        <CustomDropdown
            label="Select an Option"
            options={options}
            selected={selected}
            onChange={handleChange}
        />
    );
};
```

### Customizing Styles

You can customize the styles of the component by passing `wrapperClassName`,  `buttonClassName`, `dropdownClassName` and `optionClassName` props.

```
<CustomDropdown
  label="Custom Styled Dropdown"
  options={options}
  selected={selected}
  onChange={handleChange}
  wrapperClassName="my-custom-wrapper-class"
  buttonClassName="my-custom-button-class"
  dropdownClassName="my-custom-dropdown-class"
  optionClassName="my-custom-option-class"
/>
```

## Props

| Prop              | Type                  | Description |
|-------------------|----------------------|-------------|
| `label`          | `string`              | The label for the dropdown |
| `options`        | `Array<Option>`       | Array of options to display in the dropdown. Each option has `value` and `label`. |
| `selected`       | `string`              | The currently selected option's value |
| `onChange`       | `(value: string) => void` | Function to handle selection change |
| `wrapperClassName` | `string` (Optional)  | Custom class for the wrapper `div` element |
| `buttonClassName` | `string` (Optional)  | Custom class for the dropdown button |
| `dropdownClassName`  | `string` (Optional)  | Custom class for the dropdown list container |
| `optionClassName`    | `string` (Optional)  | Custom class for each `li` element representing an option |

## Option Type
The `options` prop is an array of objects with the following structure:

```
interface Option {
  value: string;
  label: string;
}
```

## Contributing

Feel free to submit issues or pull requests if you encounter bugs or have suggestions for improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.