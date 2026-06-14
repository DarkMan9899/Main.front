export const track = (event, params = {}) => {
    if (!window.gtag) return;

    window.gtag("event", event, params);
};

