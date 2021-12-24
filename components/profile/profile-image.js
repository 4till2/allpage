import React from "react";

export default function ProfileImage({src, colors, className}) {
    let backgroundStyle = (src) ?
        {backgroundImage: `url(${src})`} :
        {background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`};
    return (
        <div style={backgroundStyle} className={`w-full h-full no-repeat bg-cover rounded-tl-none ${className}`}/>
    )
}
