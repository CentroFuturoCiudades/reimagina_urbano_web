import type { PointFeature, ClusterFeature } from "supercluster";
import { CompositeLayer } from "@deck.gl/core";
import { IconLayer, IconLayerProps, TextLayer } from "@deck.gl/layers";
import Supercluster from "supercluster";

interface IconClusterLayerProps<DataT> extends IconLayerProps<DataT> {
    onClick?: (info: any) => void;
    sizeScale?: number;
}

export class IconClusterLayer<
    DataT extends { [key: string]: any } = any,
    ExtraProps extends {} = {}
> extends CompositeLayer<IconClusterLayerProps<DataT> & ExtraProps> {
    state!: {
        data: (PointFeature<DataT> | ClusterFeature<DataT>)[];
        index: Supercluster<DataT, DataT>;
        z: number;
    };

    shouldUpdateState({ changeFlags }: any) {
        return changeFlags.somethingChanged;
    }

    updateState({ props, oldProps, changeFlags }: any) {
        const rebuildIndex =
            changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

        if (rebuildIndex) {
            const index = new Supercluster<DataT, DataT>({
                maxZoom: props.maxZoom,
                radius: props.sizeScale * props.clusteringSize * Math.sqrt(2),
            });
            index.load(
                // @ts-ignore Supercluster expects proper GeoJSON feature
                (props.data as DataT[]).map((d) => ({
                    geometry: {
                        coordinates: (props.getPosition as Function)(d),
                    },
                    properties: d,
                }))
            );
            this.setState({ index });
        }

        const z = Math.floor(this.context.viewport.zoom);
        if (rebuildIndex || z !== this.state.z) {
            this.setState({
                data: this.state.index.getClusters([-180, -85, 180, 85], z),
                z,
            });
        }
    }

    getPickingInfo({ info, mode }: { info: any; mode: string }): any {
        const pickedObject = info.object?.properties;
        if (pickedObject) {
            let objects: DataT[] | undefined;
            if (pickedObject.cluster && mode !== "hover") {
                objects = this.state.index
                    .getLeaves(pickedObject.cluster_id, 25)
                    .map((f: any) => f.properties);
            }
            const result = { ...info, object: pickedObject, objects };

            // Call the onClick handler if it exists and we're in click mode
            if (mode === 'click' && this.props.onClick) {
                this.props.onClick(result);
            }

            return result;
        }
        return { ...info, object: undefined };
    }

    renderLayers() {
        const { data } = this.state;
        const { iconAtlas, iconMapping, sizeScale, getColor, updateTriggers } =
            this.props as any;

        // Icon Layer for clusters
        const iconLayer = new IconLayer<
            PointFeature<DataT> | ClusterFeature<DataT>
        >(
            this.getSubLayerProps({
                id: "icon",
            }) as any,
            {
                data,
                iconAtlas,
                iconMapping,
                sizeScale,
                getColor: getColor as any,
                updateTriggers,
                getPosition: (d: any) =>
                    d.geometry.coordinates as [number, number],
                getIcon: (d) => "marker-1",
                getSize: (d: any) => (d.properties.cluster ? 1.4 : 1),
            }
        );

        // Text Layer for cluster counts
        const textLayer = new TextLayer({
            id: "text-layer",
            data,
            getPosition: (d: any) => d.geometry.coordinates as [number, number],
            getText: (d: any) =>
                d.properties.cluster ? `${d.properties.point_count}` : "",
            getSize: (d: any) => (d.properties.cluster ? 14 : 10),
            getPixelOffset: (d: any) =>
                d.properties.cluster ? [0, -18] : [0, -14],
            getColor: [255, 255, 255, 255],
            fontWeight: "bold",
            fontFamily: "Arial",
            getTextAnchor: "middle",
            getAlignmentBaseline: "center",
        });

        return [iconLayer, textLayer];
    }
}
