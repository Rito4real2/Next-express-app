import mongoose from 'mongoose';

const paymentSettingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['bank', 'crypto'],
      required: true,
      unique: true,
    },
    // Bank details
    bankName: { type: String, trim: true },
    accountHolderName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },

    // Crypto details
    walletAddress: { type: String, trim: true },
    network: { type: String, trim: true, default: 'TRC20' }, // e.g. TRC20, ERC20, BTC

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentSetting ||
  mongoose.model('PaymentSetting', paymentSettingSchema);