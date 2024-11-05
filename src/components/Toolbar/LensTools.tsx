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
            fontSize="14px"
        >
            <Box
                style={{
                    position: "relative",
                    zIndex: 1000,
                    width: "150px",
                    top: "20px",
                    left: "calc(50% + 245px)",
                    height: "30px",
                    borderRadius: "5px",
                    color: "white",
                    opacity: 0.95,
                    backgroundColor: "var(--primary-dark)",
                }}
                px="3"
                py="1"
            >
                <Slider
                    aria-label="slider-ex-1"
                    min={200}
                    max={1000}
                    step={100}
                    defaultValue={500}
                    colorScheme="cyan"
                    value={radius}
                    onChange={(val) => dispatch(setRadius(val))}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        bg="gray.600"
                        color="white"
                        placement="top"
                        mt="1"
                        borderRadius="4px"
                        isOpen={showTooltip}
                        label={`${radius} metros`}
                    >
                        <SliderThumb />
                    </Tooltip>
                </Slider>
            </Box>
        </Tooltip>
    );
};
