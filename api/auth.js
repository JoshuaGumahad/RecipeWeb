import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const PHP_API_URL = 'http://192.168.0.108/recipewebv3/api/aut.php'; // Update this URL to match your PHP server

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error parsing form data' });
      }

      const formData = new FormData();
      for (const key in fields) {
        formData.append(key, fields[key]);
      }

      if (files.profile_image) {
        const file = files.profile_image;
        formData.append('profile_image', fs.createReadStream(file.path), file.name);
      }

      try {
        const response = await axios.post(PHP_API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        res.status(200).json(response.data);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}