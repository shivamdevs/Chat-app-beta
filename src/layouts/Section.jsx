import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

function Section({ className, desktopview = false, splitted = false, ...props }) {
    const section = useRef();
    useEffect(() => {
        const update = (e) => section.current && (section.current.style.height = visualViewport.height + "px");
        visualViewport.addEventListener("resize", update);
        visualViewport.addEventListener("scroll", update);
        update();
    }, []);
    if (desktopview) {
        if (splitted) {
            return (
                <>{props.children}</>
            );
        } else {
            return (
                <div className="sectionview"><section className={classNames("section", className)} {...props}></section></div>
            );
        }
    }
    return (
        <section className={classNames("section", className)} ref={section} {...props}></section>
    );
}

export function SplitSection({ className, desktopview = false, children, ...props }) {
    const section = useRef();
    useEffect(() => {
        const update = (e) => section.current && (section.current.style.height = visualViewport.height + "px");
        visualViewport.addEventListener("resize", update);
        visualViewport.addEventListener("scroll", update);
        update();
    }, []);
    if (desktopview) {
        return (
            <div className="sectionview splitsection">
                <section className="section">
                    <div className={classNames("sectioning sectioning-l", className)} {...props}>{children[0]}</div>
                    <div className={classNames("sectioning sectioning-r", className)} {...props}>{children[1]}</div>
                </section>
            </div>
        );
    }
    return (
        <section className={classNames("section", className)} ref={section} {...props}>{children}</section>
    );
}

export default Section;