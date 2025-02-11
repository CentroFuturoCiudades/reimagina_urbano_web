import { useDispatch, useSelector } from "react-redux";
import { Box, Select } from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { AppDispatch, RootState } from "../../app/store";
import {
    clearSelectedColonias,
    setProject,
} from "../../features/viewMode/viewModeSlice";
import { REGIONS } from "../../constants";
import { IoCaretDownSharp } from "react-icons/io5";

export const FullSelect = () => {
    const dispatch: AppDispatch = useDispatch();
    const project = useSelector((state: RootState) => state.viewMode.project);

    return (
        <Box
            color="white"
            style={{
                margin: "auto",
                marginLeft: "1.4dvw",
                marginRight: "1.4dvw",
            }}
        >
            <Select
                id="toolbar-select-region"
                variant="outline"
                size="xs"
                icon={<IoCaretDownSharp fontSize="0.6dvw" />}
                value={project}
                onChange={(e) => {
                    dispatch(clearSelectedColonias());
                    dispatch(setProject(e.target.value));
                }}
                style={{
                    backgroundColor: "var(--primary-dark)",
                    border: "0px",
                    opacity: 0.95,
                    height: "2dvw",
                    width: "10dvw",
                    fontSize: "1dvw",
                    fontWeight: "500",
                    borderRadius: "0.4dvw",
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
