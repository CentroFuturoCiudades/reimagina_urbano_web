import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import { setAccessibilityList } from '../../features/accessibilityList/accessibilityListSlice';
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GenericObject } from '../../types';

import "./SelectAutoComplete.scss"
import { amenitiesOptions } from '../../constants';

export const mappingCategories: any = {
  health: 'Salud',
  recreation: 'Recreación',
  education: 'Educación',
};

const SelectAutoComplete = () => {
  const [search, setSearch] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
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

  const getSelectedSummary = (): string => {
    const summary: string[] = [];

    Object.entries(groupedAmenitiesOptions).forEach(([category, amenities]) => {
      const allSelected = amenities.every((amenity) => checkedItems[amenity.value]);
      const someSelected = amenities.some((amenity) => checkedItems[amenity.value]);

      if (allSelected) {
        summary.push(category.charAt(0).toUpperCase() + category.slice(1));
      } else if (someSelected) {
        amenities.forEach((amenity) => {
          if (checkedItems[amenity.value]) {
            summary.push(amenity.label);
          }
        });
      }
    });

    return summary.join(', ');
  };

  return (
    <Box className="selectAutoComplete" position="relative">
      <Input
        variant="filled"
        placeholder="Selecciona un equipamiento de interés"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        size="sm"
        mt="2"
      />
      {isFocused && (
        <Box
          position="absolute"
          top="3rem"
          left="0"
          right="0"
          borderWidth="1px"
          borderRadius="md"
          maxH="200px"
          overflowY="auto"
          bg="white"
          zIndex="1"
        >
          <List size="sm" spacing={1}>
            {Object.entries(groupedAmenitiesOptions).map(([category, amenities]) => {
              const allChecked = amenities.every((amenity) => checkedItems[amenity.value]);
              const isIndeterminate = amenities.some((amenity) => checkedItems[amenity.value]) && !allChecked;

              return (
                <React.Fragment key={category}>
                  <ListItem px="2" py="2" fontWeight="bold" bg="gray.100" borderBottom="1px solid" borderColor="gray.200">
                    <Checkbox
                      isChecked={allChecked}
                      isIndeterminate={isIndeterminate}
                      colorScheme="purple"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(category, e.target.checked)}
                    >
                      {mappingCategories[category]}
                    </Checkbox>
                  </ListItem>

                  {amenities.map((amenity: GenericObject) => (
                    <Box>
                      <Checkbox
                        px="4"
                        size='sm'
                        colorScheme="purple"
                        isChecked={checkedItems[amenity.value] || false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          handleSubcategoryChange(amenity, e.target.checked)
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                      >
                        {amenity.label}
                      </Checkbox>
                      </Box>
                  ))}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      )}
      <Box mt={2} width="100%">
        <Text fontSize="sm" fontWeight="400"><b>Seleccionados: </b>{getSelectedSummary() || 'Todos'}</Text>
      </Box>
    </Box>
  );
};

export default SelectAutoComplete;
