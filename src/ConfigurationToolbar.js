import {
  Box,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Tag,
} from "@chakra-ui/react";
import { COLUMN_MAPPING } from "./constants";

export const Toolbar = ({ configuration, setConfiguration }) => {
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
      Áreas Verdes
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
