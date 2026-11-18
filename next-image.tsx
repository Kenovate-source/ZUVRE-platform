import React from "react";
export default function Image(props: any) { const { src, width, height, alt, className, style, sizes, priority, fill, ...rest } = props; return <img src={src} width={width} height={height} alt={alt} className={className} style={style} sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" {...rest} />; }
