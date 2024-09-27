import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Input,
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
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react';
import { setAccessibilityList } from '../../features/accessibilityList/accessibilityListSlice';
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GenericObject } from '../../types';

import "./SelectAutoComplete.scss"
import { amenitiesOptions } from '../../constants';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

export const mappingCategories: any = {
  health: 'Salud',
  recreation: 'Recreación',
  education: 'Educación',
  park: 'Parque',
  other: 'Otro',
};

const orderCategories = ['education', 'health', 'recreation', 'other'];

const SelectAutoComplete = () => {
  const [isFocused, setIsFocused] = useBoolean();
  const accessibilityList = useSelector((state: RootState) => state.accessibilityList.accessibilityList);
  const dispatch: AppDispatch = useDispatch();

  const groupedAmenitiesOptions: Record<string, GenericObject[]> = amenitiesOptions.reduce((acc, option) => {
    acc[option.type] = acc[option.type] || [];
    acc[option.type].push(option);
    return acc;
  }, {} as Record<string, GenericObject[]>);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialChecked = accessibilityList.reduce((acc, option) => {
      acc[option.value] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setCheckedItems(initialChecked);
  }, [accessibilityList]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    console.log(category);
    const updatedCheckedItems = { ...checkedItems };
    groupedAmenitiesOptions[category].forEach((amenity) => {
      updatedCheckedItems[amenity.value] = checked;
    });
    setCheckedItems(updatedCheckedItems);

    if (checked) {
      const newSelections = groupedAmenitiesOptions[category].filter(
        (amenity) => !accessibilityList.some((item) => item.value === amenity.value)
      );
      dispatch(setAccessibilityList([...accessibilityList, ...newSelections]));
    } else {
      const updatedSelections = accessibilityList.filter(
        (selected) => !groupedAmenitiesOptions[category].some((amenity) => amenity.value === selected.value)
      );
      dispatch(setAccessibilityList(updatedSelections));
    }
  };

  const handleSubcategoryChange = (amenity: GenericObject, checked: boolean) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [amenity.value]: checked,
    };
    setCheckedItems(updatedCheckedItems);

    if (checked) {
      dispatch(setAccessibilityList([...accessibilityList, amenity]));
    } else {
      const updatedSelectedOptions = accessibilityList.filter((item) => item.value !== amenity.value);
      dispatch(setAccessibilityList(updatedSelectedOptions));
    }
  };

  const getSelectedSummary = (): string[] => {
    const summary: string[] = [];

    Object.entries(groupedAmenitiesOptions)
      .forEach(([category, amenities]) => {
      const allSelected = amenities.every((amenity) => checkedItems[amenity.value]);
      const someSelected = amenities.some((amenity) => checkedItems[amenity.value]);

      if (allSelected) {
        summary.push(mappingCategories[category]);
      } else if (someSelected) {
        amenities.forEach((amenity) => {
          if (checkedItems[amenity.value]) {
            summary.push(amenity.label);
          }
        });
      }
    });

    return summary;
  };
  const summay = getSelectedSummary();

  // remove either amenity or category
  const removeAmenity = (amenity: string) => {
    const category = Object.keys(mappingCategories).find((key) => mappingCategories[key] === amenity);
    console.log(category);
    if (!category) {
      const updatedSelectedOptions = accessibilityList.filter((x) => x.label !== amenity);
      dispatch(setAccessibilityList(updatedSelectedOptions));
    } else {
      const updatedSelectedOptions = accessibilityList.filter((x) => x.type !== category);
      dispatch(setAccessibilityList(updatedSelectedOptions));
    }
  }

  return (
    <Box className="selectAutoComplete" position="relative" w="100%">
      <Popover
        placement='bottom'
        closeOnBlur={true}
        isOpen={isFocused}
        onOpen={setIsFocused.on}
        onClose={setIsFocused.off}
      >
        <PopoverTrigger>
            <Button
              className='seleccionAccesibilidad'
              rightIcon={isFocused ? <FaChevronUp /> : <FaChevronDown />}
              onClick={setIsFocused.toggle}
              w="100%"
              size="sm"
              height="35px"
              borderRadius="5px"
            >Equipamientos esenciales</Button>
        </PopoverTrigger>
        <PopoverContent border="1px solid #c3cff0" height="200px">
          <List size="sm" spacing={1} style={{ overflowY: 'scroll' }}>
            {Object.entries(groupedAmenitiesOptions)
            .sort((a, b) => orderCategories.indexOf(a[0]) - orderCategories.indexOf(b[0]))
            .map(([category, amenities]) => {
              const allChecked = amenities.every((amenity) => checkedItems[amenity.value]);
              const isIndeterminate = amenities.some((amenity) => checkedItems[amenity.value]) && !allChecked;

              return (
                <React.Fragment key={category}>
                  <ListItem px="2" py="1" fontWeight="bold" bg="gray.100" borderBottom="1px solid" borderColor="gray.200">
                    <Checkbox
                      isChecked={allChecked}
                      isIndeterminate={isIndeterminate}
                      colorScheme="blue"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category, e.target.checked)}
                    >
                      {mappingCategories[category]}
                    </Checkbox>
                  </ListItem>
                  <ListItem mb="2">
                  {amenities.map((amenity: GenericObject) => (
                    <Box>
                      <Checkbox
                        px="4"
                        size='md'
                        colorScheme="blue"
                        isChecked={checkedItems[amenity.value] || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          handleSubcategoryChange(amenity, e.target.checked)
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                      >
                        <Text fontSize="sm">{amenity.label}</Text>
                      </Checkbox>
                      </Box>
                  ))}
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
      </PopoverContent>
      </Popover>
      <Box width="100%" my="2">
        {summay.map((item: any) => (<Tag m="0.5"
              className='tag-selection'
              size="xs"
              px="1"
              fontSize="12px"
              key={item}
            >{item}<TagCloseButton fontSize="xs"
              onClick={() => removeAmenity(item)} /></Tag>))}
          {summay.length === 0 && <Tag
            variant="outline"
            color="black"
            m="1"
            size="md"
            p="1"
            fontSize="12px"
            colorScheme="gray">Todos los equipamientos</Tag>}
      </Box>
    </Box>
  );
};

export default SelectAutoComplete;
