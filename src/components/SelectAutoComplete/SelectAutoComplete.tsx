import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Box,
    List,
    ListItem,
    Text,
    Checkbox,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useBoolean,
    Tag,
    TagCloseButton,
    Button,
} from "@chakra-ui/react";
import { setAccessibilityList } from "../../features/accessibilityList/accessibilityListSlice";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GenericObject } from "../../types";

import "./SelectAutoComplete.scss";
import { amenitiesOptions } from "../../constants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export const mappingCategories: any = {
    health: "Salud",
    recreation: "Recreación",
    education: "Educación",
    park: "Parque",
    other: "Otro",
};

const orderCategories = ["education", "health", "recreation", "other"];

const SelectAutoComplete = () => {
    const [isFocused, setIsFocused] = useBoolean();
    const accessibilityList = useSelector(
        (state: RootState) => state.accessibilityList.accessibilityList
    );
    const dispatch: AppDispatch = useDispatch();

    const groupedAmenitiesOptions: Record<string, GenericObject[]> =
        amenitiesOptions.reduce((acc, option) => {
            acc[option.type] = acc[option.type] || [];
            acc[option.type].push(option);
            return acc;
        }, {} as Record<string, GenericObject[]>);

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
        {}
    );

    useEffect(() => {
        const initialChecked = accessibilityList.reduce((acc, option) => {
            acc[option.value] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setCheckedItems(initialChecked);
    }, [accessibilityList]);

    const handleCategoryChange = (category: string, checked: boolean) => {
        const updatedCheckedItems = { ...checkedItems };
        groupedAmenitiesOptions[category].forEach((amenity) => {
            updatedCheckedItems[amenity.value] = checked;
        });
        setCheckedItems(updatedCheckedItems);

        if (checked) {
            const newSelections = groupedAmenitiesOptions[category].filter(
                (amenity) =>
                    !accessibilityList.some(
                        (item) => item.value === amenity.value
                    )
            );
            dispatch(
                setAccessibilityList([...accessibilityList, ...newSelections])
            );
        } else {
            const updatedSelections = accessibilityList.filter(
                (selected) =>
                    !groupedAmenitiesOptions[category].some(
                        (amenity) => amenity.value === selected.value
                    )
            );
            dispatch(setAccessibilityList(updatedSelections));
        }
    };

    const handleSubcategoryChange = (
        amenity: GenericObject,
        checked: boolean
    ) => {
        const updatedCheckedItems = {
            ...checkedItems,
            [amenity.value]: checked,
        };
        setCheckedItems(updatedCheckedItems);

        if (checked) {
            dispatch(setAccessibilityList([...accessibilityList, amenity]));
        } else {
            const updatedSelectedOptions = accessibilityList.filter(
                (item) => item.value !== amenity.value
            );
            dispatch(setAccessibilityList(updatedSelectedOptions));
        }
    };

    const getSelectedSummary = (): string[] => {
        const summary: string[] = [];

        Object.entries(groupedAmenitiesOptions).forEach(
            ([category, amenities]) => {
                const allSelected = amenities.every(
                    (amenity) => checkedItems[amenity.value]
                );
                const someSelected = amenities.some(
                    (amenity) => checkedItems[amenity.value]
                );

                if (allSelected) {
                    summary.push(mappingCategories[category]);
                } else if (someSelected) {
                    amenities.forEach((amenity) => {
                        if (checkedItems[amenity.value]) {
                            summary.push(amenity.label);
                        }
                    });
                }
            }
        );

        return summary;
    };
    const summay = getSelectedSummary();

    // remove either amenity or category
    const removeAmenity = (amenity: string) => {
        const category = Object.keys(mappingCategories).find(
            (key) => mappingCategories[key] === amenity
        );
        if (!category) {
            const updatedSelectedOptions = accessibilityList.filter(
                (x) => x.label !== amenity
            );
            dispatch(setAccessibilityList(updatedSelectedOptions));
        } else {
            const updatedSelectedOptions = accessibilityList.filter(
                (x) => x.type !== category
            );
            dispatch(setAccessibilityList(updatedSelectedOptions));
        }
    };

    return (
        <Box className="selectAutoComplete" position="relative" w="100%">
            <Popover
                placement="bottom"
                closeOnBlur={true}
                isOpen={isFocused}
                onOpen={setIsFocused.on}
                onClose={setIsFocused.off}
            >
                <PopoverTrigger>
                    <Button
                        className="seleccionAccesibilidad"
                        rightIcon={
                            isFocused ? (
                                <FaChevronUp fontSize="min(1.6dvh, 0.8dvw)" />
                            ) : (
                                <FaChevronDown fontSize="min(1.6dvh, 0.8dvw)" />
                            )
                        }
                        onClick={setIsFocused.toggle}
                        w="100%"
                        size="sm"
                        fontSize="min(1.8dvh, 0.9dvw)"
                        height="min(5dvh, 2.5dvw)"
                        borderRadius="min(0.8dvh, 0.4dvw)"
                    >
                        Equipamientos esenciales
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    border="min(0.2dvh, 0.1dvw) solid #c3cff0"
                    height="min(40dvh, 20dvw)"
                    width="24dvw"
                    style={{
                        overflow: "hidden",
                        borderRadius: "min(0.8dvh, 0.4dvw)",
                    }}
                >
                    <List size="sm" spacing={1} style={{ overflowY: "scroll" }}>
                        {Object.entries(groupedAmenitiesOptions)
                            .sort(
                                (a, b) =>
                                    orderCategories.indexOf(a[0]) -
                                    orderCategories.indexOf(b[0])
                            )
                            .map(([category, amenities]) => {
                                const allChecked = amenities.every(
                                    (amenity) => checkedItems[amenity.value]
                                );
                                const isIndeterminate =
                                    amenities.some(
                                        (amenity) => checkedItems[amenity.value]
                                    ) && !allChecked;

                                return (
                                    <React.Fragment key={category}>
                                        <ListItem
                                            px="min(1.4dvh, 0.7dvw)"
                                            py="min(0.8dvh, 0.4dvw)"
                                            fontWeight="bold"
                                            bg="gray.100"
                                            borderBottom="1px solid"
                                            borderColor="gray.200"
                                            style={{
                                                height: "min(5dvh, 2.5dvw)",
                                            }}
                                        >
                                            <Checkbox
                                                isChecked={allChecked}
                                                isIndeterminate={
                                                    isIndeterminate
                                                }
                                                colorScheme="blue"
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    handleCategoryChange(
                                                        category,
                                                        e.target.checked
                                                    )
                                                }
                                            >
                                                <Text fontSize="min(2dvh, 1dvw)">
                                                    {
                                                        mappingCategories[
                                                            category
                                                        ]
                                                    }
                                                </Text>
                                            </Checkbox>
                                        </ListItem>
                                        <ListItem mb="min(1.2dvh, 0.6dvw)">
                                            {amenities.map(
                                                (
                                                    amenity: GenericObject,
                                                    index
                                                ) => (
                                                    <Box
                                                        key={index}
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            px="min(4dvh, 2dvw)"
                                                            py="min(0.4dvh, 0.2dvw)"
                                                            size="md"
                                                            colorScheme="blue"
                                                            isChecked={
                                                                checkedItems[
                                                                    amenity
                                                                        .value
                                                                ] || false
                                                            }
                                                            onChange={(
                                                                e: ChangeEvent<HTMLInputElement>
                                                            ) => {
                                                                handleSubcategoryChange(
                                                                    amenity,
                                                                    e.target
                                                                        .checked
                                                                );
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                            }}
                                                            style={{ margin: '0px' }}
                                                        >
                                                            <Text fontSize="min(2dvh, 1dvw)">
                                                                {amenity.label}
                                                            </Text>
                                                        </Checkbox>
                                                    </Box>
                                                )
                                            )}
                                        </ListItem>
                                    </React.Fragment>
                                );
                            })}
                    </List>
                </PopoverContent>
            </Popover>
            <Box width="100%" my="min(1.6dvh, 0.8dvw)">
                {summay.map((item: any) => (
                    <Tag
                        m="min(0.4dvh, 0.2dvw)"
                        color="var(--primary-dark)"
                        fontSize="min(1.6dvh, 0.8dvw)"
                        className="tag-selection"
                        px="min(1.4dvh, 0.7dvw)"
                        py="0"
                        height="min(3dvh, 1.5dvw)"
                        borderRadius="min(1.4dvh, 0.7dvw)"
                        key={item}
                    >
                        {item}
                        <TagCloseButton
                            color="darkred"
                            fontSize="min(1.6dvh, 0.8dvw)"
                            onClick={() => removeAmenity(item)}
                        />
                    </Tag>
                ))}
                {summay.length === 0 && (
                    <Tag
                        variant="outline"
                        m="min(0.4dvh, 0.2dvw)"
                        px="min(1.4dvh, 0.7dvw)"
                        py="0"
                        fontSize="min(1.6dvh, 0.8dvw)"
                        height="min(3dvh, 1.5dvw)"
                        color="var(--primary-dark)"
                        borderRadius="min(1.4dvh, 0.7dvw)"
                    >
                        Todos los equipamientos
                    </Tag>
                )}
            </Box>
        </Box>
    );
};

export default SelectAutoComplete;
