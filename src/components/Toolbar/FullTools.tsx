import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Select } from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { AppDispatch, RootState } from "../../app/store";
import {
    clearSelectedColonias,
    setProject,
} from "../../features/viewMode/viewModeSlice";
import { REGIONS } from "../../constants";

export const FullSelect = () => {
    const dispatch: AppDispatch = useDispatch();
    const project = useSelector((state: RootState) => state.viewMode.project);

    return (
        <Box
            color="white"
            style={{
                position: "absolute",
                zIndex: 1000,
                width: "150px",
                top: "20px",
                left: "calc(50% + 245px)",
            }}
        >
            <Select
                id="toolbar-select-region"
                variant="outline"
                size="sm"
                icon={<MdArrowDropDown />}
                value={project}
                onChange={(e) => {
                    dispatch(clearSelectedColonias());
                    dispatch(setProject(e.target.value));
                }}
                style={{
                    backgroundColor: "var(--primary-dark)",
                    border: "0px",
                    borderRadius: "5px",
                    opacity: 0.95,
                }}
            >
                {REGIONS.map((region) => (
                    <option key={region.key} value={region.key}>
                        {region.name}
                    </option>
                ))}
            </Select>
        </Box>
    );
};
