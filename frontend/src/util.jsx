import React from "react";

export const buttonStyle = {
    border: '4px solid white',
    borderRadius: '10px',
    padding: '2px 5px',
    fontFamily: "Comic Sans MS, Comic Sans, cursive",
    color: 'white',
    fontWeight: 600,
    background: 'transparent',
    cursor: 'pointer'
};

export const getUserEmoji = (name) => {
    const min = 129408;
    const max = 129431;
    const rand = simpleHash(name);
    const val = rand % (max - min + 1) + min;
    return (
        <span
            dangerouslySetInnerHTML={{
                __html: "&#" + val + ";"
            }}
        />
    );
}

// from: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
const simpleHash = str => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return Math.ceil(hash / 3);
};