import React from 'react';
import Section from './Section';

function Invalid({back = null}) {
    return (
        <Section className="transparent">
            <main className="mainbody">
                <div className="tstitle">Invalid token</div>
                <div className="tsbody">This URL is invalid or has expired.</div>
                <div className="tsoptions">
                    <button className="tsbutton" type="button" onClick={back}>Go back</button>
                </div>
            </main>
        </Section>
    );
};

export default Invalid;











