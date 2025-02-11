import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useState } from "react";
import {
    Box,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Tooltip,
} from "@chakra-ui/react";
import { setRadius } from "../../features/lensSettings/lensSettingsSlice";

export const LensRadius = () => {
    const dispatch: AppDispatch = useDispatch();
    const [showTooltip, setShowTooltip] = useState(false);
    const radius = useSelector((state: RootState) => state.lensSettings.radius);
    return (
        <Tooltip
            hasArrow
            placement="right"
            label="Radio de exploración"
            bg="gray.700"
            borderRadius="min(0.6dvh, 0.3dvw)"
            fontSize="min(2dvh, 1dvw)"
        >
            <Box
                style={{
                    margin: "auto",
                    marginLeft: "1.4dvw",
                    marginRight: "1.4dvw",
                    width: "10dvw",
                    height: "2dvw",
                    borderRadius: "0.4dvw",
                    opacity: 0.95,
                    paddingLeft: "0.5dvw",
                    paddingRight: "0.5dvw",
                    backgroundColor: "var(--primary-dark)",
                    alignContent: "center",
                }}
            >
                <Slider
                    aria-label="slider-ex-1"
                    size="sm"
                    width="100%"
                    min={200}
                    max={1000}
                    step={100}
                    defaultValue={500}
                    colorScheme="cyan"
                    value={radius}
                    onChange={(val) => dispatch(setRadius(val))}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    style={{ display: "block", minWidth: "auto" }}
                >
                    <SliderTrack style={{ height: "0.3dvw" }}>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        bg="gray.600"
                        color="white"
                        placement="top"
                        mt="1"
                        borderRadius="min(0.6dvh, 0.3dvw)"
                        fontSize="min(2dvh, 1dvw)"
                        isOpen={showTooltip}
                        label={`${radius} metros`}
                    >
                        <SliderThumb height="1dvw" width="1dvw" />
                    </Tooltip>
                </Slider>
            </Box>
        </Tooltip>
    );
};
