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
} from "@chakra-ui/react";
import { GenericObject } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setAccSettings } from "../../features/accSettings/accSettingsSlice";
import { RootState } from "../../app/store";
import { SelectAutoComplete } from "../";



const mappingLabels: GenericObject = {
  proximity_small_park: "Parque",
  proximity_salud: "Salud",
  proximity_educacion: "Educación",
  proximity_servicios: "Servicios",
  proximity_supermercado: "Supermercado",
};

interface ConfigurationToolbarProps {
  configuration: GenericObject;
}

const ConfigurationToolbar = ({
  configuration,
}: ConfigurationToolbarProps) => {

    const dispatch = useDispatch();


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
    <Box
      style={{

      }}
    >
      { true && (
        <Accordion allowMultiple my={4}>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Seleccionar Proximidad
              </Box>
            </AccordionButton>
              {Object.entries(proximityOptions).map(([key, initialValue]) => (
                <Box key={key} display="flex" alignItems="center" mb={2}>
                  <Checkbox
                    isChecked={!!configuration.accessibility_info[key]}
                    onChange={(e) =>
                      handleProximityChange("checkbox", e.target.checked, key)
                    }
                    mr={2}
                  />
                  <NumberInput
                    width="50px"
                    size="xs"
                    id={key}
                    defaultValue={initialValue}
                    min={0}
                    onChange={(val) =>
                      handleProximityChange("number", val || 1, key)
                    }
                    keepWithinRange={true}
                    isDisabled={!configuration.accessibility_info[key]}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper fontSize="8px" />
                      <NumberDecrementStepper fontSize="8px" />
                    </NumberInputStepper>
                  </NumberInput>
                  <label>{mappingLabels[key]}</label>
                </Box>
              ))}
          </AccordionItem>
        </Accordion>
      )}
    </Box>
  );
};

export default ConfigurationToolbar;
