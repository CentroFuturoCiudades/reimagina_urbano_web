import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Checkbox,
  Box,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Tag,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { COLUMN_MAPPING } from "./constants";

const mappingLabels = {
  proximity_small_park: "Parque",
  proximity_salud: "Salud",
  proximity_educacion: "Educación",
  proximity_servicios: "Servicios",
  proximity_supermercado: "Supermercado",
};

export const Toolbar = ({ configuration, setConfiguration }) => {
  const proximityOptions = {
    proximity_small_park: 1,
    proximity_salud: 2,
    proximity_educacion: 1,
    proximity_servicios: 5,
    proximity_supermercado: 1,
  };

  const handleProximityChange = (type, value, key) => {
    // Create a copy of the current accessibility_info
    const updatedAccessibilityInfo = { ...configuration.accessibility_info };

    if (type === "checkbox") {
      if (value) {
        // If the checkbox is checked, initialize or maintain the current value
        updatedAccessibilityInfo[key] =
          updatedAccessibilityInfo[key] || proximityOptions[key];
      } else {
        // If the checkbox is unchecked, delete the key from accessibility_info
        delete updatedAccessibilityInfo[key];
      }
    } else {
      // For number input changes, update the value directly
      updatedAccessibilityInfo[key] = parseInt(value) || 0;
    }

    // Update the configuration with the modified accessibility_info
    setConfiguration({
      ...configuration,
      accessibility_info: updatedAccessibilityInfo,
    });
  };

  return (
    <Box
      style={{
        position: "absolute",
        width: "315px",
        padding: "20px",
        top: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "0px 0px 0px 15px",
      }}
    >
      <h1>Tipo de Info</h1>
      <Select
        onChange={(e) =>
          setConfiguration({ ...configuration, metric: e.target.value })
        }
        value={
          COLUMN_MAPPING[configuration.metric] && !configuration.condition
            ? configuration.metric
            : "custom"
        }
      >
        {Object.keys(COLUMN_MAPPING).map((column) => (
          <option key={column} value={column}>
            {COLUMN_MAPPING[column]}
          </option>
        ))}
        <option value="custom">Custom query</option>
      </Select>
      {configuration.metric && (
        <Tag colorScheme="green" my={2}>
          SELECT {configuration.metric} FROM predios
          {configuration.condition ? ` WHERE ${configuration.condition}` : ""}
        </Tag>
      )}
      {configuration.metric === "minutes" && (
        <Accordion allowMultiple my={4}>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Seleccionar Proximidad
              </Box>
            </AccordionButton>
            <AccordionPanel>
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
      <br />
      Edificios
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={configuration.opacities.building}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            opacities: { ...configuration.opacities, building: e },
          })
        }
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      Estacionamientos
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={configuration.opacities.parking}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            opacities: { ...configuration.opacities, parking: e },
          })
        }
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      Parques
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={configuration.opacities.park}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            opacities: { ...configuration.opacities, park: e },
          })
        }
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      Áreas Vegetación
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={configuration.opacities.green}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            opacities: { ...configuration.opacities, green: e },
          })
        }
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      Equipamientos
      <Slider
        min={0}
        max={1}
        step={0.1}
        value={configuration.opacities.equipment}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            opacities: { ...configuration.opacities, equipment: e },
          })
        }
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      3D
      <Switch
        isChecked={configuration.is3D}
        onChange={(e) =>
          setConfiguration({ ...configuration, is3D: e.target.checked })
        }
      />
    </Box>
  );
};
