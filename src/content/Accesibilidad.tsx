import React, { useState } from "react";
import { AccessibilityToolbar } from "../components";
import { GenericObject } from "../types";
import { SelectAutoComplete } from "../components";


const Accesibilidad = ()=> {

    const [configuration, setConfiguration] = useState<GenericObject>({
        condition: undefined,
        metric: "POBTOT",
        isSatellite: false,
        visible: {
          parking: true,
          building: true,
          potential_building: true,
          park: true,
          green: false,
          equipment: true,
        },
        accessibility_info: {
          // Initialize this with default values for proximity settings
          proximity_small_park: 2,
          proximity_salud: 2,
          proximity_educacion: 1,
          proximity_servicios: 5,
          proximity_supermercado: 1,
        },
      });

    return (
        <div>
            <AccessibilityToolbar configuration={configuration}></AccessibilityToolbar>
            <SelectAutoComplete />
        </div>
    )
}

export default Accesibilidad;
