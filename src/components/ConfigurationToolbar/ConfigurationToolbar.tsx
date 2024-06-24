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
import { COLUMN_MAPPING } from "../../constants";
import { Configuration, GenericObject } from "../../types";

const mappingLabels: GenericObject = {
  proximity_small_park: "Parque",
  proximity_salud: "Salud",
  proximity_educacion: "Educación",
  proximity_servicios: "Servicios",
  proximity_supermercado: "Supermercado",
};

interface ConfigurationToolbarProps {
  configuration: GenericObject;
  supermercados: Configuration;

  setConfiguration: React.Dispatch<React.SetStateAction<GenericObject>>;
  setParques: React.Dispatch<React.SetStateAction<Configuration>>;
  setSalud: React.Dispatch<React.SetStateAction<Configuration>>;
  setEducacion: React.Dispatch<React.SetStateAction<Configuration>>;
  setServicios: React.Dispatch<React.SetStateAction<Configuration>>;
  setSupermercados: React.Dispatch<React.SetStateAction<Configuration>>;
}

const ConfigurationToolbar = ({
  configuration,
  setConfiguration,
  setParques,
  supermercados,
  setSalud,
  setEducacion,
  setServicios,
  setSupermercados,
}: ConfigurationToolbarProps) => {
  const proximityOptions: GenericObject = {
    proximity_small_park: 1,
    proximity_salud: 2,
    proximity_educacion: 1,
    proximity_servicios: 5,
    proximity_supermercado: 1,
  };

  const handleProximityChange = (type: string, value: any, key: string) => {
    // Create a copy of the current accessibility_info
    const updatedAccessibilityInfo: GenericObject = {
      ...configuration.accessibility_info,
    };

    if (type === "checkbox") {
      if (value) {
        // If the checkbox is checked, initialize or maintain the current value
        updatedAccessibilityInfo[key] =
          updatedAccessibilityInfo[key] || proximityOptions[key];
      } else {
        // If the checkbox is unchecked, delete the key from accessibility_info
        delete updatedAccessibilityInfo[key];
      }
      switch (key) {
        case "proximity_small_park":
          setParques((prev) => ({ ...prev, activated: value }));
          break;
        case "proximity_salud":
          setSalud((prev) => ({ ...prev, activated: value }));
          break;
        case "proximity_educacion":
          setEducacion((prev) => ({ ...prev, activated: value }));
          break;
        case "proximity_servicios":
          setServicios((prev) => ({ ...prev, activated: value }));
          break;
        case "proximity_supermercado":
          setSupermercados((prev) => ({ ...prev, activated: value }));
          break;
        default:
          break;
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
          setConfiguration({
            ...configuration,
            metric: e.target.value,
            condition: "",
          })
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
      <Switch
        isChecked={configuration.visible.building}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            visible: { ...configuration.visible, building: e.target.checked },
          })
        }
      />
      Edificios Actuales
      <br />
      <Switch
        isChecked={configuration.visible.potential_building}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            visible: { ...configuration.visible, potential_building: e.target.checked },
          })
        }
      />
      Potencial Edificios
      <br />
      <Switch
        isChecked={configuration.visible.parking}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            visible: { ...configuration.visible, parking: e.target.checked },
          })
        }
      />
      Estacionamientos
      <br />
      <Switch
        isChecked={configuration.visible.park}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            visible: { ...configuration.visible, park: e.target.checked },
          })
        }
      />
      Parques
      <br />
      <Switch
        isChecked={configuration.visible.green}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            visible: { ...configuration.visible, green: e.target.checked },
          })
        }
      />
      Áreas Vegetación
      <br />
      <Switch
        isChecked={configuration.visible.equipment}
        onChange={(e) =>
          setConfiguration({
            ...configuration,
            visible: { ...configuration.visible, equipment: e.target.checked },
          })
        }
      />
      Equipamientos
      <br />
      <Switch
        isChecked={configuration.isSatellite}
        onChange={(e) =>
          setConfiguration({ ...configuration, isSatellite: e.target.checked })
        }
      />
      Vista Satelital
    </Box>
  );
};

export default ConfigurationToolbar;
