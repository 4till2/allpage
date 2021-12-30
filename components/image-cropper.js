import React, {useCallback, useState} from 'react';
import Cropper from 'react-easy-crop';
import SaveOrCancelButtons from "./save-or-cancel-buttons";
import {useCanvasImage} from "../hooks/use-canvas-image";


export default function ImageCropper({
                                         visible,
                                         img,
                                         onCrop,
                                         onClose,
                                         onCancel,
                                         aspectRatio
                                     }) {
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const {getImage} = useCanvasImage();

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        const croppedImage = await getImage(
            img,
            croppedAreaPixels,
            rotation
        );
        onCrop(croppedImage);
        onClose();
    }, [croppedAreaPixels, rotation]);

    if (!visible || !img) {
        return <></>;
    }
    return (
        // <Modal isOpen={visible} onExit={onClose}>
        <div className={"h-80 w-80 absolute z-10 bg-black content-between text-ellipsis"}>
            <div className={"w-80 h-80 "}>
                <Cropper
                    image={img}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={aspectRatio || 1 / 1}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    // cropSize={{width: '20rem', height: '20rem'}}
                    objectFit={'horizontal-cover'}
                />
            </div>
            <SaveOrCancelButtons className={" bottom-0 z-30"} onSave={(e) => {
                e.preventDefault();
                showCroppedImage()
            }} onCancel={onCancel}></SaveOrCancelButtons>
        </div>
        // </Modal>
    );
};
