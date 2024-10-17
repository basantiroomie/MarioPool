import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import csv from 'csv-parser'; // Import csv-parser

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for /save-csv (your CSV saving logic)
app.post('/save-csv', (req, res) => {
  const { fullName, email, car, age, gender, password, flatNumber, homeAddress, pincode, company, lat, lon, companyLat, companyLon } = req.body;

  const csvFilePath = path.join(__dirname, 'form_data.csv');
  
  // Define headers
  const headers = 'Full Name,Email,Car,Age,Gender,Password,Flat Number,Home Address,Pincode,Company,Lat,Lon,Company Lat,Company Lon\n';
  
  // CSV row data
  const csvRow = `${fullName},${email},${car},${age},${gender},${password},${flatNumber},${homeAddress},${pincode},${company},${lat},${lon},${companyLat},${companyLon}\n`;

  // Check if the file exists
  if (!fs.existsSync(csvFilePath)) {
    // Write headers to the file if it doesn't exist
    fs.writeFile(csvFilePath, headers, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing headers to CSV' });
      }
      // After writing headers, append the row data
      fs.appendFile(csvFilePath, csvRow, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving CSV' });
        }
        res.json({ message: 'Data saved successfully with headers' });
      });
    });
  } else {
    // If file exists, append the row data only
    fs.appendFile(csvFilePath, csvRow, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving CSV' });
      }
      res.json({ message: 'Data saved successfully' });
    });
  }
});

// Route to get form data from CSV file
app.get('/get-form-data', (req, res) => {
  const results = [];
  const csvFilePath = path.join(__dirname, 'form_data.csv');

  fs.createReadStream(csvFilePath)
    .pipe(csv()) // Use csv-parser to parse the CSV file
    .on('data', (data) => results.push(data)) // Push each row of data to results
    .on('end', () => {
      res.json(results); // Send results as JSON
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
