const mongoose = require('mongoose');
require('dotenv').config();
const Trip = require('./models/Trip');
const Party = require('./models/Party');
const Broker = require('./models/Broker');
const Payment = require('./models/Payment');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await Trip.deleteMany({});
    await Party.deleteMany({});
    await Broker.deleteMany({});
    await Payment.deleteMany({});

    // Seed parties
    const parties = await Party.insertMany([
      { name: 'Global Exports Inc.', type: 'Regular', contact: '555-1234', address: '123 Export Lane', outstandingBalance: 150000 },
      { name: 'Local Goods Co.', type: 'Regular', contact: '555-5678', address: '456 Market St', outstandingBalance: 75000 },
      { name: 'One-Time Shipment', type: 'One-time', contact: '555-8765', address: '789 Warehouse Ave', outstandingBalance: 0 },
    ]);

    // Seed brokers
    const brokers = await Broker.insertMany([
      { name: 'Al-Fatah Goods Carrier', commission: 5, contact: '0300-1234567', station: 'North Hub' },
      { name: 'Madina Cargo Services', commission: 4.5, contact: '0321-7654321', station: 'South Terminal' },
    ]);

    // Seed trips
    await Trip.insertMany([
      {
        serialNumber: 1001,
        driverNumber: 'D-456',
        date: '2023-10-26',
        vehicleNumber: 'TR-12345',
        vehicleSize: '40ft',
        weight: 25,
        freight: 120000,
        officeFare: 5000,
        vehicleReceivedBilty: 110000,
        vehicleFare: 100000,
        laborCharges: 2000,
        exciseCharges: 1500,
        bonus: 1000,
        miscExpenses: 500,
        dailyWages: 800,
        extraWeight: 2,
        partyBalance: 10000,
        partyReceived: 110000,
        brokerageCommission: 5500,
        vehicleBalance: 5000,
        vehicleAccount: 'AC-V1',
        additionalDetails: 'Handle with care',
        station: 'North Hub',
        brokerName: 'Al-Fatah Goods Carrier',
        partyName: 'Global Exports Inc.',
        mt: 25,
      },
      {
        serialNumber: 1002,
        driverNumber: 'D-789',
        date: '2023-10-27',
        vehicleNumber: 'TR-67890',
        vehicleSize: '20ft',
        weight: 15,
        freight: 80000,
        officeFare: 3000,
        vehicleReceivedBilty: 75000,
        vehicleFare: 70000,
        laborCharges: 1500,
        exciseCharges: 1000,
        bonus: 500,
        miscExpenses: 300,
        dailyWages: 800,
        extraWeight: 1,
        partyBalance: 5000,
        partyReceived: 75000,
        brokerageCommission: 3375,
        vehicleBalance: 2000,
        vehicleAccount: 'AC-V2',
        additionalDetails: 'Urgent delivery',
        station: 'South Terminal',
        brokerName: 'Madina Cargo Services',
        partyName: 'Local Goods Co.',
        mt: 15,
      },
    ]);

    // Seed payments
    await Payment.insertMany([
      {
        date: '2023-10-28',
        type: 'paid',
        entityType: 'broker',
        entityName: 'Al-Fatah Goods Carrier',
        amount: 2500,
        description: 'Partial payment for commission',
        reference: 'Trip #1001'
      },
      {
        date: '2023-10-29',
        type: 'received',
        entityType: 'party',
        entityName: 'Global Exports Inc.',
        amount: 50000,
        description: 'Partial payment for freight',
        reference: 'Trip #1001'
      },
    ]);

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  seedData();
});