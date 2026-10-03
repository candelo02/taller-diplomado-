const dotenv = require('dotenv');
dotenv.config();

const defaultFlags = {
  // Flag 1: Pedidos en Línea y Carrito de Compras
  online_ordering_enabled: process.env.FEATURE_ONLINE_ORDERING === 'false' ? false : true,

  // Flag 2: Módulo de Reserva de Mesas
  table_reservation_enabled: process.env.FEATURE_TABLE_RESERVATION === 'false' ? false : true,

  // Flag 3: Banner de Promociones y Recomendados del Chef
  promotions_banner_enabled: process.env.FEATURE_PROMOTIONS_BANNER === 'false' ? false : true
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
