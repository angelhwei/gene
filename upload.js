const express = require('express')
const multer = require('multer')
const fs = require('fs')
const app = express()
const upload = multer({ dest: 'uploads/' })
const path = require('path')

app.post('/upload', upload.single('file'), (req, res) => {
    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.sendStatus(500)
        }

        // Here you would implement the logic to convert the text data to JSON
        let jsonData = convertToJSON(data)

        res.json(jsonData)
    })
})
function convertToJSON(data) {
    // Convert the text data to a JSON array
    let jsonArray = JSON.parse(data);

    // Add a 'title' attribute to each item in the array
    jsonArray = jsonArray.map(item => {
        item.title = "New Title";
        return item;
    });

    return jsonArray;
}
// Serve static files from the "public" directory
app.use(express.static('public'))
app.listen(3000, () => console.log('Server started on port 3000'))
