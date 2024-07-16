import React, { useState, ChangeEvent, FocusEvent } from 'react';
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
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store";


const options = [
  { value: 'parque', label: 'Parque' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'supermercado', label: 'Supermercado' },
];

interface Option {
  value: string;
  label: string;
}

const SelectAutoComplete = () => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [search, setSearch] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const accessibilityList = useSelector((state: RootState) => state.accessibilityList.accessibilityList);


  const dispatch: AppDispatch = useDispatch();


  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredOptions(
      options.filter(
        (option) =>
          option.label.toLowerCase().includes(value.toLowerCase()) &&
          !accessibilityList.some((selected) => selected.value === option.value)
      )
    );
  };

  const handleOptionClick = (option: Option) => {
    const updatedSelectedOptions = [...selectedOptions, option];
    dispatch(setAccessibilityList([...accessibilityList, option]));
    setSelectedOptions(updatedSelectedOptions);
    setSearch('');
    setFilteredOptions(
      options.filter(
        (opt) =>
          !updatedSelectedOptions.some((selected) => selected.value === opt.value) &&
          opt.label.toLowerCase().includes('')
      )
    );
    setIsFocused(false);
  };

  const handleRemoveOption = (option: Option) => {
    const updatedSelectedOptions = selectedOptions.filter(
      (selected) => selected.value !== option.value
    );
    setSelectedOptions(updatedSelectedOptions);
    setFilteredOptions(
      options.filter(
        (opt) =>
          !updatedSelectedOptions.some((selected) => selected.value === opt.value) &&
          opt.label.toLowerCase().includes(search)
      )
    );
    dispatch(setAccessibilityList(
      selectedOptions.filter(
        (selected) => selected.value !== option.value
      )
    ))
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
        placeholder={"Selecciona una opción"}
        value={search}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size={"sm"}
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
          <List size={"sm"} spacing={1}>
            {filteredOptions.map((option) => (
              <ListItem
                key={option.value}
                px="4"
                py="1"
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.100' }}
                onMouseDown={() => handleOptionClick(option)}
              >
                <Text>
                  {option.label}

                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Box mt={2}>
        {selectedOptions.length > 0 && selectedOptions.map((option) => (
          <Flex key={option.value} align="center" mt={2}>
            <Button size={"xs"} bg={"white"} borderWidth={"1px"} marginRight={"1dvw"} onClick={() => handleRemoveOption(option)}>
              <IoClose color="red" />
            </Button>
            <NumberInput
                    width="50px"
                    size="xs"
                    defaultValue={0}
                    min={0}
                  >
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