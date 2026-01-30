require('dotenv').config();
const mongoose = require('mongoose');
const QRCode = require('../models/QRCode.model');
const fs = require('fs');
const path = require('path');
const QRCodeLib = require('qrcode');

const generatePrintableQRs = async () => {
  try {
    // Connect to database
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create output directory
    const outputDir = path.join(__dirname, '../printable_qrs');
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    // 1. Find the most recent ENTRY QR Code
    const entryQR = await QRCode.findOne({ type: 'entry', status: 'active' }).sort({ createdAt: -1 });
    
    if (entryQR) {
        console.log('\nFOUND ENTRY QR:');
        console.log(`Token: ${entryQR.token}`);
        
        // Generate image file with a clear name
        const filePath = path.join(outputDir, 'ENTRY_SCAN_ME.png');
        await QRCodeLib.toFile(filePath, entryQR.token, {
            errorCorrectionLevel: 'H',
            width: 600,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        console.log(`✅ Saved printable image to: printable_qrs/ENTRY_SCAN_ME.png`);
    } else {
        console.log('❌ No Active Entry QR found. Please run "npm run setup" first.');
    }

    // 2. Find the most recent EXIT QR Code
    const exitQR = await QRCode.findOne({ type: 'exit', status: 'active' }).sort({ createdAt: -1 });
    
    if (exitQR) {
        console.log('\nFOUND EXIT QR:');
        console.log(`Token: ${exitQR.token}`);
        
        // Generate image file with a clear name
        const filePath = path.join(outputDir, 'EXIT_SCAN_ME.png');
        await QRCodeLib.toFile(filePath, exitQR.token, {
            errorCorrectionLevel: 'H',
            width: 600,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        console.log(`✅ Saved printable image to: printable_qrs/EXIT_SCAN_ME.png`);
    } else {
        console.log('❌ No Active Exit QR found. Please run "npm run setup" first.');
    }

    console.log('\n🎉 Done! You can now print the images in the "printable_qrs" folder.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

generatePrintableQRs();
