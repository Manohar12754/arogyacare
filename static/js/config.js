/**
 * ArogyaCare Runtime API Configuration Engine
 * Configures production HTTPS API target URL with local fallback.
 */
(function() {
  window.AROGYACARE_CONFIG = {
    // When backend is deployed to HTTPS production (Render/AWS/Railway),
    // override PRODUCTION_API_URL below or inject window.AROGYACARE_CUSTOM_API_URL.
    PRODUCTION_API_URL: window.AROGYACARE_CUSTOM_API_URL || '',

    getApiUrl: function(endpoint) {
      const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
      if (this.PRODUCTION_API_URL) {
        return this.PRODUCTION_API_URL.replace(/\/+$/, '') + path;
      }
      return path;
    }
  };
})();
