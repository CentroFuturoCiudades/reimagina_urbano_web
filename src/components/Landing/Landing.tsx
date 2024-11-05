import React, { useRef, useState, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { MainSidebar, BaseMap } from "../";
import Toolbar from "../Toolbar";
import "intro.js/introjs.css";

import "./Landing.scss";
import { setProject } from "../../features/viewMode/viewModeSlice";
import { useDispatch } from "react-redux";
import { SectionTitle } from "./SectionTitle";
import { SectionDescriptions } from "./SectionDescriptions";

const Landing: React.FC = () => {
    const dispatch = useDispatch();
    const hash = window.location.hash;
    const isProject = hash === "#culiacan_sur" || hash === "#culiacan_centro";
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [calculatedOpacity, setCalculatedOpacity] = useState(1);
    const [activateLanding, setActivateLanding] = useState(!isProject);

    const handleScroll = () => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            const scrollPosition = scrollContainer.scrollTop;
            const scrollHeight = scrollContainer.clientHeight;
            const scrollPercentageCalc = scrollPosition / scrollHeight;

            if (scrollPercentageCalc > 0 && scrollPercentageCalc > 1) {
                const opacity = 2 - scrollPercentageCalc;
                setCalculatedOpacity(opacity > 0.95 ? 1 : opacity);
            } else {
                setCalculatedOpacity(1);
            }
        }
    };

    const handleActivateLanding = () => {
        setCalculatedOpacity(0.1);
        setActivateLanding(true);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top:
                    scrollContainerRef.current.scrollTop -
                    scrollContainerRef.current.clientHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (calculatedOpacity <= 0) {
            dispatch(setProject("culiacan_sur"));
            setActivateLanding(false);
        }
    }, [calculatedOpacity]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        // Function to scroll to the element based on the hash
        const scrollToHashElement = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "instant" });
                }
            }
        };

        scrollToHashElement();

        window.addEventListener("hashchange", scrollToHashElement);

        return () => {
            window.removeEventListener("hashchange", scrollToHashElement);
        };
    }, []);

    return (
        <>
            <Box ref={scrollContainerRef} h="100vh" overflowY="scroll">
                <VStack gap={0}>
                    {activateLanding && (
                        <>
                            <SectionTitle />
                            <SectionDescriptions
                                calcOpacity={calculatedOpacity}
                            />
                        </>
                    )}

                    {!activateLanding && (
                        <>
                            <BaseMap />
                            <Box
                                position={"absolute"}
                                left={0}
                                height={"100vh"}
                                width={"auto"}
                                display={"flex"}
                                justifyContent={"space-between"}
                            >
                                <MainSidebar />
                                <Toolbar
                                    handleActivateLanding={
                                        handleActivateLanding
                                    }
                                />
                            </Box>
                        </>
                    )}
                </VStack>
            </Box>
        </>
    );
};

export default Landing;
