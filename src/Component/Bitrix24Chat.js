// src/components/Bitrix24Chat.js
import { useEffect } from 'react';

const Bitrix24Chat = () => {
    useEffect(() => {
        // Bitrix24 Live Chat
        (function(w, d, u) {
            var s = d.createElement('script');
            s.async = true;
            s.src = u + '?' + (Date.now() / 60000 | 0);
            var h = d.getElementsByTagName('script')[0];
            h.parentNode.insertBefore(s, h);
        })(window, document, 'https://cdn-ru.bitrix24.ru/b27587194/crm/site_button/loader_3_y38pa0.js');

        // Cleanup function
        return () => {
            // Հեռացնել script-ը երբ component-ը unmount լինի
            const scripts = document.querySelectorAll('script[src*="bitrix24"]');
            scripts.forEach(script => script.remove());

            // Հեռացնել Bitrix24 widget-ը DOM-ից
            const widget = document.querySelector('#bx-composite-loader, [class*="bx-livechat"], [class*="b24-widget"]');
            if (widget) widget.remove();
        };
    }, []);

    return null; // Այս component-ը ոչինչ չի render անում
};

export default Bitrix24Chat;