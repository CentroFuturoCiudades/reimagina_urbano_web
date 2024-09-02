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
  Tag,
  TagCloseButton,
} from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';
import { setAccessibilityList } from '../../features/accessibilityList/accessibilityListSlice';
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { GenericObject } from '../../types';

import "./SelectAutoComplete.scss"

const options = [
  { value: 'asistencial_social', label: 'Asistencia social' },
  { value: 'laboratorios_clinicos', label: 'Laboratorios clínicos' },
  { value: 'otros_consultorios', label: 'Otros consultorios' },
  { value: 'consultorios_medicos', label: 'Consultorios médicos' },
  { value: 'hospital_general', label: 'Hospital general' },
  { value: 'hospitales_psiquiatricos', label: 'Hospitales psiquiátricos' },
  { value: 'hospitales_otras_especialidades', label: 'Hospitales otras especialidades' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'clubs_deportivos_y_acondicionamiento_fisico', label: 'Clubs deportivos y de acondicionamiento físico' },
  { value: 'cine', label: 'Cine' },
  { value: 'otros_servicios_recreativos', label: 'Otros servicios recreativos' },
  { value: 'parques_recreativos', label: 'Parques recreativos' },
  { value: 'museos', label: 'Museos' },
  { value: 'biblioteca', label: 'Biblioteca' },
  { value: 'guarderia', label: 'Guardería' },
  { value: 'educacion_preescolar', label: 'Educación preescolar' },
  { value: 'educacion_primaria', label: 'Educación primaria' },
  { value: 'educacion_secundaria', label: 'Educación secundaria' },
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
    <Box className='selectAutoComplete' position="relative">
      <Input
        variant="filled"
        placeholder="Selecciona un equipamiento de interés"
        value={search}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="sm"
        mt="2"
      />
      { isFocused && (
        <Box
          position="absolute"
          top="1rem"
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
      <Box mt={2} width="100%">
        {accessibilityList.length > 0 &&
          accessibilityList.map((option) => (
            <Tag
              size="sm"
              key={option.value}
              variant="solid"
              colorScheme="purple"
              cursor="pointer"
              mr={2}
              onClick={() => handleRemoveOption(option)}
            >
              {option.label}
              <TagCloseButton />
            </Tag>
          ))}
          {accessibilityList.length === 0 && (
            <Tag
              size="sm"
              variant="solid"
              colorScheme="red"
              cursor="pointer"
            >
              Todos los equipamientos
            </Tag>
          )}
      </Box>
    </Box>
  );
};

export default SelectAutoComplete;
