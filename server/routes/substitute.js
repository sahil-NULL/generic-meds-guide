const express = require('express')
const mongoose = require('mongoose')
const Medicine = require('../models/medicine.js')

const router = express.Router()


// Get medicine substitutes from name
router.get('/name', async (req, res) => {
    try {
        // Get the medicine name from the URL
        const { name, type } = req.query

        // Find the medicine
        const doc = await Medicine.findOne({name: name})

        // Validate the document
        if(doc === null) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            })
        }

        // Get the salt composition
        const id = doc._id
        const composition = doc.composition

        // Get the required information from the database
        const result = await Medicine.find({_id: { $ne: id }, composition: composition, type: type})

        // Send the correct response
        return res.status(200).json({
            success: true,
            data: result
        })
    }

    catch {
        // Handle other errors
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
})


// Get medicine substitutes from composition
router.get('/composition', async (req, res) => {
    try {
        // Get composition from the URL
        const { composition } = req.query 
        
        // Get required information from the database
        const result = await Medicine.find({composition: composition})

        // Send the correct response
        return res.status(200).json({
            success: true,
            data: result
        })
    }
    
    catch {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
})


module.exports = router