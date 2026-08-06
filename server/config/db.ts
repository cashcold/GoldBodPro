import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://capital:mangement12345@capgainco.o3hgd.mongodb.net/?retryWrites=true&w=majority&appName=Capgainco';
  
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB Database successfully.');
      return true;
    } catch (err) {
      console.warn('⚠️ MongoDB connection attempt failed. Running in resilient store mode:', err);
      return false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI detected. GoldBod Pro running in high-performance Memory Data Store mode.');
    return false;
  }
}
