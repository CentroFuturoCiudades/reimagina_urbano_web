import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Checkbox,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { GenericObject } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setAccSettings } from "../../features/accSettings/accSettingsSlice";
import { RootState } from "../../app/store";
import { useState } from "react";
import './Accesibilidad.scss';
import SelectAutoComplete from "../SelectAutoComplete";

const mappingLabels: GenericObject = {
  proximity_small_park: "Parque",
  proximity_salud: "Salud",
  proximity_educacion: "Educación",
  proximity_servicios: "Servicios",
  proximity_supermercado: "Supermercado",
};

interface AccessibilityToolbarProps {
  configuration: GenericObject;
}

const AccessibilityToolbar = ({
  configuration,
}: AccessibilityToolbarProps) => {

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    let proximityOptions: GenericObject = useSelector((state: RootState) => state.accSettings.accSettings );

  const handleProximityChange = (type: string, value: any, key: string) => {
    // Create a copy of the current accessibility_info
    let updatedAccessibilityInfo: GenericObject = {
      ...proximityOptions
    };

    if (type === "checkbox") {

        let { [key]: _, ...others } = proximityOptions;
        updatedAccessibilityInfo = others;

      if (value) {
        // If the checkbox is checked, initialize or maintain the current value
        updatedAccessibilityInfo[key] =
          updatedAccessibilityInfo[key] || proximityOptions[key] || 1;
      } else {
        let { [key]: _, ...others } = proximityOptions;
        proximityOptions = others;
      }

    } else {
        updatedAccessibilityInfo[ key ] = parseInt(value);
    }

    console.log( updatedAccessibilityInfo )
    dispatch( setAccSettings( updatedAccessibilityInfo ) );

  };

  return (
    <>
      <div className="accordion-header2" onClick={toggleAccordion}>
          <Box flex="1" textAlign="left">
              Servicios de proximidad
          </Box>
      </div>
      <Box
        style={{

        }}
      >

      { isOpen && (
        <Accordion className="visor-container2" allowMultiple >
          <AccordionItem>
            <Box className="stat-row" >
                <Box className="stat-title-box">
                    <Text className="stat-title">Servicios y equipamientos</Text>
                </Box>
            </Box>
            <Box>
                <SelectAutoComplete />
            </Box>
          </AccordionItem>
        </Accordion>
      )}
    </Box></>
  );
};

export default AccessibilityToolbar;
