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
import { MdDelete } from "react-icons/md";
import {
    clearSelectedColonias,
    toggleSelectedColonias,
} from "../../features/viewMode/viewModeSlice";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
import _ from "lodash";

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
                <ButtonGroup size="xs" isAttached className="toolbar-edit__div">
                    <Button
                        rightIcon={
                            isFocused ? (
                                <IoCaretUpSharp fontSize="0.6dvw" />
                            ) : (
                                <IoCaretDownSharp fontSize="0.6dvw" />
                            )
                        }
                        onClick={setIsFocused.toggle}
                        size="xs"
                        className="toolbar-edit__button"
                    >
                        {selectedColonias.length} Colonia(s)
                    </Button>
                    <IconButton
                        size="xs"
                        colorScheme="red"
                        aria-label="Deseleccionar colonias"
                        icon={<MdDelete fontSize="0.8dvw" />}
                        style={{
                            height: "2dvw",
                            width: "2dvw",
                            minWidth: "auto",
                        }}
                        onClick={() => dispatch(clearSelectedColonias())}
                    />
                </ButtonGroup>
            </PopoverTrigger>
            <PopoverContent
                border="0"
                height="15dvw"
                width="10dvw"
                bg="var(--primary-dark3)"
                style={{ overflow: "hidden", borderRadius: "0.5dvw" }}
            >
                <List
                    className="toolbar-colonias-list"
                    size="xs"
                    spacing={1}
                    style={{ overflowY: "scroll" }}
                    p="0.5dvw"
                >
                    {selectedColoniasObjects.map((item: any) => (
                        <>
                            <ListItem mb="0.2dvw" height="1.4dvw">
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
                                    <Text fontSize="0.6dvw">
                                        {_.startCase(
                                            _.toLower(item.properties.NOM_COL)
                                        )}
                                    </Text>
                                </Checkbox>
                            </ListItem>
                        </>
                    ))}
                    <Divider />
                    {unselectedColonias.map((item: any) => (
                        <>
                            <ListItem mb="0.2dvw" height="1.4dvw">
                                <Checkbox
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
                                    <Text fontSize="0.6dvw">
                                        {_.startCase(
                                            _.toLower(item.properties.NOM_COL)
                                        )}
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
