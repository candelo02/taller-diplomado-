const dotenv = require('dotenv');
dotenv.config();

// Módulos siempre activos por defecto
const defaultFlags = {
  online_ordering_enabled: true,
  table_reservation_enabled: true,
  promotions_banner_enabled: true
};

class FeatureFlagService {
  constructor(flags = defaultFlags) {
    this.flags = { ...flags };
  }

  setFlag(flagName, value) {
    this.flags[flagName] = value;
  }

  getFlags() {
    return { ...this.flags };
  }

  isOnlineOrderingEnabled() {
    return Boolean(this.flags.online_ordering_enabled);
  }

  isTableReservationEnabled() {
    return Boolean(this.flags.table_reservation_enabled);
  }

  isPromotionsBannerEnabled() {
    return Boolean(this.flags.promotions_banner_enabled);
  }

  evaluate() {
    return {
      online_ordering_enabled: this.isOnlineOrderingEnabled(),
      table_reservation_enabled: this.isTableReservationEnabled(),
      promotions_banner_enabled: this.isPromotionsBannerEnabled(),
      raw_flags: this.flags
    };
  }
}

const instance = new FeatureFlagService();

module.exports = {
  featureFlagService: instance,
  FeatureFlagService
};
