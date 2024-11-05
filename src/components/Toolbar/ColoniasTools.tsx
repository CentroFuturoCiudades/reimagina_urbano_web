import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    IconButton,
    List,
    ListItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
    useBoolean,
} from "@chakra-ui/react";
import { FaCaretDown, FaCaretUp, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import {
    clearSelectedColonias,
    toggleSelectedColonias,
} from "../../features/viewMode/viewModeSlice";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";

export const ColoniasSelect = () => {
    const dispatch: AppDispatch = useDispatch();
    const [isFocused, setIsFocused] = useBoolean();
    const colonias = useSelector((state: RootState) => state.viewMode.colonias);
    const selectedColonias = useSelector(
        (state: RootState) => state.viewMode.selectedColonias
    );
    if (!colonias) return null;
    const selectedColoniasObjects = colonias
        .filter((x: any) => selectedColonias.includes(x.properties.OBJECTID_1))
        .sort((a: any, b: any) =>
            a.properties.NOM_COL > b.properties.NOM_COL ? 1 : -1
        );
    const unselectedColonias = colonias
        .filter((x: any) => !selectedColonias.includes(x.properties.OBJECTID_1))
        .sort((a: any, b: any) =>
            a.properties.NOM_COL > b.properties.NOM_COL ? 1 : -1
        );
    return (
        <Popover
            id="toolbar-select-colonias"
            placement="bottom"
            closeOnBlur={true}
            isOpen={isFocused}
        >
            <PopoverTrigger>
                <ButtonGroup
                    my="5"
                    mx="1"
                    size="sm"
                    isAttached
                    className="toolbar-edit__div"
                >
                    <Button
                        rightIcon={
                            isFocused ? <IoCaretUpSharp size="10px" /> : <IoCaretDownSharp size="10px" />
                        }
                        onClick={setIsFocused.toggle}
                        w="100%"
                        size="sm"
                        height="35px"
                        borderRadius="5px"
                        color="white"
                        className="toolbar-edit__button"
                        fontSize="14px"
                        fontWeight="400"
                    >
                        {selectedColonias.length} Colonia(s)
                    </Button>
                    <IconButton
                        size="xs"
                        colorScheme="red"
                        aria-label="Remove colonias"
                        icon={<MdDelete />}
                        style={{ height: "30px", width: "30px" }}
                        onClick={() => dispatch(clearSelectedColonias())}
                    />
                </ButtonGroup>
            </PopoverTrigger>
            <PopoverContent
                border="0"
                height="200px"
                width="200px"
                bg="var(--primary-dark3)"
                style={{ overflow: "hidden" }}
            >
                <List
                    size="sm"
                    spacing={1}
                    style={{ overflowY: "scroll" }}
                    p="2"
                >
                    {selectedColoniasObjects.map((item: any) => (
                        <>
                            <ListItem mb="2">
                                <Checkbox
                                    size="md"
                                    colorScheme="white"
                                    color="white"
                                    isChecked={true}
                                    onChange={() => {
                                        dispatch(
                                            toggleSelectedColonias(
                                                item.properties.OBJECTID_1
                                            )
                                        );
                                    }}
                                >
                                    <Text fontSize="sm">
                                        {item.properties.NOM_COL}
                                    </Text>
                                </Checkbox>
                            </ListItem>
                        </>
                    ))}
                    <Divider />
                    {unselectedColonias.map((item: any) => (
                        <>
                            <ListItem mb="2">
                                <Checkbox
                                    size="md"
                                    colorScheme="white"
                                    color="white"
                                    isChecked={false}
                                    onChange={() => {
                                        dispatch(
                                            toggleSelectedColonias(
                                                item.properties.OBJECTID_1
                                            )
                                        );
                                    }}
                                >
                                    <Text fontSize="sm">
                                        {item.properties.NOM_COL}
                                    </Text>
                                </Checkbox>
                            </ListItem>
                        </>
                    ))}
                </List>
            </PopoverContent>
        </Popover>
    );
};
