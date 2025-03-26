import { VStack, Box, Text, IconButton, Heading } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { formatNumber } from "../../constants";
import { ComparativeMetric } from "../ComparativeMetric";
import { clearSelectedAmenity } from "../../features/accessibilityList/accessibilityListSlice";
import { MdClose } from "react-icons/md";

const AmenitiesSidebar = () => {
  const dispatch = useDispatch();
  const amenity = useSelector((state: RootState) => state.accessibilityList.selectedAmenity);
  const mappingNames = {
    "amenity": { name: "Tipo de equipamiento", type: "string" },
    "control": { name: "Control", type: "string" },
    "num_students": { name: "Número de estudiantes", type: "number" },
    "num_teachers": { name: "Número de docentes", type: "number" },
    "pob_reach": { name: "Alcance potencial a pie", type: "number" },
    "num_workers": { name: "Número de trabajadores", type: "number" },
    "capacity": { name: "Capacidad", type: "number" },
    "area": { name: "Área", type: "number" },
    "source": { name: "Fuente", type: "string" },
    "num_visits": { name: "Número de visitas", type: "number" },
    "visits_category": { name: "Afluencia de visitantes", type: "string" },
    "furniture": { name: "Mobiliario", type: "string" },
    "park_type": { name: "Tipo de parque", type: "string" },
    "url": { name: "URL", type: "string" },
  }
  if (!amenity) return null;
  return (
    <div className="amenities-sidebar tab__main" style={{ overflowY: "auto", height: "100%" }}>
      <Box position="relative" width="100%" p="4" pb="2">
        <IconButton
          aria-label="Cerrar"
          icon={<MdClose />}
          size="sm"
          position="absolute"
          right="2"
          top="2"
          onClick={() => dispatch(clearSelectedAmenity())}
          variant="ghost"
          colorScheme="red"
          _hover={{ bg: 'red.100' }}
        />
        <Heading size="md" fontSize="min(2.8dvh, 1.4dvw)" mb="4">
          {amenity.name}
        </Heading>
      </Box>
      <VStack spacing={"0"} m="2">
        {Object.keys(amenity).filter((key) => mappingNames[key as keyof typeof mappingNames]).map((key) => (
          <ComparativeMetric
            name={mappingNames[key as keyof typeof mappingNames].name}
            disabled={true}
          >
            <Box fontSize="min(2.8dvh, 1.4dvw)">
              {mappingNames[key as keyof typeof mappingNames].type === "string" ? (
                <Text fontSize="min(2.4dvh, 1.2dvw)">{amenity[key as keyof typeof amenity]}</Text>
              ) : mappingNames[key as keyof typeof mappingNames].type === "percentage" ? (
                <Text fontSize="min(2.4dvh, 1.2dvw)">{formatNumber(amenity[key as keyof typeof amenity])}%</Text>
              ) : (
                <Text fontSize="min(2.4dvh, 1.2dvw)">{formatNumber(amenity[key as keyof typeof amenity])}</Text>
              )}
            </Box>
          </ComparativeMetric>
        ))}
      </VStack>
    </div>
  );
};

export default AmenitiesSidebar;