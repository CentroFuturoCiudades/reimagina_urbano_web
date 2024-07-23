import React, { useState, ChangeEvent, FocusEvent, useEffect } from 'react';
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';
import { setAccessibilityList } from '../../features/accessibilityList/accessibilityListSlice';
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GenericObject } from '../../types';

const options = [
  { value: 'landuse_park', label: 'Parque' },
  { value: 'landuse_equipment', label: 'Equipamiento' },
  { value: 'establishments', label: 'Establecimientos' },
];


const SelectAutoComplete = () => {
  const [filteredOptions, setFilteredOptions] = useState<GenericObject[]>(options);
  const [search, setSearch] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const accessibilityList = useSelector((state: RootState) => state.accessibilityList.accessibilityList);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(search.toLowerCase()) &&
          !accessibilityList.some((selected) => selected.value === option.value)
      )
    );
  }, [search, accessibilityList]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleOptionClick = (option: GenericObject) => {
    const updatedSelectedOptions = [...accessibilityList, option];
    dispatch(setAccessibilityList(updatedSelectedOptions));
    setSearch('');
    setIsFocused(false);
  };

  const handleRemoveOption = (option: GenericObject) => {
    const updatedSelectedOptions = accessibilityList.filter(
      (selected) => selected.value !== option.value
    );
    dispatch(setAccessibilityList(updatedSelectedOptions));
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTimeout(() => setIsFocused(false), 100);
  };

  return (
    <Box position="relative">
      <Input
        variant="outline"
        placeholder="Selecciona una opción"
        value={search}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="sm"
      />
      {isFocused && (
        <Box
          position="absolute"
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
            {filteredOptions.map((option) => (
              <ListItem
                key={option.value}
                px="4"
                py="1"
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.100' }}
                onMouseDown={() => handleOptionClick(option)}
              >
                <Text>{option.label}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Box mt={2}>
        {accessibilityList.length > 0 &&
          accessibilityList.map((option) => (
            <Flex key={option.value} align="center" mt={2}>
              <Button size="xs" bg="white" borderWidth="1px" marginRight="1dvw" onClick={() => handleRemoveOption(option)}>
                <IoClose color="red" />
              </Button>
              <NumberInput width="50px" size="xs" defaultValue={0} min={0}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper fontSize="8px" />
                  <NumberDecrementStepper fontSize="8px" />
                </NumberInputStepper>
              </NumberInput>
              <Text marginStart={3}>{option.label}</Text>
            </Flex>
          ))}
      </Box>
    </Box>
  );
};

export default SelectAutoComplete;
