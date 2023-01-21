import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

function Section({ className, ...props }) {
    const section = useRef();
    useEffect(() => {
        const update = (e) => section.current && (section.current.style.height = visualViewport.height + "px");
        visualViewport.addEventListener("resize", update);
        visualViewport.addEventListener("scroll", update);
        update();
    }, []);
    return (
        <section className={classNames("section", className)} ref={section} {...props}></section>
    );
}

export default Section;