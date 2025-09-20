// const fetch = require('node-fetch');

// async function testSerialAPI() {
//   const baseUrl = 'http://localhost:3001/v1/api/arduino';
  
//   console.log('🔍 Testing Serial Monitor API...\n');
  
//   try {
//     // Test 1: Get connected ports
//     console.log('1️⃣ Testing connected ports...');
//     const connectedResponse = await fetch(`${baseUrl}/serial/connected`);
//     const connectedData = await connectedResponse.json();
//     console.log('✅ Connected ports response:', connectedData);
    
//     if (connectedData.success && connectedData.ports.length > 0) {
//       const port = connectedData.ports[0];
//       console.log(`📡 Found connected port: ${port}\n`);
      
//       // Test 2: Get serial data
//       console.log('2️⃣ Testing serial data...');
//       const dataResponse = await fetch(`${baseUrl}/serial/data/${encodeURIComponent(port)}`);
//       const dataData = await dataResponse.json();
//       console.log('✅ Serial data response:');
//       console.log(`   Success: ${dataData.success}`);
//       console.log(`   Data length: ${dataData.data ? dataData.data.length : 0}`);
      
//       if (dataData.success && dataData.data.length > 0) {
//         console.log('📊 Sample data:');
//         dataData.data.slice(-5).forEach((item, index) => {
//           console.log(`   ${index + 1}. ${item}`);
//         });
//       }
//     } else {
//       console.log('❌ No connected ports found');
//     }
    
//   } catch (error) {
//     console.error('❌ Error testing API:', error.message);
//   }
// }

// // Run the test
// testSerialAPI(); 