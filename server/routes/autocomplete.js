const express = require("express")
const mongoose = require("mongoose")
const Medicine = require("../models/medicine.js")

const router = express.Router();


const helper = (req, res, next) => {
    // Get the keyword from the URL
    const { keyword } = req.query;

    // Validate the keyword
    if(!keyword || keyword.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Search keyword must have at least 3 letters"
        })
    }

    next()
}


router.use(helper)


// Handle medicine search
router.get("/name", async (req, res) => {
    try {
        // Get the required information from the database
        // const results = await Medicine.distinct('name', {
        //     name: {$regex: req.searchRegex}
        // },{ fullDocument: true })

        const results = await Medicine.aggregate([
            { $match: {
              name: { $regex: `${req.query.keyword}`, $options: 'i' }
            }},
            { $group: {
              _id: "$name",
              doc: { $first: "$$ROOT" }
            }},
            { $replaceRoot: { newRoot: "$doc" }}
        ]);
        
        // Send the correct response
        return res.status(200).json({
            success: true,
            data: results
        })
    }

    catch {
        // Check for errors in the regular expression
        if (error instanceof SyntaxError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid prefix pattern',
                error: error.message
            })
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
})


// Handle composition search
router.get("/composition", async (req, res) => {
    try {
        const searchRegex = new RegExp(`${req.query.keyword}`, options = 'i')
        
        const results = await Medicine.distinct('composition', {
            composition: {$regex: searchRegex}
        })
        
        // Send the correct response
        return res.status(200).json({
            success: true,
            data: results
        })
    }
    catch {
        // Check for errors in the regular expression
        if (error instanceof SyntaxError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid prefix pattern',
                error: error.message
            })
        }

        // Handle other errors
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
})

module.exports = router;