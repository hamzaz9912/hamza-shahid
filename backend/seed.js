const mongoose = require('mongoose');
require('dotenv').config();
const Trip = require('./models/Trip');
const Party = require('./models/Party');
const Broker = require('./models/Broker');
const Payment = require('./models/Payment');
const User = require('./models/User');

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
    await User.deleteMany({});
    await Trip.deleteMany({});
    await Party.deleteMany({});
    await Broker.deleteMany({});
    await Payment.deleteMany({});

    // Seed users
    const adminUser = new User({
      username: 'admin',
      password: 'admin123',
      role: 'Admin',
      permissions: {
        canEditTrips: true,
        canDeleteTrips: true,
        canManageParties: true,
        canManageBrokers: true,
        canManageOwners: true,
        canViewReports: true
      }
    });
    await adminUser.save();

    const staffUser = new User({
      username: 'staff',
      password: 'staff123',
      role: 'Staff',
      permissions: {
        canEditTrips: false,
        canDeleteTrips: false,
        canManageParties: false,
        canManageBrokers: false,
        canManageOwners: false,
        canViewReports: false
      }
    });
    await staffUser.save();

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
      {
        serialNumber: 1003,
        driverNumber: 'D-101',
        date: '2023-10-28',
        vehicleNumber: 'TR-54321',
        vehicleSize: '30ft',
        weight: 20,
        freight: 95000,
        officeFare: 4000,
        vehicleReceivedBilty: 90000,
        vehicleFare: 85000,
        laborCharges: 1800,
        exciseCharges: 1200,
        bonus: 800,
        miscExpenses: 400,
        dailyWages: 700,
        extraWeight: 1.5,
        partyBalance: 8000,
        partyReceived: 90000,
        brokerageCommission: 4275,
        vehicleBalance: 3000,
        vehicleAccount: 'AC-V3',
        additionalDetails: 'Fragile items',
        station: 'North Hub',
        brokerName: 'Al-Fatah Goods Carrier',
        partyName: 'Global Exports Inc.',
        mt: 20,
      },
      {
        serialNumber: 1004,
        driverNumber: 'D-202',
        date: '2023-10-29',
        vehicleNumber: 'TR-09876',
        vehicleSize: '40ft',
        weight: 28,
        freight: 135000,
        officeFare: 5500,
        vehicleReceivedBilty: 125000,
        vehicleFare: 115000,
        laborCharges: 2200,
        exciseCharges: 1600,
        bonus: 1200,
        miscExpenses: 600,
        dailyWages: 900,
        extraWeight: 2.5,
        partyBalance: 12000,
        partyReceived: 125000,
        brokerageCommission: 6075,
        vehicleBalance: 6000,
        vehicleAccount: 'AC-V4',
        additionalDetails: 'Heavy machinery',
        station: 'South Terminal',
        brokerName: 'Madina Cargo Services',
        partyName: 'Local Goods Co.',
        mt: 28,
      },
      {
        serialNumber: 1005,
        driverNumber: 'D-303',
        date: '2023-10-30',
        vehicleNumber: 'TR-13579',
        vehicleSize: '20ft',
        weight: 12,
        freight: 65000,
        officeFare: 2500,
        vehicleReceivedBilty: 60000,
        vehicleFare: 55000,
        laborCharges: 1200,
        exciseCharges: 800,
        bonus: 400,
        miscExpenses: 200,
        dailyWages: 600,
        extraWeight: 0.5,
        partyBalance: 4000,
        partyReceived: 60000,
        brokerageCommission: 2925,
        vehicleBalance: 1500,
        vehicleAccount: 'AC-V5',
        additionalDetails: 'Perishable goods',
        station: 'North Hub',
        brokerName: 'Al-Fatah Goods Carrier',
        partyName: 'One-Time Shipment',
        mt: 12,
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