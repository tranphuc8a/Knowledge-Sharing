import DropdownMenu from "../../inputfield/dropdown-menu";

export default function (props) {
    const options = [
        { value: 'option1', title: 'Option 1' },
        { value: 'option2', title: 'Option 2' },
        { value: 'option3', title: 'Option 3' }
    ];

    return (
        <DropdownMenu listOptions={options}>

        </DropdownMenu>
    );
}