(function initializeMarketingTags() {
    const config = window.PERCENTAGE_CALC_CONFIG || {};
    const analyticsId = config.googleAnalyticsId;
    const adsenseClientId = config.adsenseClientId;

    if (analyticsId && /^G-[A-Z0-9]+$/i.test(analyticsId)) {
        const analyticsScript = document.createElement("script");
        analyticsScript.async = true;
        analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
        document.head.appendChild(analyticsScript);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", analyticsId);
    }

    if (adsenseClientId && /^ca-pub-\d+$/i.test(adsenseClientId)) {
        const adsenseScript = document.createElement("script");
        adsenseScript.async = true;
        adsenseScript.crossOrigin = "anonymous";
        adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`;
        document.head.appendChild(adsenseScript);
    }
})();
